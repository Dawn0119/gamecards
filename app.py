from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/one')
def one():
    return render_template('one.html')

@app.route('/all')
def all():
    return render_template('all.html')

@app.route('/choice')
def choice():
    return render_template('choice.html')

if __name__ == '__main__':
    app.run(debug=True)