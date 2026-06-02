# запуск
# python3 udp_server.py 

import socket
import time
from datetime import datetime

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
while True:
    s.sendto(
        str(datetime.now().strftime("%H:%M:%S")).encode(),
        ("255.255.255.255", 5000)
    )
    time.sleep(1)