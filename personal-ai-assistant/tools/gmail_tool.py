import base64
from email.mime.text import MIMEText

from googleapiclient.discovery import build

from auth.google_auth import authenticate


def get_gmail_service():
    creds = authenticate()
    return build("gmail", "v1", credentials=creds)


def read_latest_emails(max_results=5):
    service = get_gmail_service()

    results = (
        service.users()
        .messages()
        .list(userId="me", maxResults=max_results)
        .execute()
    )

    return results.get("messages", [])


def search_emails(query, max_results=5):
    service = get_gmail_service()

    results = (
        service.users()
        .messages()
        .list(
            userId="me",
            q=query,
            maxResults=max_results
        )
        .execute()
    )

    return results.get("messages", [])


def get_email_details(message_id):
    service = get_gmail_service()

    message = (
        service.users()
        .messages()
        .get(userId="me", id=message_id, format="full")
        .execute()
    )

    headers = message["payload"]["headers"]

    def get_header(name):
        for h in headers:
            if h["name"] == name:
                return h["value"]
        return ""

    return {
        "id": message["id"],
        "subject": get_header("Subject"),
        "from": get_header("From"),
        "to": get_header("To"),
        "date": get_header("Date"),
        "snippet": message.get("snippet", "")
    }


def send_email(to, subject, body):
    service = get_gmail_service()

    message = MIMEText(body)

    message["to"] = to
    message["subject"] = subject

    raw = base64.urlsafe_b64encode(
        message.as_bytes()
    ).decode()

    return (
        service.users()
        .messages()
        .send(
            userId="me",
            body={"raw": raw}
        )
        .execute()
    )