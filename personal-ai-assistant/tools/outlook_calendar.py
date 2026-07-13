import requests

from auth.outlook_auth import get_access_token

BASE_URL = "https://graph.microsoft.com/v1.0"


def get_headers():

    token = get_access_token()

    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }


def list_events():

    response = requests.get(
        BASE_URL + "/me/events",
        headers=get_headers()
    )

    response.raise_for_status()

    return response.json()["value"]


def create_event(
    subject,
    start,
    end,
    timezone="Asia/Kolkata"
):

    payload = {
        "subject": subject,
        "start": {
            "dateTime": start,
            "timeZone": timezone
        },
        "end": {
            "dateTime": end,
            "timeZone": timezone
        }
    }

    response = requests.post(
        BASE_URL + "/me/events",
        headers=get_headers(),
        json=payload
    )

    response.raise_for_status()

    return response.json()


def delete_event(event_id):

    response = requests.delete(
        BASE_URL + f"/me/events/{event_id}",
        headers=get_headers()
    )

    response.raise_for_status()

    return "Deleted Successfully"