import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Video, CheckCircle2, AlertCircle, TrendingUp, Info } from "lucide-react";
import { HandLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

// Hand connections for drawing
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17]
];

const LETTER_F_RANGES = {
  index: [58, 160],
  middle: [155, 180],
  ring: [155, 180],
  pinky: [155, 180],
  thumb: [0.07, 0.125],
};

const FEEDBACK_MAP: Record<string, { low: string; high: string }> = {
  index: {
    low: "Straighten your index finger more",
    high: "Curl your index finger slightly",
  },
  middle: {
    low: "Straighten your middle finger",
    high: "Perfect middle finger position",
  },
  ring: {
    low: "Straighten your ring finger",
    high: "Good ring finger extension",
  },
  pinky: {
    low: "Straighten your pinky finger",
    high: "Excellent pinky extension",
  },
  thumb: {
    low: "Move your thumb outward",
    high: "Bring your thumb closer to palm",
  },
};

function getAngle(a: number[], b: number[], c: number[]): number {
  const ba = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const bc = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
  const dot = ba[0] * bc[0] + ba[1] * bc[1] + ba[2] * bc[2];
  const magBa = Math.sqrt(ba[0] ** 2 + ba[1] ** 2 + ba[2] ** 2);
  const magBc = Math.sqrt(bc[0] ** 2 + bc[1] ** 2 + bc[2] ** 2);
  const cos = dot / (magBa * magBc);
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
}

function getDistance(p1: number[], p2: number[]): number {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);
}

export function PracticeMode() {
  const [isActive, setIsActive] = useState(false);
  const [prediction, setPrediction] = useState<string>("Waiting...");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const initHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.3,
          minHandPresenceConfidence: 0.3,
          minTrackingConfidence: 0.3,
        });
        landmarkerRef.current = handLandmarker;
      } catch (err) {
        console.error('Failed to load hand landmarker:', err);
      }
    };

    initHandLandmarker();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          startDetection();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startDetection = () => {
    if (!landmarkerRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const loop = () => {
      if (!landmarkerRef.current || !video || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

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

        const lm = result.landmarks[0];
        const indexAngle = getAngle([lm[5].x, lm[5].y, lm[5].z], [lm[6].x, lm[6].y, lm[6].z], [lm[8].x, lm[8].y, lm[8].z]);
        const middleAngle = getAngle([lm[9].x, lm[9].y, lm[9].z], [lm[10].x, lm[10].y, lm[10].z], [lm[12].x, lm[12].y, lm[12].z]);
        const ringAngle = getAngle([lm[13].x, lm[13].y, lm[13].z], [lm[14].x, lm[14].y, lm[14].z], [lm[16].x, lm[16].y, lm[16].z]);
        const pinkyAngle = getAngle([lm[17].x, lm[17].y, lm[17].z], [lm[18].x, lm[18].y, lm[18].z], [lm[20].x, lm[20].y, lm[20].z]);
        const thumbDist = getDistance([lm[4].x, lm[4].y, lm[4].z], [lm[5].x, lm[5].y, lm[5].z]);

        const angles: Record<string, number> = {
          index: Math.round(indexAngle),
          middle: Math.round(middleAngle),
          ring: Math.round(ringAngle),
          pinky: Math.round(pinkyAngle),
          thumb: parseFloat(thumbDist.toFixed(3)),
        };

        let matchesF = true;
        const feedbackItems: Array<[string, "low" | "high"]> = [];

        for (const [param, value] of Object.entries(angles)) {
          const range = LETTER_F_RANGES[param as keyof typeof LETTER_F_RANGES];
          if (range) {
            const [low, high] = range;
            if (value < low) {
              matchesF = false;
              feedbackItems.push([param, "low"]);
            } else if (value > high) {
              matchesF = false;
              feedbackItems.push([param, "high"]);
            }
          }
        }

        if (matchesF) {
          setPrediction("F");
          setAccuracy(95);
          setSuggestions(["Hand position is correct!"]);
        } else {
          setPrediction("Adjusting...");
          const newSuggestions = feedbackItems
            .map(([param, kind]) => FEEDBACK_MAP[param]?.[kind])
            .filter(Boolean) as string[];
          setSuggestions(newSuggestions.slice(0, 3));
          setAccuracy(Math.max(50, 100 - feedbackItems.length * 15));
        }
      } else {
        setPrediction("No hand detected");
        setSuggestions(["Show your hand to the camera"]);
        setAccuracy(0);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  const toggleCamera = () => setIsActive(!isActive);
  return (
    <section id="practice" className="py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900">
            Practice Mode
          </Badge>
          <h2 className="text-gray-900 dark:text-white mb-4">
            Practice With Real-Time Feedback
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Perfect your technique with AI-powered feedback that analyzes your gestures and provides personalized tips for improvement.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Practice Interface Mockup */}
          <Card className="p-6 shadow-xl dark:bg-gray-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white">Practice Session</h3>
                <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200">Active</Badge>
              </div>

              {/* Split Screen Preview */}
              <div className="grid grid-cols-2 gap-4">
                {/* Instructor Video */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-100 dark:from-blue-900 to-blue-50 dark:to-blue-800 rounded-xl aspect-video flex items-center justify-center overflow-hidden">
                    <img 
                      src="/image.png" 
                      alt="ASL Letter F"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <Badge className="absolute top-2 left-2 bg-blue-600 dark:bg-blue-500 text-white">
                    Reference
                  </Badge>
                </div>

                {/* User Webcam */}
                <div className="relative">
                  <div className="bg-gray-900 rounded-xl aspect-video overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <p className="text-white/40 text-sm">Camera Off</p>
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                </div>
              </div>

              {/* Current Gesture */}
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Practice Sign:</div>
                <div className="text-2xl text-gray-900 dark:text-white">Letter F</div>
              </div>

              {/* Practice Button */}
              <div className="w-full relative z-50">
                <button
                  onClick={toggleCamera}
                  className={`w-full py-3 px-6 rounded-lg font-semibold shadow-lg transition-all ${
                    isActive 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isActive ? 'End Practice' : 'Start Practice Session'}
                </button>
              </div>

              {/* Accuracy Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">Accuracy Score</span>
                  </div>
                  <span className="text-2xl text-gray-900 dark:text-white">{accuracy}%</span>
                </div>
                <Progress value={accuracy} className="h-3" />
              </div>

              {/* Feedback */}
              <div className="space-y-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">Real-Time Feedback:</div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">Detected: {prediction}</p>
                  </div>
                </div>

                {suggestions.length > 0 ? (
                  suggestions.map((sug, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${
                      sug.includes('correct') || sug.includes('Perfect') || sug.includes('Good') || sug.includes('Excellent')
                        ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                        : sug.includes('Show your hand')
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
                        : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
                    }`}>
                      {sug.includes('correct') || sug.includes('Perfect') || sug.includes('Good') || sug.includes('Excellent') ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          sug.includes('Show your hand') 
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`} />
                      )}
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{sug}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Turn on camera to start</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Features and Stats */}
          <div className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="text-gray-900 dark:text-white mb-4">Practice Features</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white mb-1">Side-by-Side Comparison</div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      See the correct gesture alongside your own for easy comparison and learning.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white mb-1">Instant Feedback</div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Get real-time corrections and suggestions to improve your technique immediately.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white mb-1">Slow Motion Replay</div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Review your gestures in slow motion to identify and fix subtle mistakes.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 dark:from-purple-900/30 to-blue-50 dark:to-blue-900/30 border-purple-200 dark:border-purple-800 dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-blue-900/20">
              <h3 className="text-gray-900 dark:text-white mb-4">Your Practice Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-3xl text-purple-600 dark:text-purple-400 mb-1">127</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Signs Mastered</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-3xl text-purple-600 dark:text-purple-400 mb-1">45h</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Practice Time</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-3xl text-purple-600 dark:text-purple-400 mb-1">92%</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Avg. Accuracy</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-3xl text-purple-600 dark:text-purple-400 mb-1">28</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Day Streak</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-purple-600 dark:from-purple-500 to-blue-600 dark:to-blue-500 text-white border-0">
              <h3 className="text-white mb-2">Ready to Practice?</h3>
              <p className="text-purple-100 dark:text-purple-200 mb-4">
                Start your practice session and get personalized feedback to master sign language faster.
              </p>
              <Button className="bg-white text-purple-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-purple-600 dark:hover:bg-gray-200">
                Begin Practice Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

