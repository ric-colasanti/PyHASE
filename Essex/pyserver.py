from flask import Flask, render_template, request
from flask_socketio import SocketIO
from random import random
from threading import Lock
import webbrowser
import asyncio
# then make a url variable
url = "http://127.0.0.1:5000"
# then call the default open method described above


"""
Background Thread
"""
thread = None
thread_lock = Lock()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'donsky!'
socketio = SocketIO(app, cors_allowed_origins='*')
multi = 100
"""
Generate random sequence of dummy sensor values and send it to our clients
"""


def background_thread():
    print("Generating random sensor values")
    while True:
        global multi
        dummy_value = {'value': round(random() * multi, 3)}
        socketio.emit('updateSensorData', dummy_value)
        socketio.sleep(1)

def runBrowser():
    socketio.sleep(1)
    webbrowser.open("http://127.0.0.1:5000")


"""
Serve root index file
"""


@app.route('/')
def index():
    return render_template('small.html')


"""
Decorator for change
"""


@socketio.on('change')
def change(data):
    global multi
    print("8", data)
    multi = int(data["data"])


"""
Decorator for connected
"""


@socketio.on('connected')
def connected(data):
    print(data)
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)


"""
Decorator for connect
"""


@socketio.on('connect')
def connect():
    print('Client connected')


"""
Decorator for disconnect
"""


@socketio.on('disconnect')
def disconnect():
    print('Client disconnected',  request.sid)


if __name__ == '__main__':
    runBrowser()
    socketio.run(app)
