from pathlib import Path

# trim watchlistService
p = Path("src/services/watchlistService.ts")
text = p.read_text(encoding="utf-8")
marker = "\n/**"
idx = text.rfind(marker)
if idx != -1 and "toTradingViewSymbol" in text[idx:]:
    p.write_text(text[:idx].rstrip() + "\n", encoding="utf-8", newline="\n")
    print("trimmed watchlistService")

# ensure symbol exchange service utf8
for f in [
    "src/services/symbolExchangeService.ts",
    "src/components/TradingViewChart.tsx",
    "tsconfig.app.json",
]:
    path = Path(f)
    raw = path.read_bytes()
    if len(raw) >= 2 and raw[1] == 0:
        path.write_text(raw.decode("utf-16-le").lstrip("\ufeff"), encoding="utf-8", newline="\n")
        print("converted", f)

print("done")
