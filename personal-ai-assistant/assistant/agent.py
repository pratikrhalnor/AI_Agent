from langgraph.prebuilt import create_react_agent

from assistant.llm import llm

from tools.tools import (
    latest_email,
    search_email,
    send_gmail,
    upcoming_events,
    add_calendar_event,
    delete_calendar_event,
)

tools = [
    latest_email,
    search_email,
    send_gmail,
    upcoming_events,
    add_calendar_event,
    delete_calendar_event,
]

agent = create_react_agent(
    model=llm,
    tools=tools,
)