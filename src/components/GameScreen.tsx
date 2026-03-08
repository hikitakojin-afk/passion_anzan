import React, { useState, useEffect } from 'react';
import type { LevelDefinition } from '../App';
import { motion } from 'framer-motion';
import { playBeep, playPassionSound, stopPassionSound, startSelectBGM, stopBGM, playButtonSE } from '../utils/audio';

interface GameScreenProps {
  level: LevelDefinition;
  onEnd: (result: any) => void;
}

type FlashItem =
  | { type: 'number'; value: number }
  | { type: 'passion'; imageIndex: number };

const GameScreen: React.FC<GameScreenProps> = ({ level, onEnd }) => {
  const [phase, setPhase] = useState<'countdown' | 'playing' | 'input'>('countdown');
  const [countdown, setCountdown] = useState(3);

  // Game sequence state
  const [sequence, setSequence] = useState<FlashItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [expectedSum, setExpectedSum] = useState(0);
  const [expectedPassionCounts, setExpectedPassionCounts] = useState<number[]>([]);

  const [displayItem, setDisplayItem] = useState<FlashItem | null>(null);

  // Input phase state
  const [sumInput, setSumInput] = useState('');
  const [passionInputs, setPassionInputs] = useState<string[]>([]);

  // Passion Images
  const passionImages = [
    import.meta.env.BASE_URL + 'assets/passion_images/20220420s00041000244000p_view.jpg',
    import.meta.env.BASE_URL + 'assets/passion_images/b0175635_0462589.jpg',
    import.meta.env.BASE_URL + 'assets/passion_images/images.jpg',
    import.meta.env.BASE_URL + 'assets/passion_images/p01.jpg',
    import.meta.env.BASE_URL + 'assets/passion_images/profile_image_18_723.jpg',
    import.meta.env.BASE_URL + 'assets/passion_images/unnamed.jpg'
  ];


  // Generate sequence on mount
  useEffect(() => {
    let sum = 0;
    const items: FlashItem[] = [];

    const min = Math.pow(10, level.digits - 1);
    const max = Math.pow(10, level.digits) - 1;

    // Generate numbers
    for (let i = 0; i < level.count; i++) {
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      items.push({ type: 'number', value });
      sum += value;
    }

    // Safety check max varieties
    const activeVarieties = Math.min(level.passionVarieties, passionImages.length);
    const passionCounts = new Array(activeVarieties).fill(0);

    const expectedC = Math.round(level.count * level.passionChance);
    const actualC = Math.max(0, expectedC + Math.floor(Math.random() * 3) - 1);

    for (let i = 0; i < actualC; i++) {
      const imageIndex = Math.floor(Math.random() * activeVarieties);
      items.push({ type: 'passion', imageIndex });
      passionCounts[imageIndex]++;
    }

    // Shuffle sequence
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    setSequence(items);
    setExpectedSum(sum);
    setExpectedPassionCounts(passionCounts);
    setPassionInputs(new Array(activeVarieties).fill('0'));
    stopBGM();
  }, [level, passionImages.length]);

  // Countdown logic
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown > 0) {
      playBeep(440, 'sine', 0.1, 0.1);
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      playBeep(880, 'sine', 0.2, 0.3);
      setPhase('playing');
    }
  }, [countdown, phase]);

  // Flash sequential logic
  useEffect(() => {
    if (phase !== 'playing') return;

    if (currentIndex >= sequence.length) {
      const timer = setTimeout(() => {
        startSelectBGM();
        setPhase('input');
      }, 1000);
      return () => clearTimeout(timer);
    }

    const totalDurationMs = level.seconds * 1000;
    const intervalMs = totalDurationMs / sequence.length;
    const showDuration = intervalMs * 0.8;
    const blankDuration = intervalMs * 0.2;

    if (currentIndex === -1) {
      setCurrentIndex(0);
      return;
    }

    const item = sequence[currentIndex];
    setDisplayItem(item);

    if (item.type === 'passion') {
      playPassionSound();
    } else if (item.type === 'number') {
      playBeep(800, 'square', 0.1, 0.1); // Short square wave beep for the numbers
    }

    const hideTimer = setTimeout(() => {
      stopPassionSound(); // Stop the audio if it's still playing when we hide the item/move to the next
      setDisplayItem(null);
      const nextTimer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, blankDuration);
      return () => clearTimeout(nextTimer);
    }, showDuration);

    return () => clearTimeout(hideTimer);

  }, [phase, currentIndex, sequence, level]);

  const handlePassionInputChange = (index: number, val: string) => {
    const newInputs = [...passionInputs];
    newInputs[index] = val;
    setPassionInputs(newInputs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sumInput) return;
    playButtonSE();

    const userSum = parseInt(sumInput, 10);
    const parsedPassionInputs = passionInputs.map(v => parseInt(v, 10) || 0);

    // Check if passions match exactly
    const isPassCorrect = parsedPassionInputs.every((val, i) => val === expectedPassionCounts[i]);

    onEnd({
      expectedSum,
      expectedPassionCounts,
      userSum: sumInput,
      userPassionCounts: parsedPassionInputs,
      isCorrect: userSum === expectedSum && isPassCorrect,
      activeVarieties: expectedPassionCounts.length
    });
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center p-4 bg-kids-blue">

      {phase === 'countdown' && (
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-[12rem] md:text-[18rem] font-display text-kids-yellow text-stroke-thick text-shadow-kids flex items-center justify-center"
        >
          {countdown}
        </motion.div>
      )}

      {phase === 'playing' && (
        <div className="w-full flex-1 flex items-center justify-center relative bg-black min-h-[400px] rounded-[32px] overflow-hidden border-[6px] border-kids-black shadow-2xl">
          {displayItem && displayItem.type === 'number' && (
            <span className="text-[12rem] md:text-[22rem] font-sans font-black text-[#39ff14] leading-none drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
              {displayItem.value}
            </span>
          )}
          {displayItem && displayItem.type === 'passion' && (
            <img
              src={passionImages[displayItem.imageIndex]}
              alt="Passion"
              className="absolute inset-0 w-full h-full object-contain p-4"
            />
          )}
        </div>
      )}

      {phase === 'input' && (
        <motion.form
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleSubmit}
          className="bg-white border-[3px] border-kids-black p-4 md:p-8 pt-8 md:pt-10 rounded-[24px] md:rounded-[32px] shadow-[0px_8px_0px_#000] w-full max-w-2xl flex flex-col gap-6 relative z-10 text-kids-black max-h-[90vh] md:max-h-[85vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex justify-center mb-2">
            <h2 className="text-2xl md:text-3xl text-white font-black bg-kids-pink px-6 md:px-8 py-2 border-[3px] border-kids-black rounded-full text-stroke-black text-shadow-kids shadow-[0px_4px_0px_#000] -translate-y-8 md:-translate-y-12 absolute">
              解答入力
            </h2>
          </div>

          <div className="flex flex-col gap-2 mt-4 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-300">
            <label className="text-xl font-bold text-center mb-2 text-kids-blue">全部でいくつになった？</label>
            <input
              type="number"
              autoFocus
              required
              value={sumInput}
              onChange={e => setSumInput(e.target.value)}
              className="text-5xl font-display p-4 border-[3px] border-kids-black rounded-2xl focus:outline-none focus:border-kids-blue focus:ring-4 focus:ring-kids-blue/30 text-center shadow-inner text-kids-black"
            />
          </div>

          <div className="flex flex-col gap-4 bg-kids-pink/10 p-4 md:p-6 rounded-2xl border-[3px] border-kids-pink">
            <label className="text-lg md:text-xl font-bold text-center text-kids-pink mb-1 md:mb-2">
              それぞれ何回出た？
            </label>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {expectedPassionCounts.map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 bg-white p-3 md:p-4 border-[3px] border-kids-black rounded-2xl shadow-[0px_4px_0px_#000]">
                  <img
                    src={passionImages[i]}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover border-[3px] border-gray-200 rounded-xl"
                    alt={`Passion ${i}`}
                  />
                  <input
                    type="number"
                    required
                    min="0"
                    value={passionInputs[i]}
                    onChange={e => handlePassionInputChange(i, e.target.value)}
                    className="w-full text-2xl md:text-3xl font-display p-2 border-[3px] border-kids-black text-kids-black rounded-xl focus:outline-none focus:border-kids-pink text-center bg-gray-50 shadow-inner"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="kids-button text-3xl md:text-4xl py-5 mt-4 tracking-widest"
          >
            答える！
          </button>
        </motion.form>
      )}

    </div>
  );
};

export default GameScreen;
