import os
from flask import Flask, render_template, request, Response
from backend.matcher import process_image
from backend.recognize_multi import recognize_multi_cards

app = Flask(__name__)

def get_css_files():
    css_folder = os.path.join(app.static_folder, 'css')
    return [f'css/{f}' for f in os.listdir(css_folder) if f.endswith('.css')]

# ----------- 頁面路由 -----------
@app.route('/')
def index():
    return render_template('index.html', css_files=get_css_files())

@app.route('/about')
def about():
    return render_template('about.html', css_files=get_css_files())

@app.route('/one')
def one():
    return render_template('one.html', css_files=get_css_files())

@app.route('/all')
def all():
    return render_template('all.html', css_files=get_css_files())

@app.route('/choice')
def choice():
    return render_template('choice.html', css_files=get_css_files())

# ----------- 單卡辨識 -----------
@app.route('/match_one', methods=['POST'])
def match_one():
    file = request.files.get("image")
    if not file:
        print("❌ 沒有收到圖片")
        return Response("<p>❌ 請正確上傳一張圖檔</p>", status=400, mimetype='text/html; charset=utf-8')

    img_data = file.read()
    temp_path = os.path.join("uploads", "temp.jpg")

    try:
        result_html = process_image(img_data)
        return Response(result_html, mimetype='text/html; charset=utf-8')
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(f"<p>處理錯誤：{str(e)}</p>", status=500, mimetype='text/html; charset=utf-8')
    finally:
        try:
            os.remove(temp_path)
        except Exception as e:
            print(f"⚠️ 無法刪除上傳圖檔: {e}")

# ----------- 多卡辨識 -----------
@app.route('/match_all', methods=['POST'])
def match_all():
    file = request.files.get("image")
    if not file:
        print("❌ 沒有收到圖片")
        return Response("<p>❌ 請正確上傳一張圖檔</p>", status=400, mimetype='text/html; charset=utf-8')

    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    image_path = os.path.join(upload_dir, "multi_temp.jpg")
    file.save(image_path)

    try:
        result_html = recognize_multi_cards(image_path)
        return Response(result_html, mimetype='text/html; charset=utf-8')
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(f"<p>處理錯誤：{str(e)}</p>", status=500, mimetype='text/html; charset=utf-8')
    finally:
        try:
            os.remove(image_path)
        except Exception as e:
            print(f"⚠️ 無法刪除上傳圖檔: {e}")

# ----------- 分類模式（保留路由，但尚未使用）-----------
@app.route('/match_choice', methods=['POST'])
def match_choice():
    return Response("<p>⚠️ 尚未實作分類選擇模式</p>", mimetype='text/html; charset=utf-8')

# ----------- 啟動 -----------
if __name__ == '__main__':
    app.run(debug=True)
