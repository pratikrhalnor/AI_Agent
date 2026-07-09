from assistant.agent import agent

while True:

    query = input("You: ")

    if query.lower() == "exit":
        break

    response = agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": query,
                }
            ]
        }
    )

    print(response["messages"][-1].content)