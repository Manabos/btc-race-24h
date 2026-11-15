// language: TypeScript (Node 22, stdlib only), file: main.ts
// btc-race-24h — long-only dip buyer for cbBTC against USDC, on the official shim.
//
// The dev window falls 3.9% across its 1,440 bars, which kills every bot that holds
// through it: buy-and-hold -44 USDC, EMA cross -135, ADX momentum -87, RSI/Bollinger
// -57, and every moving-average variant from 5 to 240 bars loses money, the fast ones
// badly. Cash earns nothing and the replay is long only, so the only shape with a
// positive expectation is to sit flat and buy a washout that mean-reverts, then leave.
//
// The thresholds below come from a sweep of the published dev window: the profitable
// region is broad (37 of 50 parameter pairs around it end positive, from 0.3 to 12 USDC),
// so the choice is deliberately the middle of that region rather than its peak. A knife
// edge tuned to one window does not survive a different 24 hours; a threshold that is
// positive across a band of nearby values is the honest bet.
//
// Sizing caps against state.depthAt(), the latest close's pool depth — the fill's own
// open depth is not knowable when the order is decided — and the order carries a
// slippage bound comfortably above the modelled 2 bps plus its own impact.

import { runBars } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';
const LOOKBACK = 120;       // bars in the highest-close window
const DROP_BPS = 330n;      // 3.30% below that high
const HOLD_BARS = 120;      // bars held before the exit
const SIZE_BPS = 9_800n;    // 98% of cash per entry
const BPS = 10_000n;
const IMPACT_CAP_BPS = 5n;  // keep the modelled impact under 5 bps of the pool

const closes: bigint[] = [];
let entryBar = -1;
let barCount = 0;

await runBars({
  onBatch(state, batch) {
    const bar = batch.bars.find((b) => b.symbol === SYMBOL);
    if (!bar) return [];

    barCount += 1;
    const close = BigInt(bar.c);
    closes.push(close);
    if (closes.length > LOOKBACK + 1) closes.shift();

    const pos = state.positions.get(SYMBOL);
    const qty = pos ? pos.qty : 0n;

    if (qty > 0n) {
      if (entryBar >= 0 && barCount - entryBar >= HOLD_BARS) {
        entryBar = -1;
        return [{ side: 'sell' as const, symbol: SYMBOL, qty: qty.toString(), max_slippage_bps: 80 }];
      }
      return [];
    }

    if (closes.length < 30) return [];
    let high = closes[0];
    for (const v of closes) if (v > high) high = v;
    if (high <= 0n) return [];

    if (((high - close) * BPS) / high < DROP_BPS) return [];

    const spend = (state.cash * SIZE_BPS) / BPS;
    let notional = spend;
    const depth = state.depthAt(SYMBOL);
    if (depth && depth.length > 0) {
      const room = (depth[0] * IMPACT_CAP_BPS) / BPS;
      if (room > 0n && room < notional) notional = room;
    }
    if (notional < 2_000_000n) return [];

    entryBar = barCount;
    return [{
      side: 'buy' as const,
      symbol: SYMBOL,
      notional_quote_units: notional.toString(),
      max_slippage_bps: 80,
    }];
  },
});
