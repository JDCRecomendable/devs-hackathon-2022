import json

from flask import Flask, jsonify, request, render_template
import sqlite3

app = Flask(__name__)


@app.route('/api/v0/user/<id>/xp/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<id>/xp', methods=['GET', 'POST'])
def xp(id='a'):
    if request.method == 'POST':
        return ''
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    record = cur.execute('SELECT {} FROM userdata WHERE userid=\'{}\''.format('xp', id)).fetchone()
    if record == None:
        return {'xp': 0, 'error': 'User ID does not exist'}, 400
    return {'xp': record[0]}, 200



@app.route('/api/v0/user/<id>/hunger/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<id>/hunger', methods=['GET', 'POST'])
def hunger(id='a'):
    if request.method == 'POST':
        return ''
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    record = cur.execute('SELECT {} FROM userdata WHERE userid=\'{}\''.format('hunger', id))
    if record == None:
        return {'xp': 0, 'error': 'User ID does not exist'}, 400
    return {'hunger': record[0]}, 200


def get_sleep(id='a', is_actual=False):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if is_actual:
        sleep_tuple_list = cur.execute('SELECT * FROM sleepdata WHERE userid=\'{}\''.format(id)).fetchall()
        sleep_tuple_list.sort(key=lambda tup: tup[3])
        print(sleep_tuple_list)
        sleep_tuple = sleep_tuple_list[-1]
    else:
        sleep_tuple = cur.execute('SELECT * FROM userpreferences WHERE userid=\'{}\''.format(id)).fetchone()
    return sleep_tuple[1], sleep_tuple[2]


def determine_sleep_points(planned_sleep_int, actual_sleep_int, grace_period, is_start):
    if is_start:
        if planned_sleep_int < 1200:
            planned_sleep_int += 1200
        if actual_sleep_int < 1200:
            actual_sleep_int += 1200
    sleep_diff = abs(actual_sleep_int - planned_sleep_int)
    if sleep_diff <= (grace_period // 2):
        return 2
    if sleep_diff <= grace_period:
        return 1
    return 0


@app.route('/api/v0/user/<id>/happiness/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<id>/happiness', methods=['GET', 'POST'])
def happiness(id='a'):
    if request.method == 'POST':
        return ''
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    hunger = cur.execute('SELECT {} FROM userdata WHERE userid=\'{}\''.format('hunger', id)).fetchone()[0]
    if hunger == None:
        return {'xp': 0, 'error': 'User ID does not exist'}, 400
    grace_period = cur.execute('SELECT * FROM userpreferences WHERE userid=\'{}\''.format(id)).fetchone()[3]
    planned_sleep = get_sleep(id, False)
    actual_sleep = get_sleep(id, True)
    sleep_start_points = determine_sleep_points(planned_sleep[0], actual_sleep[0], grace_period, True)
    sleep_end_points = determine_sleep_points(planned_sleep[1], actual_sleep[1], grace_period, False)

    happiness_value = 0.5 * hunger
    happiness_value += 12.5 * sleep_start_points
    happiness_value += 12.5 * sleep_end_points

    return {'happiness': int(happiness_value)}


# @app.route('/api/v0/register-user/', methods=['POST'])
# @app.route('/api/v0/register-user', methods=['POST'])
# def register_user():
#     return ''


if __name__ == '__main__':
    app.run()
