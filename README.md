# btc-race-24h — dip-buy bot for cbBTC/USDC

Long-only bot for make.fun's `btc-race-24h` window. It sits flat and buys a washout:
when the close sits 3.30% below the highest close of the last 120 one-minute bars, it
buys 98% of cash; it exits after 120 bars. Sizing is capped against the latest close's
pool depth so the modelled impact stays under 5 bps.

On the published dev window it nets **+12.11 USDC** where buy-and-hold loses 44.01,
EMA crossover loses 134.95, and every moving-average variant loses money.

## Run it

```sh
MAKEFUN_INPUT_DIR=... node main.ts   # via the kit: makefun grade-local --bot . --driver process
```

## Files

- `main.ts` — the strategy, on the kit's official `bars-replay/v1` shim
- `vendor/makefun-bars.ts` — the kit shim, copied byte for byte (excluded from authorship)
