# In dashboard_project/some_app/services.py
import requests

def get_venue_name():
    url = 'https://dashboard.gamenest.se/api/getVenuename/'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None
