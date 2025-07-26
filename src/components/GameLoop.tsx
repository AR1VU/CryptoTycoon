import { useEffect } from 'react';
import { useGameStore } from '../store';

const GameLoop: React.FC = () => {
  const { processTick } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      processTick();
    }, 1000); // Process every second

    return () => clearInterval(interval);
  }, [processTick]);

  return null; // This component doesn't render anything
};

export default GameLoop;