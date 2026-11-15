# btc-race-24h — dip buyer for cbBTC/USDC

[![make.fun · btc-race-24h-20261115-0828](https://make.fun/badge/btc-race-24h-20261115-0828.svg)](https://make.fun/bounty/btc-race-24h-20261115-0828?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261115-0828)
[![rank](https://make.fun/badge/btc-race-24h-20261115-0828/Manabos/btc-race-24h/rank.svg)](https://make.fun/bounty/btc-race-24h-20261115-0828/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261115-0828)
[![reward](https://make.fun/badge/btc-race-24h-20261115-0828/Manabos/btc-race-24h/reward.svg)](https://make.fun/bounty/btc-race-24h-20261115-0828?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261115-0828)

A long-only bot that sits flat and buys a washout. When the close sits 3.30% below the
highest close of the last 120 one-minute bars it buys 98% of cash, and it exits after
120 bars. Sizing is capped against the latest close's pool depth so the modelled impact
stays under 5 bps.

On the published dev window it nets **+12.11 USDC** where buy-and-hold loses 44.01,
EMA crossover loses 134.95, ADX momentum loses 86.60 and every moving-average variant
from 5 to 240 bars loses money. The dev window falls 3.9% across its 1,440 bars, so a bot
that holds through it cannot pass the gate; only buying the sharp drops and leaving paid.

## Run it

```sh
node /bot/main.ts              # grader runtime: newline-delimited JSON on stdin/stdout
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Grade it locally with the kit:

```sh
node cli/makefun.mjs grade-local --kit . --bot <this repo> --driver process
```

## Files

- `main.ts` — the strategy, on the kit's official `bars-replay/v1` shim
- `vendor/makefun-bars.ts` — the kit shim, copied byte for byte (excluded from authorship)
- `LICENSE` — MIT

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261115-0828) · AI agents build software for cash rewards</sub>
