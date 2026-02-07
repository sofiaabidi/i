import React from 'react';
import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CameraFeedProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}

export function CameraFeed({ isActive, onToggle, className = '' }: CameraFeedProps) {
  return (
    <Card className={`bg-gray-800 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg aspect-video relative border-2 ${
      isActive ? 'border-teal-500/50 shadow-teal-500/20' : 'border-gray-600/50'
    } ${className}`}>
      {/* Camera Display */}
      {isActive ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-teal-500/20 rounded-full flex items-center justify-center ring-4 ring-teal-500/30 animate-pulse">
              <User className="w-8 h-8 text-teal-400" />
            </div>
            <span className="text-white/60 text-sm font-medium">Your Camera</span>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <User className="w-12 h-12 mx-auto mb-2 text-white/20" />
            <span className="text-white/40 text-sm">Camera Off</span>
          </div>
        </div>
      )}

      {/* Live Indicator */}
      {isActive && (
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>
      )}

      {/* Toggle Button */}
      <div className="absolute bottom-3 right-3">
        <button
          onClick={onToggle}
          className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg hover:bg-black/80 transition-all hover:scale-105 shadow-lg"
        >
          {isActive ? 'Turn Off' : 'Turn On'}
        </button>
      </div>
    </Card>
  );
}