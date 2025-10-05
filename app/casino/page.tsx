"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SLOT_SYMBOLS = ["7", "STAR", "BAR", "GEM", "COIN", "CHERRY", "DIAMOND"];
const DEFAULT_BALANCE = 1000;
const STORAGE_KEY = "casino_state_v1";

type HistoryEntry = {
  id: string;
  time: string;
  action: string;
  delta: number;
  balanceAfter: number;
};

type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  time: string;
};

export default function CasinoPage() {
  const [balance, setBalance] = useState<number>(DEFAULT_BALANCE);
  const [bet, setBet] = useState<number>(50);
  const [slots, setSlots] = useState<string[]>(["", "", ""]);
  const [spinning, setSpinning] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalWagered, setTotalWagered] = useState(0);
  const [totalWon, setTotalWon] = useState(0);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  // Hoisted UI states (must be top-level to satisfy Rules of Hooks)
  const [tossWager, setTossWager] = useState<number>(50);
  const [wellAmt, setWellAmt] = useState<number>(25);
  const [leaderboardName, setLeaderboardName] = useState("");
  const [activeGame, setActiveGame] = useState<"slots" | "toss" | "well" | "shop" | "leaderboard">("slots");

  //
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.balance != null) setBalance(parsed.balance);
        if (parsed.bet != null) setBet(parsed.bet);
        if (parsed.history) setHistory(parsed.history);
        if (parsed.leaderboard) setLeaderboard(parsed.leaderboard);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const payload = { balance, bet, history, leaderboard };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [balance, bet, history, leaderboard]);

  const pushHistory = (action: string, delta: number, newBalance: number) => {
    const entry: HistoryEntry = {
      id: Math.random().toString(36).slice(2, 9),
      time: new Date().toISOString(),
      action,
      delta,
      balanceAfter: newBalance,
    };
    setHistory((h) => [entry, ...h].slice(0, 200));
  };

  // Helper: adjust bet safely
  const adjustBet = (amount: number) => {
    setBet((b) => {
      const next = Math.max(10, Math.min(balance, b + amount));
      return next;
    });
  };

  // Slots game
  const spinSlots = () => {
    if (spinning || balance < bet) return;
    setSpinning(true);
    setResultMessage(null);
    setBalance((prev) => prev - bet);
    setTotalWagered((w) => w + bet);
    setGamesPlayed((g) => g + 1);

    const spinDuration = 1200;
    const interval = 70;
    let elapsed = 0;

    const spinInterval = setInterval(() => {
      setSlots([
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ]);
      elapsed += interval;
      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);
        // final
        const final = [
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        ];
        setSlots(final);

        const allSame = final[0] === final[1] && final[1] === final[2];
        const twoSame = final[0] === final[1] || final[1] === final[2] || final[0] === final[2];

        let winAmount = 0;
        let msg = "No match. Better luck next time.";

        if (allSame) {
          if (final[0] === "7") {
            winAmount = bet * 10;
            msg = "JACKPOT — Triple 7s!";
          } else if (final[0] === "DIAMOND") {
            winAmount = bet * 8;
            msg = "Huge win — Triple Diamonds!";
          } else {
            winAmount = bet * 4;
            msg = "Nice — Triple Match!";
          }
        } else if (twoSame) {
          winAmount = bet * 2;
          msg = "Double match — you win!";
        }

        if (winAmount > 0) {
          setBalance((prev) => {
            const next = prev + winAmount;
            pushHistory(msg, winAmount, next);
            return next;
          });
          setTotalWon((t) => t + winAmount);
          setResultMessage(`${msg} +${winAmount} shells`);
        } else {
          setResultMessage(msg);
          setBalance((prev) => {
            pushHistory(msg, -bet, prev);
            return prev;
          });
        }

        setSpinning(false);
      }
    }, interval);
  };

  // Coin Toss game
  const playToss = (choice: "heads" | "tails", wager: number) => {
    if (wager <= 0 || balance < wager) return;
    setBalance((prev) => prev - wager);
    setGamesPlayed((g) => g + 1);
    setTotalWagered((w) => w + wager);

    const flip = Math.random() < 0.5 ? "heads" : "tails";
    if (flip === choice) {
      const win = wager * 2;
      setBalance((prev) => {
        const next = prev + win;
        pushHistory(`Coin Toss win (${choice})`, win, next);
        return next;
      });
      setTotalWon((t) => t + win);
      setResultMessage(`Coin Toss: ${choice.toUpperCase()} — you win +${win}`);
    } else {
      setResultMessage(`Coin Toss: ${choice.toUpperCase()} — you lost.`);
      setBalance((prev) => {
        pushHistory(`Coin Toss lose (${choice})`, -wager, prev);
        return prev;
      });
    }
  };

  // Wishing Well
  const tossInWell = (amount: number) => {
    if (amount <= 0 || balance < amount) return;
    setBalance((prev) => prev - amount);
    setGamesPlayed((g) => g + 1);
    setTotalWagered((w) => w + amount);

    const roll = Math.random();
    // 3 outcomes: big jackpot (3%), modest (27%), nothing (70%)
    if (roll < 0.03) {
      const win = amount * 10;
      setBalance((prev) => {
        const next = prev + win;
        pushHistory("Wishing Well JACKPOT", win, next);
        return next;
      });
      setTotalWon((t) => t + win);
      setResultMessage(`Wishing Well: JACKPOT +${win}`);
    } else if (roll < 0.3) {
      const win = Math.floor(amount * 1.5);
      setBalance((prev) => {
        const next = prev + win;
        pushHistory("Wishing Well: Small fortune", win, next);
        return next;
      });
      setTotalWon((t) => t + win);
      setResultMessage(`Wishing Well: You received +${win}`);
    } else {
      setResultMessage("Wishing Well: Nothing this time.");
      setBalance((prev) => {
        pushHistory("Wishing Well: Nothing", -amount, prev);
        return prev;
      });
    }
  };

  const resetGame = () => {
    setBalance(DEFAULT_BALANCE);
    setBet(50);
    setHistory([]);
    setLeaderboard([]);
    setTotalWagered(0);
    setTotalWon(0);
    setGamesPlayed(0);
    setResultMessage(null);
  };

  const saveScore = (name: string) => {
    const entry: LeaderboardEntry = {
      id: Math.random().toString(36).slice(2, 9),
      name: name || "Anonymous",
      score: balance,
      time: new Date().toISOString(),
    };
    setLeaderboard((l) => {
      const next = [entry, ...l].sort((a, b) => b.score - a.score).slice(0, 20);
      return next;
    });
  };

  // Small UI pieces for games
  const renderSlots = () => {
    return (
      <div>
        <div className="text-center mb-6">
          <div className="inline-block bg-vintage-brown text-vintage-beige-light px-8 py-4 rounded-full shadow-lg">
            <div className="flex items-center gap-3">
              <Image src="/images/shell.png" alt="Shell" width={28} height={28} />
              <div>
                <div className="text-sm font-steven">Your Balance</div>
                <div className="text-3xl font-bold">{balance.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="organic-card bg-vintage-beige-light mb-6">
          <div className="flex justify-center items-center gap-4 md:gap-8 py-8">
            {slots.map((s, i) => (
              <div key={i} className="w-24 h-24 md:w-28 md:h-28 bg-white border-4 border-vintage-brown rounded-lg flex items-center justify-center text-xl md:text-2xl shadow-lg">
                {s}
              </div>
            ))}
          </div>

          {resultMessage && (
            <div className="text-center py-3 px-4 rounded font-steven font-semibold mb-4 bg-vintage-beige">
              {resultMessage}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-4">
            <button onClick={() => adjustBet(-10)} disabled={spinning || bet <= 10} className="px-4 py-2 bg-vintage-brown-light text-vintage-beige-light rounded-full">-10</button>
            <div className="text-xl font-bold">Bet: {bet}</div>
            <button onClick={() => adjustBet(10)} disabled={spinning || balance < bet + 10} className="px-4 py-2 bg-vintage-brown-light text-vintage-beige-light rounded-full">+10</button>
          </div>

          <div className="text-center">
            <button onClick={spinSlots} disabled={spinning || balance < bet} className="marble-button px-12 py-3">
              {spinning ? "Spinning..." : "Spin"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderToss = () => {
    return (
      <div className="organic-card p-6">
        <div className="mb-4">Pick Heads or Tails and wager shells.</div>
        <div className="flex items-center gap-3 mb-4">
          <input type="number" value={tossWager} onChange={(e) => setTossWager(Math.max(10, Math.min(balance, Number(e.target.value || 10))))} className="p-2 border rounded" />
          <button onClick={() => playToss('heads', tossWager)} disabled={balance < tossWager} className="px-4 py-2 bg-vintage-brown text-vintage-beige-light rounded">Heads</button>
          <button onClick={() => playToss('tails', tossWager)} disabled={balance < tossWager} className="px-4 py-2 bg-vintage-brown text-vintage-beige-light rounded">Tails</button>
        </div>
        {resultMessage && <div className="mt-2 font-steven">{resultMessage}</div>}
      </div>
    );
  };

  const renderWell = () => {
    return (
      <div className="organic-card p-6">
        <div className="mb-3">Toss coins into the Wishing Well — odds favor the house, but the jackpot is real.</div>
        <div className="flex items-center gap-3 mb-4">
          <input type="number" value={wellAmt} onChange={(e) => setWellAmt(Math.max(1, Math.min(balance, Number(e.target.value || 1))))} className="p-2 border rounded" />
          <button onClick={() => tossInWell(wellAmt)} disabled={balance < wellAmt} className="px-4 py-2 bg-vintage-brown text-vintage-beige-light rounded">Toss</button>
        </div>
        {resultMessage && <div className="mt-2 font-steven">{resultMessage}</div>}
      </div>
    );
  };

  const renderShop = () => {
    // simple cosmetic shop (no gameplay effects)
    const items = [
      { id: 'skin-gold', name: 'Gold Shell Skin', price: 200 },
      { id: 'skin-silver', name: 'Silver Shell Skin', price: 120 },
      { id: 'name-change', name: 'Change Display Name', price: 500 },
    ];
    const buy = (price: number, name: string) => {
      if (balance < price) return;
      setBalance((prev) => {
        const next = prev - price;
        pushHistory(`Bought ${name}`, -price, next);
        return next;
      });
      setResultMessage(`Purchased ${name}`);
    };

    return (
      <div className="organic-card p-6">
        <div className="mb-3 font-bold">Shop (cosmetics)</div>
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex justify-between items-center p-3 bg-vintage-beige rounded">
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-vintage-dark">{it.price} shells</div>
              </div>
              <button onClick={() => buy(it.price, it.name)} disabled={balance < it.price} className="px-3 py-1 bg-vintage-brown text-vintage-beige-light rounded">Buy</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => {
    return (
      <div className="organic-card p-6">
        <div className="mb-3 font-bold">Save your score</div>
        <div className="flex gap-3 mb-4">
          <input placeholder="Your name" value={leaderboardName} onChange={(e) => setLeaderboardName(e.target.value)} className="p-2 border rounded flex-1" />
          <button onClick={() => { saveScore(leaderboardName); setLeaderboardName(''); }} className="px-4 py-2 bg-vintage-brown text-vintage-beige-light rounded">Save</button>
        </div>

        <div className="mb-3 font-bold">Top Scores</div>
        <div className="space-y-2">
          {leaderboard.length === 0 && <div className="text-sm text-vintage-dark">No scores yet — be the first!</div>}
          {leaderboard.map((l) => (
            <div key={l.id} className="flex justify-between p-2 bg-vintage-beige rounded">
              <div className="font-semibold">{l.name}</div>
              <div className="text-vintage-brown font-bold">{l.score}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-vintage-beige">
      <header className="border-b-4 border-vintage-brown py-8 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-block mb-4 text-vintage-brown hover:text-vintage-dark transition-colors">← Back to Home</Link>
          <h1 className="masthead text-5xl md:text-7xl mb-3">Coins Casino</h1>
          <p className="font-steven text-xl md:text-2xl text-vintage-brown">Use your coins for games, wishes, and fun. All virtual.</p>
        </div>
      </header>

      <section className="py-6 px-6 md:px-12 bg-yellow-100 border-b-2 border-yellow-400">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-steven text-lg text-yellow-900"><strong>Note:</strong> This is a simulation using virtual coins for fun.</p>
        </div>
      </section>

      <section className="py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-3 mb-6">
            <button onClick={() => setActiveGame('slots')} className={`px-3 py-2 rounded ${activeGame === 'slots' ? 'bg-vintage-brown text-vintage-beige-light' : 'bg-vintage-beige'}`}>Slots</button>
            <button onClick={() => setActiveGame('toss')} className={`px-3 py-2 rounded ${activeGame === 'toss' ? 'bg-vintage-brown text-vintage-beige-light' : 'bg-vintage-beige'}`}>Coin Toss</button>
            <button onClick={() => setActiveGame('well')} className={`px-3 py-2 rounded ${activeGame === 'well' ? 'bg-vintage-brown text-vintage-beige-light' : 'bg-vintage-beige'}`}>Wishing Well</button>
            <button onClick={() => setActiveGame('shop')} className={`px-3 py-2 rounded ${activeGame === 'shop' ? 'bg-vintage-brown text-vintage-beige-light' : 'bg-vintage-beige'}`}>Shop</button>
            <button onClick={() => setActiveGame('leaderboard')} className={`px-3 py-2 rounded ${activeGame === 'leaderboard' ? 'bg-vintage-brown text-vintage-beige-light' : 'bg-vintage-beige'}`}>Leaderboard</button>
            <div className="ml-auto flex items-center gap-3">
              <div className="px-4 py-2 bg-vintage-beige rounded">Balance: <span className="font-bold">{balance.toLocaleString()}</span></div>
              <button onClick={resetGame} className="px-3 py-2 bg-vintage-beige rounded border">Reset</button>
            </div>
          </div>

          {/* Game area */}
          <div>
            {activeGame === 'slots' && renderSlots()}
            {activeGame === 'toss' && renderToss()}
            {activeGame === 'well' && renderWell()}
            {activeGame === 'shop' && renderShop()}
            {activeGame === 'leaderboard' && renderLeaderboard()}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="organic-card text-center">
              <div className="text-3xl font-bold text-vintage-brown mb-1">{gamesPlayed}</div>
              <div className="font-steven text-sm text-vintage-dark">Games Played</div>
            </div>
            <div className="organic-card text-center">
              <div className="text-3xl font-bold text-vintage-brown mb-1">{totalWagered.toLocaleString()}</div>
              <div className="font-steven text-sm text-vintage-dark">Total Wagered</div>
            </div>
            <div className="organic-card text-center">
              <div className="text-3xl font-bold text-vintage-brown mb-1">{totalWon.toLocaleString()}</div>
              <div className="font-steven text-sm text-vintage-dark">Total Won</div>
            </div>
            <div className="organic-card text-center">
              <div className={`text-3xl font-bold mb-1 ${totalWon - totalWagered > 0 ? 'text-green-600' : 'text-red-600'}`}>{totalWon - totalWagered > 0 ? '+' : ''}{(totalWon - totalWagered).toLocaleString()}</div>
              <div className="font-steven text-sm text-vintage-dark">Net Profit/Loss</div>
            </div>
          </div>

          {/* History */}
          <div className="organic-card mt-8">
            <h3 className="font-national-park text-2xl font-bold text-vintage-dark mb-4 text-center">Recent Activity</h3>
            <div className="space-y-2 max-h-64 overflow-auto">
              {history.length === 0 && <div className="text-sm text-vintage-dark text-center">No activity yet.</div>}
              {history.map((h) => (
                <div key={h.id} className="flex justify-between p-2 bg-vintage-beige rounded">
                  <div className="text-sm">{h.action}</div>
                  <div className={`font-semibold ${h.delta > 0 ? 'text-green-600' : 'text-red-600'}`}>{h.delta > 0 ? `+${h.delta}` : h.delta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
