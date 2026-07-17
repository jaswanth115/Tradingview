import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SYMBOLS_FILE = ROOT / "src" / "data" / "sp500Symbols.ts"
OUT_FILE = ROOT / "src" / "data" / "symbolExchanges.json"

NASDAQ_URL = (
    "https://api.nasdaq.com/api/screener/stocks?"
    "tableonly=true&limit=10000&offset=0&download=true&exchange=nasdaq"
)
NYSE_URL = (
    "https://api.nasdaq.com/api/screener/stocks?"
    "tableonly=true&limit=10000&offset=0&download=true&exchange=nyse"
)


def read_symbols() -> list[str]:
    text = SYMBOLS_FILE.read_text(encoding="utf-8")
    return re.findall(r"'([^']+)'", text)


def fetch_exchange_symbols(url: str) -> set[str]:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = json.load(response)

    symbols: set[str] = set()
    for row in payload.get("data", {}).get("rows", []):
        symbol = str(row.get("symbol", "")).strip().upper()
        if symbol:
            symbols.add(symbol)
            symbols.add(symbol.replace("-", "."))
    return symbols


def yahoo_exchange(symbol: str) -> str | None:
    url = (
        "https://query1.finance.yahoo.com/v1/finance/search?"
        f"q={urllib.parse.quote(symbol)}&quotesCount=5&newsCount=0"
    )
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=20) as response:
        payload = json.load(response)

    target = symbol.upper()
    for quote in payload.get("quotes", []):
        if str(quote.get("symbol", "")).upper() != target:
            continue
        exchange = str(quote.get("exchDisp", "")).upper()
        if "NASDAQ" in exchange:
            return "NASDAQ"
        if "NYSE" in exchange:
            return "NYSE"
        if exchange:
            return exchange
    return None


def main() -> None:
    sp500_symbols = read_symbols()
    nasdaq_symbols = fetch_exchange_symbols(NASDAQ_URL)
    nyse_symbols = fetch_exchange_symbols(NYSE_URL)

    mapping: dict[str, str] = {}
    unresolved: list[str] = []

    for symbol in sp500_symbols:
        candidates = {
            symbol.upper(),
            symbol.upper().replace(".", "-"),
            symbol.upper().replace(".", ""),
        }

        if candidates & nasdaq_symbols:
            mapping[symbol] = "NASDAQ"
            continue

        if candidates & nyse_symbols:
            mapping[symbol] = "NYSE"
            continue

        try:
            exchange = yahoo_exchange(symbol)
            if exchange:
                mapping[symbol] = exchange
            else:
                unresolved.append(symbol)
        except Exception as error:
            print(f"yahoo fallback failed for {symbol}: {error}")
            unresolved.append(symbol)

    OUT_FILE.write_text(json.dumps(mapping, indent=2), encoding="utf-8", newline="\n")
    print(f"wrote {OUT_FILE} ({len(mapping)} symbols)")
    if unresolved:
        print(f"unresolved ({len(unresolved)}): {', '.join(unresolved)}")


if __name__ == "__main__":
    main()
