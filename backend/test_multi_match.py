import os
from backend.recognition_flow import recognize_multi_cards

def test_multi_match(image_path, output_html="result.html"):
    print(f"🔍 測試圖片：{image_path}")
    result_html = recognize_multi_cards(image_path)

    with open(output_html, "w", encoding="utf-8") as f:
        f.write(f"""
        <html>
        <head><meta charset="UTF-8"><title>多卡辨識結果</title></head>
        <body>
            <h2>多卡辨識結果</h2>
            {result_html}
        </body>
        </html>
        """)
    print(f"📄 辨識結果已輸出到：{output_html}")

if __name__ == "__main__":
    image_path = "uploads/test_multi.png"
    if not os.path.exists(image_path):
        print("❌ 請先放一張測試圖片到 uploads/test_multi.png")
    else:
        test_multi_match(image_path)
