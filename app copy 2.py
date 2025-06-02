import os

from flask import Flask, render_template

app = Flask(__name__)

def get_css_files():
    css_folder = os.path.join(app.static_folder, 'css')
    return [f'css/{f}' for f in os.listdir(css_folder) if f.endswith('.css')]


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

if __name__ == '__main__':
    app.run(debug=True)