import json
import urllib.request

for exchange in ["nasdaq", "nyse"]:
    url = (
        "https://api.nasdaq.com/api/screener/stocks?"
        f"tableonly=true&limit=5&offset=0&download=true&exchange={exchange}"
    )
    print("===", exchange, "===")
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=20) as response:
        data = json.load(response)
    rows = data.get("data", {}).get("rows", [])
    print("rows", len(rows), "sample", [r["symbol"] for r in rows[:5]])
