"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const SLOT_SYMBOLS = ["", "", "", "⭐", "SLOTS", "", "7️⃣"];
const INITIAL_BALANCE = 1000;

export default function CasinoPage() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [bet, setBet] = useState(50);
  const [slots, setSlots] = useState([
    SLOT_SYMBOLS[0],
    SLOT_SYMBOLS[0],
    SLOT_SYMBOLS[0]
  ]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ message: string; amount: number } | null>(null);
  const [totalWagered, setTotalWagered] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  const spin = () => {
    if (spinning || balance < bet) return;

    setSpinning(true);
    setResult(null);
    setBalance(balance - bet);
    setTotalWagered(totalWagered + bet);
    setGamesPlayed(gamesPlayed + 1);

    // Simulate spinning animation
    const spinDuration = 2000;
    const intervalDuration = 100;
    let elapsed = 0;

    const spinInterval = setInterval(() => {
      setSlots([
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ]);

      elapsed += intervalDuration;

      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);
        
        // Determine final result
        const finalSlots = [
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        ];
        
        setSlots(finalSlots);
        
        // Calculate winnings
        const allSame = finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2];
        const twoSame = finalSlots[0] === finalSlots[1] || 
                       finalSlots[1] === finalSlots[2] || 
                       finalSlots[0] === finalSlots[2];
        
        let winAmount = 0;
        let message = "";

        if (allSame) {
          if (finalSlots[0] === "7️⃣") {
            winAmount = bet * 10;
            message = " JACKPOT! Triple 7s! ";
          } else if (finalSlots[0] === "") {
            winAmount = bet * 8;
            message = " Triple Diamonds! ";
          } else if (finalSlots[0] === "") {
            winAmount = bet * 6;
            message = " Triple Trophies! ";
          } else {
            winAmount = bet * 4;
            message = " Triple Match! ";
          }
        } else if (twoSame) {
          winAmount = bet * 2;
          message = "✨ Double Match! ✨";
        } else {
          message = " No match. Try again!";
        }

        if (winAmount > 0) {
          setBalance(balance - bet + winAmount);
          setTotalWon(totalWon + winAmount);
          setResult({ message, amount: winAmount });
        } else {
          setResult({ message, amount: 0 });
        }

        setSpinning(false);
      }
    }, intervalDuration);
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(10, Math.min(balance, bet + amount));
    setBet(newBet);
  };

  const resetGame = () => {
    setBalance(INITIAL_BALANCE);
    setBet(50);
    setTotalWagered(0);
    setTotalWon(0);
    setGamesPlayed(0);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-vintage-beige">
      {/* Header */}
      <header className="border-b-4 border-vintage-brown py-8 px-6 md:px-12 bg-vintage-beige-light">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-block mb-4 text-vintage-brown hover:text-vintage-dark transition-colors">
            ← Back to Home
          </Link>
          <h1 className="masthead text-5xl md:text-7xl mb-3">
            SLOTS Shell Casino
          </h1>
          <p className="font-steven text-xl md:text-2xl text-vintage-brown">
            Test your luck with virtual shells! All for fun, nothing is real.
          </p>
        </div>
      </header>

      {/* Disclaimer */}
      <section className="py-6 px-6 md:px-12 bg-yellow-100 border-b-2 border-yellow-400">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-steven text-lg text-yellow-900">
            ⚠️ <strong>This is a simulation!</strong> No real shells are used. Just for fun! ⚠️
          </p>
        </div>
      </section>

      {/* Casino Game */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="organic-card bg-vintage-tan">
            {/* Balance Display */}
            <div className="text-center mb-8">
              <div className="inline-block bg-vintage-brown text-vintage-beige-light px-8 py-4 rounded-full shadow-lg">
                <div className="flex items-center gap-3">
                  <Image src="/images/shell.png" alt="Shell" width={32} height={32} />
                  <div>
                    <div className="text-sm font-steven">Your Balance</div>
                    <div className="text-3xl font-bold">{balance.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slot Machine */}
            <div className="organic-card bg-vintage-beige-light mb-8">
              <div className="flex justify-center items-center gap-4 md:gap-8 py-12">
                {slots.map((symbol, index) => (
                  <motion.div
                    key={index}
                    animate={spinning ? { 
                      y: [0, -20, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ 
                      duration: 0.3,
                      repeat: spinning ? Infinity : 0
                    }}
                    className="w-24 h-24 md:w-32 md:h-32 bg-white border-4 border-vintage-brown rounded-lg flex items-center justify-center text-6xl md:text-7xl shadow-lg"
                  >
                    {symbol}
                  </motion.div>
                ))}
              </div>

              {/* Result Message */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`text-center py-4 px-6 rounded-lg font-steven text-xl font-bold ${
                      result.amount > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="mb-2">{result.message}</div>
                    {result.amount > 0 && (
                      <div className="text-2xl">
                        Won: {result.amount.toLocaleString()} shells! 
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bet Controls */}
            <div className="mb-8">
              <div className="text-center mb-4">
                <span className="font-steven text-lg text-vintage-dark">Bet Amount:</span>
                <span className="font-national-park text-3xl font-bold text-vintage-brown ml-3">
                  {bet}
                </span>
              </div>
              
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={() => adjustBet(-10)}
                  disabled={spinning || bet <= 10}
                  className="px-6 py-3 bg-vintage-brown-light text-vintage-beige-light rounded-full font-steven font-bold hover:bg-vintage-brown disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -10
                </button>
                <button
                  onClick={() => adjustBet(-50)}
                  disabled={spinning || bet <= 50}
                  className="px-6 py-3 bg-vintage-brown-light text-vintage-beige-light rounded-full font-steven font-bold hover:bg-vintage-brown disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -50
                </button>
                <button
                  onClick={() => adjustBet(50)}
                  disabled={spinning || balance < bet + 50}
                  className="px-6 py-3 bg-vintage-brown-light text-vintage-beige-light rounded-full font-steven font-bold hover:bg-vintage-brown disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +50
                </button>
                <button
                  onClick={() => adjustBet(100)}
                  disabled={spinning || balance < bet + 100}
                  className="px-6 py-3 bg-vintage-brown-light text-vintage-beige-light rounded-full font-steven font-bold hover:bg-vintage-brown disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +100
                </button>
              </div>
            </div>

            {/* Spin Button */}
            <div className="text-center mb-8">
              <button
                onClick={spin}
                disabled={spinning || balance < bet}
                className="marble-button text-2xl px-16 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {spinning ? "SLOTS Spinning..." : " SPIN!"}
              </button>
              
              {balance < bet && (
                <p className="mt-4 font-steven text-red-600">
                  Not enough shells! Lower your bet or reset.
                </p>
              )}
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-vintage-beige text-vintage-dark border-2 border-vintage-brown rounded-full font-steven font-bold hover:bg-vintage-beige-light transition-colors"
              >
                 Reset Game
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="organic-card text-center">
              <div className="text-2xl mb-2"></div>
              <div className="text-3xl font-bold text-vintage-brown mb-1">
                {gamesPlayed}
              </div>
              <div className="font-steven text-sm text-vintage-dark">Games Played</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-2xl mb-2"></div>
              <div className="text-3xl font-bold text-vintage-brown mb-1">
                {totalWagered.toLocaleString()}
              </div>
              <div className="font-steven text-sm text-vintage-dark">Total Wagered</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-2xl mb-2"></div>
              <div className="text-3xl font-bold text-vintage-brown mb-1">
                {totalWon.toLocaleString()}
              </div>
              <div className="font-steven text-sm text-vintage-dark">Total Won</div>
            </div>
            
            <div className="organic-card text-center">
              <div className="text-2xl mb-2">[Stats]</div>
              <div className={`text-3xl font-bold mb-1 ${
                totalWon - totalWagered > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalWon - totalWagered > 0 ? '+' : ''}{(totalWon - totalWagered).toLocaleString()}
              </div>
              <div className="font-steven text-sm text-vintage-dark">Net Profit/Loss</div>
            </div>
          </div>

          {/* Paytable */}
          <div className="organic-card mt-8">
            <h3 className="font-national-park text-2xl font-bold text-vintage-dark mb-4 text-center">
               Paytable
            </h3>
            <div className="space-y-2 font-steven">
              <div className="flex justify-between items-center p-3 bg-vintage-beige rounded-lg">
                <span className="text-2xl">7️⃣ 7️⃣ 7️⃣</span>
                <span className="font-bold text-vintage-brown">10x bet (JACKPOT!)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-vintage-beige rounded-lg">
                <span className="text-2xl">  </span>
                <span className="font-bold text-vintage-brown">8x bet</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-vintage-beige rounded-lg">
                <span className="text-2xl">  </span>
                <span className="font-bold text-vintage-brown">6x bet</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-vintage-beige rounded-lg">
                <span className="text-2xl">Any Triple</span>
                <span className="font-bold text-vintage-brown">4x bet</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-vintage-beige rounded-lg">
                <span className="text-2xl">Any Double</span>
                <span className="font-bold text-vintage-brown">2x bet</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
