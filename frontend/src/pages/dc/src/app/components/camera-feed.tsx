import React, { useRef, useEffect, useState } from 'react';
import { User, Camera, CameraOff } from 'lucide-react';
import { Card } from './ui/card';
import { DrawingUtils, FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// Hand connections for drawing
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],        // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],        // Index
  [0, 9], [9, 10], [10, 11], [11, 12],   // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17]              // Palm
];

interface CameraFeedProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
  targetLetter?: string | null;
  enableFeedback?: boolean;
  onFeedback?: (prediction: string, suggestions: string[]) => void;
}

const LETTER_RANGES: Record<string, Record<string, [number, number] | string>> = {
  A: {
    index: [15, 45],
    middle: [10, 40],
    ring: [3, 30],
    pinky: [0, 25],
    thumb: [0.09, 0.18],
    thumb_dx: [0.025, 0.055],
  },
  B: {
    index: [170, 180],
    middle: [170, 180],
    ring: [170, 180],
    pinky: [170, 180],
    thumb: [0.05, 0.07],
  },
  C: {
    index: [85, 120],
    middle: [70, 110],
    ring: [70, 110],
    pinky: [90, 145],
    thumb: [0.07, 0.16],
    ti_dist: [0.1, 0.3],
  },
  D: {
    index: [168, 180],
    middle: [30, 55],
    ring: [20, 100],
    pinky: [5, 50],
    thumb: [0.06, 0.16],
  },
  E: {
    index: [28, 50],
    middle: [15, 32],
    ring: [5, 28],
    pinky: [10, 36],
    thumb: [0.06, 0.095],
    thumb_dx: [-0.11, -0.02],
  },
  F: {
    index: [58, 160],
    middle: [155, 180],
    ring: [155, 180],
    pinky: [155, 180],
    thumb: [0.07, 0.125],
  },
  G: {
    index: [160, 180],
    middle: [0, 60],
    ring: [25, 70],
    pinky: [15, 110],
    thumb: [0.028, 0.15],
    dir: 'horizontal',
  },
  H: {
    index: [170, 180],
    middle: [165, 180],
    ring: [0, 80],
    pinky: [60, 120],
    thumb: [0.03, 0.25],
    dir: 'horizontal',
    im_dist: [0.01, 0.05],
  },
  I: {
    index: [20, 45],
    middle: [20, 50],
    ring: [10, 45],
    pinky: [165, 180],
    thumb: [0.03, 0.08],
  },
  K: {
    index: [165, 180],
    middle: [149, 180],
    ring: [60, 125],
    pinky: [40, 140],
    thumb: [0.03, 0.12],
    ti_dist: [0.11, 0.19],
    tp_dist: [0.19, 0.3],
  },
  L: {
    index: [170, 180],
    middle: [45, 120],
    ring: [40, 110],
    pinky: [25, 80],
    thumb: [0.085, 0.3],
  },
  M: {
    index: [40, 90],
    middle: [30, 60],
    ring: [20, 50],
    thumb: [0.07, 0.18],
    tm_dist: [0.01, 0.3],
    ti_dist: [0.04, 0.25],
    thumb_dx: [-0.12, 0.16],
    tr_dist: [0.03, 0.155],
    tp_dist: [0.05, 0.3],
  },
  N: {
    index: [30, 85],
    middle: [20, 70],
    ring: [35, 125],
    thumb: [0.1, 0.145],
    tm_dist: [0.05, 0.16],
    ti_dist: [0.07, 0.2],
    thumb_dx: [-0.11, 0.08],
    tp_dist: [0.15, 0.25],
    tr_dist: [0.12, 0.25],
  },
  O: {
    index: [75, 120],
    middle: [70, 115],
    ring: [70, 110],
    pinky: [80, 140],
    thumb: [0.09, 0.2],
    ti_dist: [0.015, 0.085],
  },
  P: {
    index: [150, 168],
    middle: [100, 170],
    ring: [65, 100],
    pinky: [52, 110],
    thumb: [0.055, 0.09],
  },
  Q: {
    index: [125, 165],
    middle: [50, 90],
    ring: [40, 80],
    pinky: [55, 90],
    thumb: [0.15, 0.25],
  },
  R: {
    index: [160, 180],
    middle: [160, 175],
    ring: [20, 90],
    pinky: [40, 110],
    thumb: [0.085, 0.135],
    im_dist: [0.035, 0.085],
  },
  S: {
    index: [15, 45],
    middle: [10, 30],
    ring: [0, 20],
    thumb: [0.02, 0.1],
    thumb_dx: [-0.075, -0.01],
    tm_dist: [0.025, 0.07],
    ti_dist: [0.03, 0.09],
    tr_dist: [0.04, 0.12],
    tp_dist: [0.07, 0.15],
  },
  T: {
    index: [35, 55],
    middle: [48, 120],
    ring: [45, 120],
    thumb: [0.085, 0.14],
    tm_dist: [0.19, 0.25],
    ti_dist: [0.11, 0.16],
    thumb_dx: [-0.07, -0.02],
    tp_dist: [0.165, 0.25],
    tr_dist: [0.18, 0.26],
  },
  U: {
    index: [170, 180],
    middle: [170, 180],
    ring: [45, 105],
    pinky: [55, 140],
    thumb: [0.089, 0.15],
    im_dist: [0.019, 0.04],
  },
  V: {
    index: [165, 180],
    middle: [165, 180],
    ring: [35, 130],
    pinky: [25, 145],
    thumb: [0.06, 0.2],
    im_dist: [0.06, 0.145],
  },
  W: {
    index: [170, 180],
    middle: [170, 180],
    ring: [170, 180],
    pinky: [28, 125],
    thumb: [0.085, 0.17],
  },
  X: {
    index: [45, 110],
    middle: [50, 110],
    ring: [40, 115],
    pinky: [45, 115],
    thumb: [0.06, 0.4],
  },
  Y: {
    index: [30, 70],
    middle: [35, 85],
    ring: [35, 80],
    pinky: [160, 180],
    thumb: [0.09, 0.145],
  },
};

const FEEDBACK_MAP: Record<string, { low: string; high: string }> = {
  index: {
    low: 'Straighten your index finger',
    high: 'Curl your index finger slightly',
  },
  middle: {
    low: 'Straighten your middle finger',
    high: 'Curl your middle finger more',
  },
  ring: {
    low: 'Straighten your ring finger',
    high: 'Curl your ring finger more',
  },
  pinky: {
    low: 'Raise your pinky finger',
    high: 'Relax your pinky finger',
  },
  thumb: {
    low: 'Move your thumb outward',
    high: 'Bring your thumb closer to the palm',
  },
  thumb_dx: {
    low: 'Move your thumb left',
    high: 'Move your thumb right',
  },
  ti_dist: {
    low: 'Increase distance between thumb and index finger',
    high: 'Bring thumb closer to index finger',
  },
  tm_dist: {
    low: 'Bring thumb closer to middle finger',
    high: 'Move thumb away from middle finger',
  },
  tr_dist: {
    low: 'Bring thumb closer to ring finger',
    high: 'Move thumb away from ring finger',
  },
  tp_dist: {
    low: 'Bring thumb closer to pinky',
    high: 'Move thumb away from pinky',
  },
  im_dist: {
    low: 'Separate index and middle fingers',
    high: 'Bring index and middle fingers together',
  },
};

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm';

const getAngle = (a: number[], b: number[], c: number[]) => {
  const ba = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const bc = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
  const dot = ba[0] * bc[0] + ba[1] * bc[1] + ba[2] * bc[2];
  const mag = Math.sqrt(ba[0] ** 2 + ba[1] ** 2 + ba[2] ** 2) * Math.sqrt(bc[0] ** 2 + bc[1] ** 2 + bc[2] ** 2);
  const cos = Math.min(Math.max(dot / mag, -1), 1);
  return (Math.acos(cos) * 180) / Math.PI;
};

const getDistance = (p1: number[], p2: number[]) =>
  Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);

const inRange = (val: number, low: number, high: number) => val >= low && val <= high;

export function CameraFeed({
  isActive,
  onToggle,
  className = '',
  targetLetter,
  enableFeedback = false,
  onFeedback,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFeedbackRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !enableFeedback) {
      return;
    }
    void ensureLandmarker();
  }, [isActive, enableFeedback]);

  useEffect(() => {
    if (!isActive || !enableFeedback) {
      return;
    }
    startDetectionLoop();
    return () => stopDetectionLoop();
  }, [isActive, enableFeedback, targetLetter]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Stop any existing stream first
      stopCamera();

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
          setIsLoading(false);
        };
        
        // Fallback if metadata doesn't fire
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            videoRef.current.play().catch(console.error);
            setIsLoading(false);
          }
        }, 100);
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setError(err.message || 'Failed to access camera');
      setIsLoading(false);
      // Don't auto-toggle off, let user see the error
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const ensureLandmarker = async () => {
    if (landmarkerRef.current) {
      return;
    }
    setIsModelLoading(true);
    try {
      const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
      landmarkerRef.current = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.3,
        minHandPresenceConfidence: 0.3,
        minTrackingConfidence: 0.3,
      });
    } catch (err: any) {
      console.error('Failed to load hand landmarker:', err);
      setError('Failed to load hand tracking model.');
    } finally {
      setIsModelLoading(false);
    }
  };

  const stopDetectionLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startDetectionLoop = () => {
    if (rafRef.current) {
      return;
    }
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      if (!videoRef.current || !canvasRef.current || !landmarkerRef.current) {
        return;
      }

      const video = videoRef.current;
      if (video.readyState < 2) {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const timestamp = performance.now();
      const result = landmarkerRef.current.detectForVideo(video, timestamp);

      if (result.landmarks && result.landmarks.length > 0) {
        if (!drawingUtilsRef.current) {
          drawingUtilsRef.current = new DrawingUtils(ctx);
        }
        const drawingUtils = drawingUtilsRef.current;
        drawingUtils.drawConnectors(result.landmarks[0], HAND_CONNECTIONS, { color: '#00ff9d', lineWidth: 2 });
        drawingUtils.drawLandmarks(result.landmarks[0], { color: '#ff1a1a', lineWidth: 1 });

        if (enableFeedback && targetLetter && onFeedback) {
          const now = Date.now();
          if (now - lastFeedbackRef.current > 300) {
            const lm = result.landmarks[0];
            const indexAngle = getAngle([lm[5].x, lm[5].y, lm[5].z], [lm[6].x, lm[6].y, lm[6].z], [lm[8].x, lm[8].y, lm[8].z]);
            const middleAngle = getAngle([lm[9].x, lm[9].y, lm[9].z], [lm[10].x, lm[10].y, lm[10].z], [lm[12].x, lm[12].y, lm[12].z]);
            const ringAngle = getAngle([lm[13].x, lm[13].y, lm[13].z], [lm[14].x, lm[14].y, lm[14].z], [lm[16].x, lm[16].y, lm[16].z]);
            const pinkyAngle = getAngle([lm[17].x, lm[17].y, lm[17].z], [lm[18].x, lm[18].y, lm[18].z], [lm[20].x, lm[20].y, lm[20].z]);

            const thumbTip = [lm[4].x, lm[4].y, lm[4].z];
            const indexTip = [lm[8].x, lm[8].y, lm[8].z];
            const indexMcp = [lm[5].x, lm[5].y, lm[5].z];
            const middleTip = [lm[12].x, lm[12].y, lm[12].z];
            const ringTip = [lm[16].x, lm[16].y, lm[16].z];
            const pinkyTip = [lm[20].x, lm[20].y, lm[20].z];

            const angles = {
              index: Math.round(indexAngle),
              middle: Math.round(middleAngle),
              ring: Math.round(ringAngle),
              pinky: Math.round(pinkyAngle),
              thumb: Number(getDistance(thumbTip, indexMcp).toFixed(3)),
              thumb_dx: Number((lm[4].x - lm[5].x).toFixed(3)),
              im_dist: Number(getDistance(middleTip, indexTip).toFixed(3)),
              ti_dist: Number(getDistance(thumbTip, indexTip).toFixed(3)),
              tm_dist: Number(getDistance(thumbTip, middleTip).toFixed(3)),
              tp_dist: Number(getDistance(thumbTip, pinkyTip).toFixed(3)),
              tr_dist: Number(getDistance(thumbTip, ringTip).toFixed(3)),
            };

            let prediction = 'Unknown';
            const indexDx = lm[8].x - lm[5].x;
            const indexDy = lm[8].y - lm[5].y;

            for (const [letter, ranges] of Object.entries(LETTER_RANGES)) {
              const keys = Object.keys(ranges) as Array<keyof typeof angles>;
              const valid = keys.every(key => {
                const value = angles[key];
                const range = ranges[key];
                if (!Array.isArray(range)) {
                  return true;
                }
                return inRange(value, range[0], range[1]);
              });

              if (valid) {
                if (ranges.dir === 'horizontal' && Math.abs(indexDx) < Math.abs(indexDy)) {
                  continue;
                }
                prediction = letter;
                break;
              }
            }

            const feedbackItems: Array<[string, 'low' | 'high']> = [];
            const expected = LETTER_RANGES[targetLetter] || {};
            Object.entries(expected).forEach(([param, range]) => {
              if (!Array.isArray(range)) {
                return;
              }
              const val = angles[param as keyof typeof angles];
              if (val < range[0]) {
                feedbackItems.push([param, 'low']);
              } else if (val > range[1]) {
                feedbackItems.push([param, 'high']);
              }
            });

            const suggestions = feedbackItems
              .map(([param, kind]) => FEEDBACK_MAP[param]?.[kind])
              .filter(Boolean) as string[];

            onFeedback(prediction, suggestions);
            lastFeedbackRef.current = now;
          }
        }
      } else if (enableFeedback && targetLetter && onFeedback) {
        const now = Date.now();
        if (now - lastFeedbackRef.current > 300) {
          onFeedback('Waiting...', []);
          lastFeedbackRef.current = now;
        }
      }
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  return (
    <Card className={`bg-gray-800 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg aspect-video relative border-2 ${
      isActive ? 'border-teal-500/50 shadow-teal-500/20' : 'border-gray-600/50'
    } ${className}`}>
      {/* Video element - always rendered */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover bg-gray-800 ${
          isActive && !isLoading && !error ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex: 1 }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Camera Display Overlays */}
      {isActive && !error ? (
        <>
          {(isLoading || isModelLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 z-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-teal-500/20 rounded-full flex items-center justify-center ring-4 ring-teal-500/30 animate-pulse">
                  <Camera className="w-8 h-8 text-teal-400" />
                </div>
                <span className="text-white/60 text-sm font-medium">
                  {isLoading ? 'Starting Camera...' : 'Loading Hand Tracking...'}
                </span>
              </div>
            </div>
          )}
          {!isLoading && (
            <div className="absolute top-3 left-3 z-20">
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>
          )}
        </>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 z-10">
          <div className="text-center">
            <CameraOff className="w-12 h-12 mx-auto mb-2 text-red-400" />
            <span className="text-white/60 text-sm font-medium block mb-1">Camera Error</span>
            <span className="text-white/40 text-xs">{error}</span>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <div className="text-center">
            <User className="w-12 h-12 mx-auto mb-2 text-white/20" />
            <span className="text-white/40 text-sm">Camera Off</span>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="absolute bottom-3 right-3 z-10">
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
