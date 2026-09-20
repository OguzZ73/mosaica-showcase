import React, { useEffect, useRef, useState } from 'react';

export interface ReadingSessionMetrics {
  totalDwellTimeSeconds: number;
  wordCount: number;
  wordsPerMinute: number;
  scrollSpeedPxPerSec: number;
  activeReadingRatio: number;
  completionPercentage: number;
}

interface ReadingSessionTrackerProps {
  storyId: string;
  wordCount: number;
  onMetricsUpdate?: (metrics: ReadingSessionMetrics) => void;
  children: React.ReactNode;
}

export const ReadingSessionTracker: React.FC<ReadingSessionTrackerProps> = ({
  storyId,
  wordCount,
  onMetricsUpdate,
  children,
}) => {
  const [dwellTime, setDwellTime] = useState<number>(0);
  const [scrollDistance, setScrollDistance] = useState<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const lastScrollTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDwellTime(elapsedSec);

      const wpm = elapsedSec > 0 ? Math.round((wordCount / elapsedSec) * 60) : 0;
      const speed = elapsedSec > 0 ? Number((scrollDistance / elapsedSec).toFixed(1)) : 0;

      onMetricsUpdate?.({
        totalDwellTimeSeconds: elapsedSec,
        wordCount,
        wordsPerMinute: wpm,
        scrollSpeedPxPerSec: speed,
        activeReadingRatio: Math.min(1, elapsedSec / (wordCount / 3)), // Estimate ~200 WPM
        completionPercentage: Math.min(100, Math.round((elapsedSec / (wordCount / 3.3)) * 100)),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [wordCount, scrollDistance, onMetricsUpdate]);

  return (
    <div className="reading-session-wrapper relative">
      {children}
    </div>
  );
};
