from datetime import datetime

from googleapiclient.discovery import build

from auth.google_auth import authenticate


def get_calendar_service():
    creds = authenticate()
    return build("calendar", "v3", credentials=creds)


def list_events(max_results=10):
    service = get_calendar_service()

    now = datetime.utcnow().isoformat() + "Z"

    events = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=now,
            maxResults=max_results,
            singleEvents=True,
            orderBy="startTime"
        )
        .execute()
    )

    return events.get("items", [])


def create_event(summary, start, end, description=""):
    service = get_calendar_service()

    event = {
        "summary": summary,
        "description": description,
        "start": {
            "dateTime": start,
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": end,
            "timeZone": "Asia/Kolkata",
        },
    }

    return service.events().insert(
        calendarId="primary",
        body=event
    ).execute()


def delete_event(event_id):
    service = get_calendar_service()

    service.events().delete(
        calendarId="primary",
        eventId=event_id
    ).execute()

    return "Deleted"