import { useState } from 'react'
import StartScreen from './components/StartScreen'
import LevelSelect from './components/LevelSelect'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'
import { setMasterVolume, getMasterVolume, playButtonSE } from './utils/audio'
import { Volume2, VolumeX } from 'lucide-react'
export type GameState = 'start' | 'level-select' | 'playing' | 'result';
export type LevelDefinition = {
  id: string;
  name: string;
  digits: number;
  count: number;
  seconds: number;
  passionChance: number; // 0.0 to 1.0 chance of passion event replacing a number
  passionVarieties: number; // How many different images can appear (max 6)
};

function VolumeControl() {
  const [vol, setVol] = useState(getMasterVolume() * 100);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value);
    setVol(newVol);
    setMasterVolume(newVol / 100);
  };

  const toggleMute = () => {
    playButtonSE();
    if (vol > 0) {
      setVol(0);
      setMasterVolume(0);
    } else {
      setVol(50);
      setMasterVolume(0.5);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-kids-gray hover:text-kids-black transition-colors"
      >
        {vol === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={vol}
        onChange={handleVolumeChange}
        className="w-24 accent-kids-blue cursor-pointer"
      />
    </div>
  );
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [selectedLevel, setSelectedLevel] = useState<LevelDefinition | null>(null)
  const [gameResult, setGameResult] = useState<{
    expectedSum: number;
    expectedPassionCounts: number[];
    userSum: string;
    userPassionCounts: number[];
    isCorrect: boolean;
    activeVarieties: number;
  } | null>(null);

  const handleStart = () => setGameState('level-select');

  const handleLevelSelect = (level: LevelDefinition) => {
    setSelectedLevel(level);
    setGameState('playing');
  };

  const handleGameEnd = (result: any) => {
    setGameResult(result);
    setGameState('result');
  };

  const handleRestart = () => {
    setGameResult(null);
    setSelectedLevel(null);
    setGameState('level-select');
  };

  return (
    <div className="min-h-[100dvh] bg-kids-green w-full relative overflow-hidden flex flex-col items-center justify-center font-sans tracking-wider p-2 md:p-8"
      style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 2px, transparent 2px)', backgroundSize: '24px 24px' }}>

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-kids-yellow border-[3px] border-kids-black shadow-[4px_4px_0px_rgba(0,0,0,0.1)] opacity-80" />
        <div className="absolute bottom-10 right-10 w-56 h-56 rotate-[15deg] bg-kids-pink rounded-[40px] border-[3px] border-kids-black shadow-[4px_4px_0px_rgba(0,0,0,0.1)] opacity-80" />
        <div className="absolute top-1/2 -right-10 w-32 h-32 rounded-full bg-kids-blue border-[3px] border-kids-black opacity-80" />
      </div>

      <div className="relative z-10 w-full max-w-5xl h-full min-h-[500px] md:min-h-[600px] max-h-[95dvh] md:max-h-[90vh] flex flex-col rounded-[24px] md:rounded-[40px] overflow-hidden border-[3px] md:border-[4px] border-kids-black shadow-[0px_8px_0px_#000] md:shadow-[0px_12px_0px_#000] bg-white">

        {/* Header Bar */}
        <div className="bg-white border-b-4 border-kids-black px-6 py-3 flex justify-between items-center z-50 shadow-[0_4px_0_rgba(0,0,0,0.1)]">
          <a
            href="https://x.com/ChoroUduki"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-kids-blue hover:text-kids-pink transition-colors underline decoration-2 underline-offset-4 font-sans"
          >
            Created by @ChoroUduki
          </a>

          <VolumeControl />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full flex flex-col min-h-0 overflow-hidden relative">
          {gameState === 'start' && <StartScreen onStart={handleStart} />}
          {gameState === 'level-select' && <LevelSelect onSelect={handleLevelSelect} onBack={() => setGameState('start')} />}
          {gameState === 'playing' && selectedLevel && <GameScreen level={selectedLevel} onEnd={handleGameEnd} />}
          {gameState === 'result' && gameResult && selectedLevel && <ResultScreen result={gameResult} level={selectedLevel} onRetry={() => setGameState('playing')} onBack={handleRestart} />}
        </div>
      </div>
    </div>
  )
}

export default App
