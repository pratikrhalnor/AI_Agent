import os
import msal
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("OUTLOOK_CLIENT_ID")

AUTHORITY = "https://login.microsoftonline.com/consumers"

SCOPES = [
    "User.Read",
    "Mail.Read",
    "Mail.ReadWrite",
    "Mail.Send",
    "Calendars.Read",
    "Calendars.ReadWrite",
]

CACHE_FILE = "token_cache.bin"


def load_cache():
    cache = msal.SerializableTokenCache()

    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            cache.deserialize(f.read())

    return cache


def save_cache(cache):
    if cache.has_state_changed:
        with open(CACHE_FILE, "w") as f:
            f.write(cache.serialize())


def get_access_token():

    cache = load_cache()

    app = msal.PublicClientApplication(
        client_id=CLIENT_ID,
        authority=AUTHORITY,
        token_cache=cache,
    )

    accounts = app.get_accounts()

    if accounts:

        result = app.acquire_token_silent(
            scopes=SCOPES,
            account=accounts[0]
        )

        if result and "access_token" in result:
            save_cache(cache)
            return result["access_token"]

    flow = app.initiate_device_flow(scopes=SCOPES)

    if "user_code" not in flow:
        raise Exception("Failed to create device flow")

    print(flow["message"])

    result = app.acquire_token_by_device_flow(flow)

    if "access_token" not in result:
        raise Exception(result)

    save_cache(cache)

    return result["access_token"]