import os
from flask import Flask, render_template, request, Response

app = Flask(__name__)

def get_css_files():
    css_folder = os.path.join(app.static_folder, 'css')
    return [f'css/{f}' for f in os.listdir(css_folder) if f.endswith('.css')]

def process_image_one(category, img_data):
    return render_template('one.html', css_files=get_css_files(), result="這是一張卡片辨識結果")

def process_image_all(category, img_data):
    return render_template('all.html', css_files=get_css_files(), result="全部卡片辨識結果")

def process_image_choice(category, img_data):
    return render_template('choice.html', css_files=get_css_files(), result="選擇卡片辨識結果")

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

@app.route('/match_one', methods=['POST'])
@app.route('/match_all', methods=['POST'])
@app.route('/match_choice', methods=['POST'])
def match():
    category = request.form.get("category")
    file = request.files.get("image")

    if not file or not category:
        return Response("<p>❌ 請正確上傳一張圖檔</p>", status=400, mimetype='text/html; charset=utf-8') 

    img_data = file.read()
    try:
        if request.path.endswith("one"):
            return process_image_one(category, img_data)
        elif request.path.endswith("all"):
            return process_image_all(category, img_data)
        elif request.path.endswith("choice"):
            return process_image_choice(category, img_data)
        else:
            raise ValueError("未知的處理方式")
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(f"<p>處理錯誤：{str(e)}</p>", status=500, mimetype='text/html; charset=utf-8')

if __name__ == '__main__':
    app.run(debug=True)