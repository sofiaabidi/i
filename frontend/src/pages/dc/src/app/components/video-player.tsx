import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  showControls?: boolean;
  progress?: number;
  currentTime?: string;
  totalTime?: string;
  className?: string;
  mediaUrl?: string | null;
  contentType?: string;
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
  mediaUrl,
  contentType,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMedia, setHasMedia] = useState(!!mediaUrl);
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTimeState, setCurrentTimeState] = useState('0:00');
  const [totalTimeState, setTotalTimeState] = useState('0:00');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControlsState, setShowControlsState] = useState(false);

  // Format time helper
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setHasMedia(!!mediaUrl);
  }, [mediaUrl]);

  useEffect(() => {
    if (videoRef.current && contentType === 'video') {
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, contentType]);

  useEffect(() => {
    if (videoRef.current && contentType === 'video') {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, contentType]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration && !isNaN(duration)) {
        const progressPercent = (current / duration) * 100;
        setVideoProgress(progressPercent);
        setCurrentTimeState(formatTime(current));
        setTotalTimeState(formatTime(duration));
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      const duration = videoRef.current.duration;
      if (duration && !isNaN(duration)) {
        videoRef.current.currentTime = duration * percentage;
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-gray-900 dark:bg-gray-950 rounded-2xl overflow-hidden shadow-lg aspect-video relative group ${className}`}
      onMouseEnter={() => setShowControlsState(true)}
      onMouseLeave={() => setShowControlsState(false)}
    >
      {/* Media Display Area */}
      {hasMedia && contentType === 'video' && (
        <video
          ref={videoRef}
          src={mediaUrl || undefined}
          className="absolute inset-0 w-full h-full object-contain bg-gray-800"
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={handleVideoTimeUpdate}
          preload="metadata"
          playsInline
        />
      )}

      {hasMedia && contentType === 'image' && (
        <img
          src={mediaUrl || undefined}
          alt={title}
          className="absolute inset-0 w-full h-full object-contain bg-gray-800"
          loading="lazy"
        />
      )}

      {/* Overlay when no media or when video is paused */}
      {(!hasMedia || (contentType === 'video' && !isPlaying)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-center">
            {hasMedia && contentType === 'video' ? (
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
            ) : !hasMedia ? (
              <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-10 h-10 ml-1 text-white/50" />
              </div>
            ) : null}
            <span className="text-white/80 text-sm">
              {hasMedia ? title : 'No resource added yet'}
            </span>
          </div>
        </div>
      )}

      {/* Video Controls - only show for videos on hover */}
      {showControls && contentType === 'video' && hasMedia && (
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-200 ${
          showControlsState ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onTogglePlay}
              className="text-white hover:scale-110 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            {/* Progress Bar */}
            <div 
              className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden cursor-pointer relative group/progress"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${videoProgress}%` }}
              ></div>
            </div>
            
            <span className="text-white text-sm whitespace-nowrap min-w-[100px] text-right">
              {currentTimeState} / {totalTimeState}
            </span>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume">
              <button 
                onClick={toggleMute}
                className="text-white hover:scale-110 transition-transform"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer opacity-0 group-hover/volume:opacity-100 transition-opacity [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) 100%)`
                }}
              />
            </div>
            
            <button 
              onClick={handleFullscreen}
              className="text-white hover:scale-110 transition-transform"
              aria-label="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
