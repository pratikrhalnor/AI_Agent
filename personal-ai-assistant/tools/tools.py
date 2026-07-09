from langchain_core.tools import tool


from tools.gmail_tool import (
    read_latest_emails,
    search_emails,
    get_email_details,
    send_email,
)

from tools.calendar_tool import (
    list_events,
    create_event,
)


@tool
def latest_email() -> dict:
    """Read the user's latest Gmail email."""

    emails = read_latest_emails(1)

    if not emails:
        return {"message": "No emails found."}

    return get_email_details(emails[0]["id"])


@tool
def search_email(query: str) -> str:
    """
    Search Gmail.

    Examples:
    from:instagram
    from:linkedin
    subject:Interview
    is:unread
    newer_than:7d
    """

    emails = search_emails(query)

    if not emails:
        return []

    return [
        get_email_details(email["id"])
        for email in emails
    ]


@tool
def send_gmail(
    to: str,
    subject: str,
    body: str,
) -> str:
    """
    Send an email.

    Args:
        to: Recipient email address
        subject: Email subject
        body: Email body
    """

    send_email(to, subject, body)

    return "Email sent successfully."


@tool
def upcoming_events() -> list:
    """Return upcoming Google Calendar events."""

    events = list_events()

    if not events:
        return []

    output = []

    for event in events:

        start = event["start"].get(
            "dateTime",
            event["start"].get("date")
        )

        output.append(
            {
                "id": event["id"],
                "summary": event.get("summary", "No Title"),
                "start": start,
            }
        )

    return output


@tool
def add_calendar_event(
    summary: str,
    start: str,
    end: str,
    description: str = "",
) -> str:
    """
    Create a Google Calendar event.

    Datetime format:
    2026-07-10T10:00:00+05:30
    """

    create_event(
        summary=summary,
        start=start,
        end=end,
        description=description,
    )

    return "Calendar event created successfully."
@tool
def delete_calendar_event(event_id: str) -> str:
    """
    Delete a Google Calendar event.

    Args:
        event_id: The ID of the calendar event.
    """

    delete_event(event_id)

    return "Calendar event deleted successfully."
