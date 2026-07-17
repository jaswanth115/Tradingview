import json
import urllib.request

tests = [
    (
        "yahoo",
        "https://query1.finance.yahoo.com/v1/finance/search?q=NVDA&quotesCount=5&newsCount=0",
    ),
    (
        "nasdaq",
        "https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true",
    ),
]

for name, url in tests:
    print("===", name, "===")
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
            },
        )
        with urllib.request.urlopen(req, timeout=20) as response:
            body = response.read().decode("utf-8", "replace")
            print(body[:800])
    except Exception as error:
        print("error:", error)
