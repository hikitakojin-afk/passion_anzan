import React from 'react';
import { motion } from 'framer-motion';
import { playButtonSE, startTitleBGM } from '../utils/audio';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center bg-kids-green relative p-6">

      {/* Background Pattern Concept */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.6, duration: 0.8 }}
        className="bg-white border-[3px] border-kids-black p-6 md:p-12 rounded-[32px] md:rounded-[40px] shadow-[0px_6px_0px_#000] flex flex-col items-center z-10 w-full max-w-[90vw] md:max-w-fit relative"
      >
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-[2.2rem] leading-[1.2] min-[375px]:text-5xl md:text-7xl font-black text-kids-blue text-stroke-thick text-shadow-kids tracking-wider text-center">
            <span className="text-kids-pink">パッション</span><br />
            暗算
          </h1>
        </div>

        <p className="text-base sm:text-lg md:text-xl font-bold text-kids-gray font-black text-center mb-8 md:mb-10 max-w-md bg-gray-50 p-3 md:p-4 rounded-2xl border-2 border-dashed border-gray-300 w-full">
          フラッシュ暗算と<br />
          パッション屋良がコラボ！<br />
        </p>

        <button
          onClick={() => {
            playButtonSE();
            startTitleBGM();
            onStart();
          }}
          className="kids-button text-2xl md:text-4xl py-3 px-12 md:py-4 md:px-16 tracking-widest w-full md:w-auto"
        >
          START
        </button>

      </motion.div>
    </div>
  );
};

export default StartScreen;
