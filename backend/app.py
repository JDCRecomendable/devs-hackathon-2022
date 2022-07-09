import json

from flask import Flask, jsonify, request, render_template

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        return request.get_json()
    return 'hello'


@app.route('/api/v0/user/<id>/xp/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<id>/xp', methods=['GET', 'POST'])
def xp():
    if request.method == 'POST':
        pass
    return ''


@app.route('/api/v0/user/<id>/hunger/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<id>/hunger', methods=['GET', 'POST'])
def hunger():
    if request.method == 'POST':
        pass
    return ''


@app.route('/api/v0/user/<id>/sleep/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<id>/sleep', methods=['GET', 'POST'])
def sleep():
    if request.method == 'POST':
        pass
    return ''


@app.route('/api/v0/user/<id>/health/', methods=['GET'])
@app.route('/api/v0/user/<id>/health', methods=['GET'])
def health():
    if request.method == 'POST':
        pass
    return ''


@app.route('/api/v0/user/<id>/', methods=['GET'])
@app.route('/api/v0/user/<id>', methods=['GET'])
def user_info():
    return ''


@app.route('/api/v0/register-user/', methods=['POST'])
@app.route('/api/v0/register-user', methods=['POST'])
def register_user():
    return ''


if __name__ == '__main__':
    app.run()
