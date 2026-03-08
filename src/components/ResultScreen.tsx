import React, { useEffect } from 'react';
import type { LevelDefinition } from '../App';
import { motion } from 'framer-motion';
import { playButtonSE, startTitleBGM, startSelectBGM, playSuccessSE, playFailureSE } from '../utils/audio';

interface ResultScreenProps {
  result: {
    expectedSum: number;
    expectedPassionCounts: number[];
    userSum: string;
    userPassionCounts: number[];
    isCorrect: boolean;
    activeVarieties: number;
  };
  level: LevelDefinition;
  onRetry: () => void;
  onBack: () => void;
}

const passionImages = [
  import.meta.env.BASE_URL + 'assets/passion_images/20220420s00041000244000p_view.jpg',
  import.meta.env.BASE_URL + 'assets/passion_images/b0175635_0462589.jpg',
  import.meta.env.BASE_URL + 'assets/passion_images/images.jpg',
  import.meta.env.BASE_URL + 'assets/passion_images/p01.jpg',
  import.meta.env.BASE_URL + 'assets/passion_images/profile_image_18_723.jpg',
  import.meta.env.BASE_URL + 'assets/passion_images/unnamed.jpg'
];

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRetry, onBack, level }) => {
  const isSumCorrect = parseInt(result.userSum, 10) === result.expectedSum;

  useEffect(() => {
    if (result.isCorrect) {
      playSuccessSE();
    } else {
      playFailureSE();
    }
  }, [result.isCorrect]);

  const shareResult = () => {
    const shareText = `【パッション暗算】レベル「${level.name}」に挑戦！\n結果は... ${result.isCorrect ? '見事クリア！🎉' : '無念の失敗...😭'}\n#パッション暗算\n${window.location.origin}`;
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col items-center bg-kids-blue relative overflow-y-auto px-4 py-8 md:p-8"
      style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 2px, transparent 2px)', backgroundSize: '24px 24px' }}>

      <div className="w-full max-w-4xl flex flex-col items-center min-h-[max-content] pb-10">
        <motion.div
          id="result-card"
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className={`w-full border-[3px] border-kids-black p-4 md:p-10 rounded-[24px] md:rounded-[32px] shadow-[0px_8px_0px_#000] mb-8 text-center relative z-10
          ${result.isCorrect ? 'bg-kids-yellow' : 'bg-gray-100'}
        `}
        >
          <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 bg-white px-6 md:px-8 py-1 md:py-2 rounded-full border-[3px] border-kids-black shadow-[0px_4px_0px_#000]">
            <h2 className={`text-3xl md:text-7xl font-display text-shadow-kids tracking-wider ${result.isCorrect ? 'text-kids-pink text-stroke-thick' : 'text-[#ff4757] font-black'}`}>
              {result.isCorrect ? 'CLEAR!' : 'FAILED'}
            </h2>
          </div>

          <div className="bg-white border-[3px] border-kids-black rounded-[20px] md:rounded-[24px] p-4 md:p-6 mt-6 md:mt-8 flex flex-col gap-4 md:gap-8 text-kids-black shadow-inner">

            {/* Sum Result */}
            <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-3 md:p-4 border-2 border-dashed border-gray-300">
              <span className="text-lg md:text-2xl font-black text-kids-gray mb-1 md:mb-2">計算の答え</span>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-2xl md:text-4xl font-black">
                <span className={isSumCorrect ? "text-kids-blue text-stroke-black text-shadow-kids" : "text-[#ff4757] font-black"}>
                  あなたの回答: {result.userSum}
                </span>
                {!isSumCorrect && (
                  <span className="text-gray-400 text-xl md:text-2xl md:ml-4 font-sans font-bold">
                    (正解: {result.expectedSum})
                  </span>
                )}
              </div>
            </div>

            <div className="w-full h-1 bg-gray-200 rounded-full"></div>

            {/* Passion Result */}
            <div className="flex flex-col items-center">
              <span className="text-lg md:text-2xl font-black text-kids-gray mb-2 md:mb-4">パッションの回数</span>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full">
                {result.expectedPassionCounts.map((expected, i) => {
                  const user = result.userPassionCounts[i];
                  const isPassCorrect = expected === user;
                  return (
                    <div key={i} className={`flex flex-col items-center p-3 md:p-4 border-[3px] border-kids-black rounded-2xl relative ${isPassCorrect ? 'bg-white' : 'bg-gray-100'}`}>
                      <img
                        src={passionImages[i]}
                        className="w-16 h-16 md:w-24 md:h-24 object-cover border-[3px] border-white rounded-xl shadow-sm mb-1 bg-white"
                        alt={`Passion ${i}`}
                      />
                      <div className="flex flex-col items-center w-full mt-1">
                        <span className="text-xs md:text-sm font-bold text-gray-400">あなたの回答</span>
                        <div className={`text-2xl md:text-3xl font-black ${isPassCorrect ? 'text-kids-pink text-shadow-kids' : 'text-kids-gray line-through opacity-80'}`}>
                          {user}回
                        </div>
                        {!isPassCorrect ? (
                          <div className="mt-1 bg-[#ff4757] text-white font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full border-[2px] border-kids-black shadow-[2px_2px_0px_#000] text-xs md:text-sm w-full text-center truncate">
                            正解: {expected}回
                          </div>
                        ) : (
                          <div className="mt-1 text-kids-pink font-black text-xs md:text-sm tracking-wider">
                            大正解！
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-2xl z-10">
          <button
            onClick={() => {
              playButtonSE();
              startTitleBGM();
              onBack();
            }}
            className="flex-1 bg-white text-kids-black text-lg md:text-2xl font-black py-3 md:py-4 rounded-full border-[3px] border-kids-black shadow-[0px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all active:bg-gray-100"
          >
            メニューへ戻る
          </button>
          <button
            onClick={() => {
              playButtonSE();
              shareResult();
            }}
            className="bg-black text-white flex-1 text-lg md:text-2xl font-bold py-3 md:py-4 rounded-full border-[3px] border-white shadow-[0px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all active:bg-gray-800 flex items-center justify-center gap-2 tracking-wider"
          >
            Xでシェア
          </button>
          <button
            onClick={() => {
              playButtonSE();
              startSelectBGM();
              onRetry();
            }}
            className="kids-button flex-1 text-xl md:text-3xl tracking-wider py-3 md:py-4"
          >
            もう一回！
          </button>
        </div>

      </div>

    </div>
  );
};

export default ResultScreen;
