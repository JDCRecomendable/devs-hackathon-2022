import json
import sqlite3
from datetime import datetime

from flask import Flask, request

app = Flask(__name__)


def craft_response(json_body, status_code):
    response = app.response_class(
        response=json.dumps(json_body),
        status=status_code,
        mimetype='application/json'
    )
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


def user_id_is_invalid(cursor, user_id):
    record = cursor.execute('SELECT {} FROM userdata WHERE userid=\'{}\''.format('xp', user_id)).fetchone()
    return record is None


@app.route('/api/v0/user/<user_id>/xp/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<user_id>/xp', methods=['GET', 'POST'])
def xp(user_id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if user_id_is_invalid(cur, user_id):
        return craft_response({'status': 'Error', 'xp': 0, 'error': 'User ID does not exist'}, 400)

    record = cur.execute('SELECT {} FROM userdata WHERE userid=\'{}\''.format('xp', user_id)).fetchone()

    if request.method == 'POST':
        json_dict = request.get_json()
        expected_values = ['requestType', 'value']
        for expected_value in expected_values:
            if expected_value not in json_dict:
                return craft_response({'status': 'Error', 'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400)
        new_record = record[0]
        if json_dict['requestType'] == 'add':
            new_record += json_dict['value']
        elif json_dict['requestType'] == 'subtract':
            new_record -= json_dict['value']
        elif json_dict['requestType'] == 'set':
            new_record = json_dict['value']
        new_record = max(0, new_record)
        cur.execute('UPDATE userdata SET {}={} WHERE userid="{}"'.format('xp', new_record, user_id))
        con.commit()
        return craft_response({'status': 'Done'}, 200)

    return craft_response({'status': 'Done', 'xp': record[0]}, 200)


@app.route('/api/v0/user/<user_id>/hunger/', methods=['GET', 'POST'])
@app.route('/api/v0/user/<user_id>/hunger', methods=['GET', 'POST'])
def hunger(user_id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if user_id_is_invalid(cur, user_id):
        return craft_response({'status': 'Error', 'hunger': 0, 'error': 'User ID does not exist'}, 400)

    record = cur.execute('SELECT {} FROM userdata WHERE userid="{}"'.format('hunger', user_id)).fetchone()

    if request.method == 'POST':
        json_dict = request.get_json()
        expected_values = ['requestType', 'value']
        for expected_value in expected_values:
            if expected_value not in json_dict:
                return craft_response({'status': 'Error', 'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400)
        new_record = record[0]
        if json_dict['requestType'] == 'add':
            new_record += json_dict['value']
        elif json_dict['requestType'] == 'subtract':
            new_record -= json_dict['value']
        elif json_dict['requestType'] == 'set':
            new_record = json_dict['value']

        if new_record > 100:
            status_message = 'Hunger exceeded 100. Setting back to 100.'
        elif new_record < 0:
            status_message = 'Hunger below 0. Setting back to 0.'
        else:
            status_message = 'Done'

        new_record = max(0, min(100, new_record))
        cur.execute('UPDATE userdata SET {}={} WHERE userid="{}"'.format('hunger', new_record, user_id))
        con.commit()
        return craft_response({'status': status_message}, 200)

    return craft_response({'status': 'Done', 'hunger': record[0]}, 200)


def get_sleep(user_id='a', is_actual=False, want_date_time_recorded=False):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if is_actual:
        sleep_tuple_list = cur.execute('SELECT * FROM sleepdata WHERE userid="{}"'.format(user_id)).fetchall()
        sleep_tuple_list.sort(key=lambda tup: tup[3])
        print(sleep_tuple_list)
        sleep_tuple = sleep_tuple_list[-1]
    else:
        sleep_tuple = cur.execute('SELECT * FROM userpreferences WHERE userid="{}"'.format(user_id)).fetchone()
    return_value = [sleep_tuple[1], sleep_tuple[2]]
    if want_date_time_recorded:
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


@app.route('/api/v0/user/<user_id>/happiness/', methods=['GET'])
@app.route('/api/v0/user/<user_id>/happiness', methods=['GET'])
def happiness(user_id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if user_id_is_invalid(cur, user_id):
        return craft_response({'status': 'Error', 'happiness': 0, 'error': 'User ID does not exist'}, 400)

    hunger_value = cur.execute('SELECT {} FROM userdata WHERE userid="{}"'.format('hunger', user_id)).fetchone()[0]
    grace_period = cur.execute('SELECT * FROM userpreferences WHERE userid="{}"'.format(user_id)).fetchone()[3]
    planned_sleep = get_sleep(user_id, False)
    actual_sleep = get_sleep(user_id, True)
    sleep_start_points = determine_sleep_points(planned_sleep[0], actual_sleep[0], grace_period, True)
    sleep_end_points = determine_sleep_points(planned_sleep[1], actual_sleep[1], grace_period, False)

    happiness_value = 0.5 * hunger_value
    happiness_value += 12.5 * sleep_start_points
    happiness_value += 12.5 * sleep_end_points

    return craft_response({'status': 'Done', 'happiness': int(happiness_value)}, 200)


@app.route('/api/v0/user/<user_id>/log-sleep/', methods=['POST'])
@app.route('/api/v0/user/<user_id>/log-sleep', methods=['POST'])
def log_sleep(user_id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if user_id_is_invalid(cur, user_id):
        return craft_response({'status': 'Error', 'error': 'User ID does not exist'}, 400)

    json_dict = request.get_json()
    expected_values = ['sleepStart', 'sleepEnd', 'dateTimeRecorded']
    for expected_value in expected_values:
        if expected_value not in json_dict:
            return craft_response({'status': 'Error', 'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400)

    user_sleep_datetime = datetime.strptime(json_dict['dateTimeRecorded'], '%Y-%m-%d %H:%M:%S')

    sleep_tuple_list = cur.execute('SELECT * FROM sleepdata WHERE userid="{}"'.format(user_id)).fetchall()
    sleep_tuple_list.sort(key=lambda tup: tup[3], reverse=True)
    for sleep_tuple in sleep_tuple_list:
        sleep_datetime_string = sleep_tuple[-1]
        sleep_datetime = datetime.strptime(sleep_datetime_string, '%Y-%m-%d %H:%M:%S')
        if user_sleep_datetime.date() == sleep_datetime.date():
            return craft_response({
                'status': 'Error',
                'error': 'Sleep already recorded for target day.',
                'helpMessage': 'Use the /remove-sleep endpoint with target date to clear sleep record for that day.',
            }, 400)

    sleep_start_datetime_object = datetime.strptime(json_dict['sleepStart'], '%Y-%m-%d %H:%M:%S')
    sleep_end_datetime_object = datetime.strptime(json_dict['sleepEnd'], '%Y-%m-%d %H:%M:%S')
    sleep_start = int(sleep_start_datetime_object.strftime('%H%M'))
    sleep_end = int(sleep_end_datetime_object.strftime('%H%M'))

    if sleep_start < 1200:
        sleep_start += 2400

    cur.execute(
        'INSERT INTO sleepdata VALUES (\'{}\', \'{}\', \'{}\', \'{}\');'.format(
            user_id,
            sleep_start,
            sleep_end,
            json_dict['dateTimeRecorded']
        ))
    con.commit()
    return craft_response({'status': "Done"}, 200)


@app.route('/api/v0/user/<user_id>/remove-sleep/', methods=['POST'])
@app.route('/api/v0/user/<user_id>/remove-sleep', methods=['POST'])
def remove_sleep(user_id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if user_id_is_invalid(cur, user_id):
        return craft_response({'status': 'Error', 'error': 'User ID does not exist'}, 400)

    json_dict = request.get_json()
    expected_values = ['dateTimeRecorded']
    for expected_value in expected_values:
        if expected_value not in json_dict:
            return craft_response({'status': 'Error', 'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400)

    user_datetime_string = json_dict['dateTimeRecorded']
    user_datetime = datetime.strptime(user_datetime_string[:10], '%Y-%m-%d')

    sleep_tuple_list = cur.execute('SELECT * FROM sleepdata WHERE userid="{}"'.format(user_id)).fetchall()
    sleep_tuple_list.sort(key=lambda tup: tup[3], reverse=True)
    for sleep_tuple in sleep_tuple_list:
        sleep_datetime_string = sleep_tuple[-1]
        sleep_datetime = datetime.strptime(sleep_datetime_string, '%Y-%m-%d %H:%M:%S')
        if user_datetime.date() == sleep_datetime.date():
            cur.execute(
                'DELETE FROM sleepdata WHERE userid="{}" AND datetimerecorded="{}"'.format(
                    user_id,
                    sleep_datetime_string
                )
            )
            con.commit()
            return craft_response({'status': "Done"}, 200)
    return craft_response({'status': 'Error', 'error': 'Record at input date does not exist'}, 400)


@app.route('/api/v0/user/<user_id>/get-food/', methods=['POST'])
@app.route('/api/v0/user/<user_id>/get-food', methods=['POST'])
def get_food(user_id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if user_id_is_invalid(cur, user_id):
        return craft_response({'status': 'Error', 'error': 'User ID does not exist'}, 400)

    json_dict = request.get_json()
    expected_values = ['value']
    for expected_value in expected_values:
        if expected_value not in json_dict:
            return craft_response({'status': 'Error', 'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400)

    food_cost = json_dict['value']
    xp_at_hand = cur.execute('SELECT {} FROM userdata WHERE userid=\'{}\''.format('xp', user_id)).fetchone()[0]
    hunger_value = cur.execute('SELECT {} FROM userdata WHERE userid="{}"'.format('hunger', user_id)).fetchone()[0]

    if food_cost > xp_at_hand:
        return craft_response({'status': 'Not enough XP.'}, 200)
    if food_cost < 0:
        return craft_response({'status': 'Error', 'error': 'Negative amount.'}, 400)

    new_xp = xp_at_hand - food_cost

    new_hunger = hunger_value
    if food_cost >= 100:
        new_hunger += 2
    elif food_cost >= 500:
        new_hunger += 15
    elif food_cost >= 1000:
        new_hunger += 40
    elif food_cost >= 1000:
        new_hunger += 90
    else:
        new_hunger += 1

    if new_hunger > 100:
        new_hunger = 100

    cur.execute('UPDATE userdata SET {}={} WHERE userid="{}"'.format('xp', new_xp, user_id))
    cur.execute('UPDATE userdata SET {}={} WHERE userid="{}"'.format('hunger', new_hunger, user_id))
    con.commit()
    return craft_response({'status': 'Done'}, 200)


@app.route('/api/v0/reset-user/', methods=['POST'])
@app.route('/api/v0/reset-user', methods=['POST'])
def register_user():
    con = sqlite3.connect('store.db')
    cur = con.cursor()

    json_dict = request.get_json()
    expected_values = ['ID']
    for expected_value in expected_values:
        if expected_value not in json_dict:
            return craft_response({'status': 'Error', 'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400)

    cur.execute('DELETE FROM userdata WHERE userid="{}"'.format(json_dict['ID']))
    cur.execute(
        'INSERT INTO userdata VALUES (\'{}\', \'{}\', \'{}\', \'{}\');'.format(
            json_dict['ID'],
            5000,
            100,
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ))
    con.commit()
    return craft_response({'status': "Done"}, 200)


@app.route('/api/v0/user/<user_id>/set-user-preferences/', methods=['POST'])
@app.route('/api/v0/user/<user_id>/set-user-preferences', methods=['POST'])
def set_user_preferences(user_id='a'):
    con = sqlite3.connect('store.db')
    cur = con.cursor()
    if user_id_is_invalid(cur, user_id):
        return craft_response({'status': 'Error', 'error': 'User ID does not exist'}, 400)

    json_dict = request.get_json()
    expected_values = ['startHour', 'startMinute', 'endHour', 'endMinute', 'gracePeriod']
    for expected_value in expected_values:
        if expected_value not in json_dict:
            return craft_response({'status': 'Error', 'error': 'Missing parameter: `{}`.'.format(expected_value)}, 400)

    start_minute_string = str(json_dict['startMinute'])
    end_minute_string = str(json_dict['endMinute'])

    if len(start_minute_string) == 1:
        start_minute_string = '0' + start_minute_string

    if len(end_minute_string) == 1:
        end_minute_string = '0' + end_minute_string


    cur.execute('DELETE FROM userpreferences WHERE userid="{}"'.format(user_id))
    cur.execute(
        'INSERT INTO userpreferences VALUES (\'{}\', \'{}\', \'{}\', \'{}\', \'{}\');'.format(
            user_id,
            int(str(json_dict['startHour']) + start_minute_string),
            int(str(json_dict['endHour']) + end_minute_string),
            json_dict['gracePeriod'],
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ))
    con.commit()
    return craft_response({'status': "Done"}, 200)


if __name__ == '__main__':
    app.run()
