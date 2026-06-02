# запуск после запуска сервера
# python3 client.py 

import socket

s = socket.socket()
s.connect(("127.0.0.1", 5000))
s.send(input("command: ").encode())
while True:
    data = s.recv(1024)
    if not data: break
    print(data.decode(), end="")