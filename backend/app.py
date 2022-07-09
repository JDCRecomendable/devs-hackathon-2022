from datetime import datetime

from flask import Flask, request
import sqlite3

app = Flask(__name__)


@app.route('/api/v0/user/<id>/xp/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<id>/xp', methods=['GET', 'POST'])
def xp(id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()

    record = cur.execute('SELECT {} FROM userdata WHERE userid=\'{}\''.format('xp', id)).fetchone()
    if record == None:
        return {'xp': 0, 'error': 'User ID does not exist'}, 400

    if request.method == 'POST':
        json_dict = request.get_json()
        expected_values = ['requestType', 'xp']
        for expected_value in expected_values:
            if expected_value not in json_dict:
                return {'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400
        new_record = 0
        if json_dict['requestType'] == 'append':
            new_record += record[0]
        new_record += json_dict['xp']
        cur.execute('UPDATE userdata SET {}={} WHERE userid="{}"'.format('xp', new_record, id))
        con.commit()
        return {'status': "Done"}, 200

    return {'xp': record[0]}, 200



@app.route('/api/v0/user/<id>/hunger/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<id>/hunger', methods=['GET', 'POST'])
def hunger(id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()

    record = cur.execute('SELECT {} FROM userdata WHERE userid="{}"'.format('hunger', id)).fetchone()
    if record == None:
        return {'hunger': 0, 'error': 'User ID does not exist'}, 400

    if request.method == 'POST':
        json_dict = request.get_json()
        expected_values = ['requestType', 'hunger']
        for expected_value in expected_values:
            if expected_value not in json_dict:
                return {'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400
        new_record = 0
        if json_dict['requestType'] == 'append':
            new_record += record[0]
        new_record += json_dict['hunger']
        new_record = max(0, min(100, new_record))
        cur.execute('UPDATE userdata SET {}={} WHERE userid="{}"'.format('hunger', new_record, id))
        con.commit()
        return {'status': "Done"}, 200

    return {'hunger': record[0]}, 200


def get_sleep(id='a', is_actual=False, want_datetimerecorded=False):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if is_actual:
        sleep_tuple_list = cur.execute('SELECT * FROM sleepdata WHERE userid="{}"'.format(id)).fetchall()
        sleep_tuple_list.sort(key=lambda tup: tup[3])
        print(sleep_tuple_list)
        sleep_tuple = sleep_tuple_list[-1]
    else:
        sleep_tuple = cur.execute('SELECT * FROM userpreferences WHERE userid="{}"'.format(id)).fetchone()
    return_value = [sleep_tuple[1], sleep_tuple[2]]
    if want_datetimerecorded:
        return_value.append(sleep_tuple[3])
    return return_value


def determine_sleep_points(planned_sleep_int, actual_sleep_int, grace_period, is_start):
    if is_start:
        if planned_sleep_int < 1200:
            planned_sleep_int += 2400
        if actual_sleep_int < 1200:
            actual_sleep_int += 2400
    sleep_diff = abs(actual_sleep_int - planned_sleep_int)
    if sleep_diff <= (grace_period // 2):
        return 2
    if sleep_diff <= grace_period:
        return 1
    return 0


@app.route('/api/v0/user/<id>/happiness/', methods=['GET'])
@app.route('/api/v0/user/<id>/happiness', methods=['GET'])
def happiness(id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    hunger = cur.execute('SELECT {} FROM userdata WHERE userid="{}"'.format('hunger', id)).fetchone()
    if hunger == None:
        return {'xp': 0, 'error': 'User ID does not exist'}, 400
    hunger = hunger[0]
    grace_period = cur.execute('SELECT * FROM userpreferences WHERE userid="{}"'.format(id)).fetchone()[3]
    planned_sleep = get_sleep(id, False)
    actual_sleep = get_sleep(id, True)
    sleep_start_points = determine_sleep_points(planned_sleep[0], actual_sleep[0], grace_period, True)
    sleep_end_points = determine_sleep_points(planned_sleep[1], actual_sleep[1], grace_period, False)

    happiness_value = 0.5 * hunger
    happiness_value += 12.5 * sleep_start_points
    happiness_value += 12.5 * sleep_end_points

    return {'happiness': int(happiness_value)}


@app.route('/api/v0/user/<id>/log-sleep/', methods=['POST'])
@app.route('/api/v0/user/<id>/log-sleep', methods=['POST'])
def log_sleep(id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    hunger = cur.execute('SELECT {} FROM userdata WHERE userid="{}"'.format('hunger', id)).fetchone()
    if hunger == None:
        return {'xp': 0, 'error': 'User ID does not exist'}, 400

    json_dict = request.get_json()
    expected_values = ['sleepStart', 'sleepEnd', 'dateTimeRecorded']
    for expected_value in expected_values:
        if expected_value not in json_dict:
            return {'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400

    latest_sleep_record = get_sleep(id, True, True)
    latest_sleep_datetime = datetime.strptime(latest_sleep_record[2], '%Y-%m-%d %H:%M:%S')
    posted_sleep_datetime = datetime.strptime(json_dict['dateTimeRecorded'], '%Y-%m-%d %H:%M:%S')

    if latest_sleep_datetime.date() == posted_sleep_datetime.date():
        return {
            'error': 'Sleep already recorded for today.',
            'helpMessage': 'Use the /remove-sleep endpoint with today\'s date to clear sleep record of today.',
        }, 400

    sleep_start_datetime_object = datetime.strptime(json_dict['sleepStart'], '%Y-%m-%d %H:%M:%S')
    sleep_end_datetime_object = datetime.strptime(json_dict['sleepEnd'], '%Y-%m-%d %H:%M:%S')
    sleep_start = int(sleep_start_datetime_object.strftime('%H%M'))
    sleep_end = int(sleep_end_datetime_object.strftime('%H%M'))

    if sleep_start < 1200:
        sleep_start += 2400

    cur.execute('INSERT INTO sleepdata (userid, sleepstart, sleepend, datetimerecorded) VALUES (\'{}\', \'{}\', \'{}\', \'{}\');'.format(
        id,
        sleep_start,
        sleep_end,
        json_dict['dateTimeRecorded']
    ))
    con.commit()
    return {'status': "Done"}, 200


@app.route('/api/v0/user/<id>/remove-sleep/', methods=['POST'])
@app.route('/api/v0/user/<id>/remove-sleep', methods=['POST'])
def remove_sleep(id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    hunger = cur.execute('SELECT {} FROM userdata WHERE userid="{}"'.format('hunger', id)).fetchone()
    if hunger == None:
        return {'xp': 0, 'error': 'User ID does not exist'}, 400

    json_dict = request.get_json()
    expected_values = ['dateTimeRecorded']
    for expected_value in expected_values:
        if expected_value not in json_dict:
            return {'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400

    user_datetime_string = json_dict['dateTimeRecorded']
    user_datetime = datetime.strptime(user_datetime_string[:10], '%Y-%m-%d')

    sleep_tuple_list = cur.execute('SELECT * FROM sleepdata WHERE userid="{}"'.format(id)).fetchall()
    sleep_tuple_list.sort(key=lambda tup: tup[3], reverse=True)
    for sleep_tuple in sleep_tuple_list:
        sleep_datetime_string = sleep_tuple[-1]
        sleep_datetime = datetime.strptime(sleep_datetime_string, '%Y-%m-%d %H:%M:%S')
        if user_datetime.date() == sleep_datetime.date():
            cur.execute('DELETE FROM sleepdata WHERE userid="{}" AND datetimerecorded="{}"'.format(id, sleep_datetime_string))
            con.commit()
            return {'status': "Done"}, 200
    return {'error': 'Record at input date does not exist'}, 400




# @app.route('/api/v0/register-user/', methods=['POST'])
# @app.route('/api/v0/register-user', methods=['POST'])
# def register_user():
#     return ''


if __name__ == '__main__':
    app.run()
