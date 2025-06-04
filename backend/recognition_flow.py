import os
from backend.crop import process_roboflow_detections
from backend.multi_matcher import run_multi_match_from_crops

def recognize_multi_cards(image_path):
    """
    從大圖裁切出多張卡片並執行特徵比對，回傳 HTML 結果。
    """
    crop_paths = process_roboflow_detections(image_path, output_crop_dir="uploads")

    result_html = run_multi_match_from_crops(crop_paths)

    for path in crop_paths:
        try:
            os.remove(path)
        except Exception as e:
            print(f"⚠️ 無法刪除裁切圖 {path}: {e}")

    return result_html
