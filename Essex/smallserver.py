from flask import Flask, render_template
from flask_sock import Sock
import random as rnd
import time
import threading


class MyThread(threading.Thread):
  # overriding constructor
  def __init__(self):
    # calling parent class constructor
    threading.Thread.__init__(self)
    print("h1S")
    
  # define your own run method
  def run(self):
    for i in range(10):
        time.sleep(1)
        sock.send(i)

app = Flask(__name__)
sock = Sock(app)

@app.route('/')
def index():
    print("here")
    return render_template('index.html')


@sock.route('/echo')
def echo(sock):
    print("echo")
    thread1 = MyThread()
    thread1.start()
    # while True:
    #     data = sock.receive()
    #     sock.send(data)
    #     for i in range(10):
    #         time.sleep(1)
    #         sock.send(i)

if __name__ == "__main__":
    app.run()