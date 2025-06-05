# choice_flow.py

import os
import cv2
import json
from backend.box_drawer import draw_boxes
from backend.crop import crop_card  # 假設你在 crop.py 裡有一個 crop_card 函式

def process_uploaded_image(image_path, predictions, output_dir):
    """
    根據 Roboflow 回傳的預測框資料：
    1. 在圖片上畫出所有框，儲存 boxed.jpg
    2. 對每個框進行裁切，儲存 crop_0.jpg ~ crop_n.jpg

    :param image_path: 上傳圖像的路徑（原圖）
    :param predictions: Roboflow 回傳的 predictions list
    :param output_dir: 儲存裁切圖片與 boxed.jpg 的資料夾
    :return: boxed 圖片路徑, 裁切圖檔清單
    """
    os.makedirs(output_dir, exist_ok=True)
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"❌ 無法讀取圖片：{image_path}")
    height, width = img.shape[:2]

    # 儲存裁切圖的檔名
    cropped_files = []

    for i, pred in enumerate(predictions):
        x, y, w, h = int(pred["x"]), int(pred["y"]), int(pred["width"]), int(pred["height"])
        x1, y1 = max(x - w // 2, 0), max(y - h // 2, 0)
        x2, y2 = min(x + w // 2, width), min(y + h // 2, height)
        crop = img[y1:y2, x1:x2]

        if crop.size == 0:
            continue

        crop_path = os.path.join(output_dir, f"crop_{i}.jpg")
        cv2.imwrite(crop_path, crop)
        cropped_files.append(crop_path)

    # 呼叫 box_drawer 畫框與標號
    boxed_path = os.path.join(output_dir, "boxed.jpg")
    draw_boxes(image_path, predictions, boxed_path)

    return boxed_path, cropped_files
