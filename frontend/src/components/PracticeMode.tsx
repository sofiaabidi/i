import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Video, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import Webcam from 'react-webcam';

export function PracticeMode() {
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
                  <div className="bg-gradient-to-br from-blue-100 dark:from-blue-900 to-blue-50 dark:to-blue-800 rounded-xl aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">👋</div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Instructor</p>
                    </div>
                  </div>
                  <Badge className="absolute top-2 left-2 bg-blue-600 dark:bg-blue-500 text-white">
                    Reference
                  </Badge>
                </div>

                {/* User Webcam */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl aspect-video flex items-center justify-center w-10">
                    <Webcam className="webcam-mirror" />
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                </div>
              </div>

              {/* Current Gesture */}
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Practice Sign:</div>
                <div className="text-2xl text-gray-900 dark:text-white">HELLO</div>
              </div>

              {/* Accuracy Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">Accuracy Score</span>
                  </div>
                  <span className="text-2xl text-gray-900 dark:text-white">88%</span>
                </div>
                <Progress value={88} className="h-3" />
              </div>

              {/* Feedback */}
              <div className="space-y-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">Real-Time Feedback:</div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Hand position is correct</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Straighten your forefinger slightly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Raise your hand slightly higher</p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                Start Practice Session
              </Button>
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

