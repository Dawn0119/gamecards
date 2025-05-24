import os
import numpy as np
import cv2
import faiss
import re
from backend.image_processing import load_or_build_cache

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INFO_DIR = os.path.join(BASE_DIR, "data", "cards_info")

def process_image(category, img_data):
    # 1. 使用 SIFT 擷取上傳影像的特徵
    sift = cv2.SIFT_create()
    img = cv2.imdecode(np.frombuffer(img_data, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError("❌ 無法讀取上傳的圖像")
    
    kp1, des1 = sift.detectAndCompute(img, None)
    if des1 is None or len(kp1) == 0:
        raise ValueError("❌ 圖像中找不到足夠的特徵點")

    d = des1.shape[1]  # 特徵維度

    # 2. 讀取快取（包含所有卡片的特徵）
    paths, names, kp_attrs, descs, all_desc = load_or_build_cache(category)

    # 3. 建立或讀取 FAISS 索引
    index_path = os.path.join(os.path.dirname(INFO_DIR), "cache", f"{category}.index")
    if os.path.exists(index_path):
        index = faiss.read_index(index_path)
    else:
        quantizer = faiss.IndexFlatL2(d)
        nlist, m_pq = 100, 16
        index = faiss.IndexIVFPQ(quantizer, d, nlist, m_pq, 8)
        index.train(all_desc)
        index.add(all_desc)
        faiss.write_index(index, index_path)

    index.nprobe = 1

    # 4. 執行比對
    D, I = index.search(des1.astype('float32'), 2)
    good_per_img = [[] for _ in descs]
    boundaries = np.cumsum([len(d) for d in descs])
    for qi in range(len(des1)):
        d0, d1 = D[qi]
        if d0 < 0.85 * d1:
            tr = int(I[qi, 0])
            idx = np.searchsorted(boundaries, tr, side='right')
            start = boundaries[idx - 1] if idx > 0 else 0
            local = tr - start
            good_per_img[idx].append(cv2.DMatch(qi, local, d0))

    # 5. 找出匹配數最多的圖
    best_idx = max(range(len(good_per_img)), key=lambda i: len(good_per_img[i]), default=None)
    if best_idx is None or len(good_per_img[best_idx]) == 0:
        return "<p>❌ 沒有找到匹配的卡片</p>"

    matched_name = names[best_idx]
    card_id = matched_name[:8]

    # 6. 嘗試模糊比對資訊檔案（以 card_id 開頭）
    matches = [
        fname for fname in os.listdir(INFO_DIR)
        if fname.startswith(card_id) and fname.lower().endswith(".txt")
    ]

    if not matches:
        return f"<p>⚠️ 找到相似卡片 {matched_name}，但缺少對應資訊檔</p>"

    info_file = os.path.join(INFO_DIR, matches[0])
    print(f"🔍 匹配資訊檔案：{info_file}")

    with open(info_file, encoding="utf-8") as f:
        info = f.read()

    # 7. 格式化輸出內容（支援換行與圖片）
    info = info.replace("圖片 URL:", "")
    info = info.replace("\n", " <br>")
    info = re.sub(r"(https?://[^\s]+)", r'<img src="\1" alt="圖片" />', info)

    return info
