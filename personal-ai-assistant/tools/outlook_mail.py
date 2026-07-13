import requests

from auth.outlook_auth import get_access_token

BASE_URL = "https://graph.microsoft.com/v1.0"


def get_headers():

    token = get_access_token()

    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }


def read_latest_mail(limit=5):

    url = f"{BASE_URL}/me/messages?$top={limit}&$orderby=receivedDateTime DESC"

    response = requests.get(
        url,
        headers=get_headers()
    )

    print("Status:", response.status_code)

    if response.status_code != 200:
        print(response.text)
        response.raise_for_status()

    return response.json()["value"]


def search_mail(query):

    url = f'{BASE_URL}/me/messages?$search="{query}"'

    headers = get_headers()
    headers["ConsistencyLevel"] = "eventual"

    response = requests.get(
        url,
        headers=headers
    )

    print("Status:", response.status_code)

    if response.status_code != 200:
        print(response.text)
        response.raise_for_status()

    return response.json()["value"]


def send_mail(to, subject, body):

    url = f"{BASE_URL}/me/sendMail"

    payload = {
        "message": {
            "subject": subject,
            "body": {
                "contentType": "Text",
                "content": body
            },
            "toRecipients": [
                {
                    "emailAddress": {
                        "address": to
                    }
                }
            ]
        },
        "saveToSentItems": True
    }

    response = requests.post(
        url,
        headers=get_headers(),
        json=payload
    )

    print("Status:", response.status_code)

    if response.status_code not in [200, 202]:
        print(response.text)
        response.raise_for_status()

    return "Mail Sent Successfully"