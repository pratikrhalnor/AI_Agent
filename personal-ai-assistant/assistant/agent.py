from langgraph.prebuilt import create_react_agent

from assistant.llm import llm

from tools.tools import (
    latest_email,
    search_email,
    send_gmail,
    upcoming_events,
    add_calendar_event,
    delete_calendar_event,
    latest_outlook_email,
    search_outlook_email,
    send_outlook_email,
    upcoming_outlook_events,
    add_outlook_event,
    delete_outlook_event_tool,

)

tools = [
    # Gmail
    latest_email,
    search_email,
    send_gmail,

    # Google Calendar
    upcoming_events,
    add_calendar_event,
    delete_calendar_event,

    # Outlook Mail
    latest_outlook_email,
    search_outlook_email,
    send_outlook_email,

    # Outlook Calendar
    upcoming_outlook_events,
    add_outlook_event,
    delete_outlook_event_tool,
]

agent = create_react_agent(
    model=llm,
    tools=tools,
)