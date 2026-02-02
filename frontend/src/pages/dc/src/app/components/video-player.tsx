import React from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';
import { Card } from './ui/card';

interface VideoPlayerProps {
  title: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  showControls?: boolean;
  progress?: number;
  currentTime?: string;
  totalTime?: string;
  className?: string;
}

export function VideoPlayer({
  title,
  isPlaying,
  onTogglePlay,
  showControls = true,
  progress = 0,
  currentTime = '0:00',
  totalTime = '0:00',
  className = '',
}: VideoPlayerProps) {
  return (
    <Card className={`bg-gray-900 dark:bg-gray-950 rounded-2xl overflow-hidden shadow-lg aspect-video relative ${className}`}>
      {/* Video Display Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors">
            <button
              onClick={onTogglePlay}
              className="text-white hover:scale-110 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-10 h-10" />
              ) : (
                <Play className="w-10 h-10 ml-1" />
              )}
            </button>
          </div>
          <span className="text-white/80 text-sm">{title}</span>
        </div>
      </div>

      {/* Video Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onTogglePlay}
              className="text-white hover:scale-110 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            {/* Progress Bar */}
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <span className="text-white text-sm whitespace-nowrap">{currentTime} / {totalTime}</span>
            <button className="text-white hover:scale-110 transition-transform" aria-label="Volume">
              <Volume2 className="w-5 h-5" />
            </button>
            <button className="text-white hover:scale-110 transition-transform" aria-label="Fullscreen">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
          
          {/* Speed Controls */}
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-xs">Speed:</span>
            {['0.75x', '1x', '1.25x', '1.5x'].map((speed) => (
              <button
                key={speed}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  speed === '1x'
                    ? 'bg-blue-500 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
