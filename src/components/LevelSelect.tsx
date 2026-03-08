import React from 'react';
import { motion } from 'framer-motion';
import type { LevelDefinition } from '../App';
import { ArrowLeft } from 'lucide-react';
import { playButtonSE, startTitleBGM } from '../utils/audio';

interface LevelSelectProps {
  onSelect: (level: LevelDefinition) => void;
  onBack: () => void;
}

const levels: LevelDefinition[] = [
  { id: '10', name: '10級', digits: 1, count: 5, seconds: 11, passionChance: 0.5, passionVarieties: 1 },
  { id: '9', name: '9級', digits: 1, count: 5, seconds: 8, passionChance: 0.5, passionVarieties: 1 },
  { id: '8', name: '8級', digits: 1, count: 10, seconds: 16, passionChance: 0.5, passionVarieties: 2 },
  { id: '7', name: '7級', digits: 1, count: 10, seconds: 13, passionChance: 0.5, passionVarieties: 2 },
  { id: '6', name: '6級', digits: 2, count: 3, seconds: 8, passionChance: 0.55, passionVarieties: 3 },
  { id: '5', name: '5級', digits: 2, count: 4, seconds: 9, passionChance: 0.55, passionVarieties: 3 },
  { id: '4', name: '4級', digits: 2, count: 5, seconds: 10, passionChance: 0.55, passionVarieties: 4 },
  { id: '3', name: '3級', digits: 2, count: 10, seconds: 20, passionChance: 0.6, passionVarieties: 4 },
  { id: '2', name: '2級', digits: 2, count: 10, seconds: 13, passionChance: 0.6, passionVarieties: 5 },
  { id: '1', name: '1級', digits: 2, count: 10, seconds: 11, passionChance: 0.6, passionVarieties: 5 },
  { id: 'd1', name: '初段', digits: 3, count: 5, seconds: 7, passionChance: 0.65, passionVarieties: 6 },
  { id: 'd2', name: '2段', digits: 3, count: 5, seconds: 5, passionChance: 0.65, passionVarieties: 6 },
  { id: 'd3', name: '3段', digits: 3, count: 10, seconds: 11, passionChance: 0.7, passionVarieties: 6 },
  { id: 'master', name: 'マスター', digits: 3, count: 30, seconds: 5, passionChance: 0.8, passionVarieties: 6 },
];

const LevelSelect: React.FC<LevelSelectProps> = ({ onSelect, onBack }) => {
  return (
    <div className="flex-1 min-h-0 w-full flex flex-col bg-kids-blue relative overflow-y-auto overflow-x-hidden custom-scrollbar">

      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

      {/* Header */}
      <div className="bg-white border-b-[3px] border-kids-black p-3 md:p-4 sticky top-0 z-20 flex items-center justify-between shadow-[0px_4px_0px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => {
            playButtonSE();
            startTitleBGM();
            onBack();
          }}
          className="w-10 h-10 md:w-12 md:h-12 bg-kids-yellow border-[3px] border-kids-black rounded-full flex items-center justify-center hover:bg-[#e6be17] hover:scale-105 active:scale-95 transition-all shadow-[0px_3px_0px_#000]"
        >
          <ArrowLeft size={20} className="md:w-6 md:h-6 text-kids-black translate-y-[-1px] -translate-x-0.5" strokeWidth={3} />
        </button>
        <h2 className="text-xl md:text-3xl font-display text-kids-pink text-stroke-black text-shadow-kids tracking-wider">
          LEVEL SELECT
        </h2>
        <div className="w-10 md:w-12" /> {/* Spacer for centering */}
      </div>

      {/* Level List */}
      <div className="p-4 md:p-8 flex flex-col items-center pb-20 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-full max-w-5xl">
          {levels.map((level, i) => (
            <motion.button
              key={level.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                playButtonSE();
                onSelect(level);
              }}
              className="bg-white border-[3px] border-kids-black rounded-[20px] md:rounded-[24px] flex flex-col overflow-hidden text-left shadow-[0px_6px_0px_#000] hover:shadow-[0px_2px_0px_#000] hover:translate-y-1 transition-all group"
            >
              {/* Level Name Banner */}
              <div className={`py-3 px-5 md:py-4 md:px-6 border-b-[3px] border-kids-black transition-colors ${level.digits === 1 ? 'bg-kids-green' : level.digits === 2 ? 'bg-kids-yellow' : 'bg-kids-pink'
                }`}>
                <span className="text-2xl md:text-3xl font-black text-white text-stroke-black text-shadow-kids">{level.name}</span>
              </div>

              {/* Level Stats */}
              <div className="p-4 md:p-5 flex flex-col gap-2 md:gap-3 bg-gray-50/50">
                <div className="flex justify-between items-center bg-white p-2 md:p-3 rounded-lg md:rounded-xl border-2 border-gray-200">
                  <span className="font-bold text-kids-gray text-xs md:text-base">問題</span>
                  <span className="text-lg md:text-xl font-bold text-kids-black">{level.digits}桁 / {level.count}口</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2 md:p-3 rounded-lg md:rounded-xl border-2 border-gray-200">
                  <span className="font-bold text-kids-gray text-xs md:text-base">時間</span>
                  <span className="text-lg md:text-xl font-bold text-kids-black">{level.seconds}秒</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2 md:p-3 rounded-lg md:rounded-xl border-2 border-gray-200">
                  <span className="font-bold text-kids-gray text-xs md:text-base">パッション率</span>
                  <div className="flex flex-1 ml-4 border-[2px] border-kids-black rounded-full overflow-hidden h-4 md:h-5 bg-white">
                    <div className="bg-kids-pink h-full border-r-[2px] border-kids-black" style={{ width: `${level.passionChance * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
