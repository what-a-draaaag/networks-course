# запуск после запуска сервера
# python3 udp_client.py 


import socket

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind(("", 5000))
while True:
    print(s.recvfrom(1024)[0].decode())