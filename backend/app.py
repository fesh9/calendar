from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

DATA_FILE = "events.json"

def read_events_from_file():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
            return data
    except FileNotFoundError:
        return []

def write_events_to_file(events):
    with open(DATA_FILE, "w", encoding="utf-8") as file:
        json.dump(events, file)

events = read_events_from_file()

@app.route('/events', methods=['GET'])
def get_events():
    return jsonify(events)

@app.route('/events', methods=['POST'])
def add_event():
    event = request.json
    events.append(event)
    write_events_to_file(events)
    return jsonify(event), 201

@app.route('/events/<id>', methods=['PUT'])
def update_event(id):
    event = request.json

    for i, existing_event in enumerate(events):
        if existing_event['id'] == id:
            events[i] = event
            write_events_to_file(events)
            return jsonify(event), 200

    return jsonify({'message': 'Event not found'}), 404

@app.route('/events/<id>', methods=['DELETE'])
def delete_event(id):
    global events
    events = [event for event in events if event['id'] != id]
    write_events_to_file(events)
    return '', 204

if __name__ == '__main__':
    app.run(port=5000)