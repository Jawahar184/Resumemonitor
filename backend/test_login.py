import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database.db import db
from auth.login import login

print("Testing Jawahar User:")
print(login({"email": "postboxno184@gmail.com", "password": "12345", "role": "User"}))
print("Testing Jawahar Admin:")
print(login({"email": "postboxno184@gmail.com", "password": "12345", "role": "Admin"}))
print("Testing Jawahar mismatch (Company):")
print(login({"email": "postboxno184@gmail.com", "password": "12345", "role": "Company"}))
