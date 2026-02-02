import { Button } from "./ui/button";
import { Play, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Webcam from "react-webcam";

export function Hero() {
  const handleStartLearning = () => {
    const element = document.getElementById('learning-mode');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTryTranslation = () => {
    const element = document.getElementById('live-translation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-20 lg:py-28 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-700 dark:text-blue-200">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI-Powered Real-Time Translation</span>
            </div>
            
            <h1 className="text-gray-900 dark:text-white">
              Learn & Translate Sign Language in Real Time
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              An interactive platform that teaches sign language and instantly converts gestures into text and speech. 
              Break communication barriers with cutting-edge AI technology.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={handleStartLearning}
              >
                Start Learning
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                onClick={handleTryTranslation}
              >
                <Play className="w-4 h-4" />
                Try Real-Time Translation
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-gray-900 dark:text-white text-2xl">50K+</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Active Learners</div>
              </div>
              <div>
                <div className="text-gray-900 dark:text-white text-2xl">95%</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-gray-900 dark:text-white text-2xl">24/7</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Available</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mirror-x">
              <Webcam
                alt="Sign language communication"
                className="w-full h-[500px] object-cover webcam-mirror"
              />
              {/* Floating Status Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-900 dark:text-white text-sm">Camera Active</span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-white text-sm">Gesture Detected</div>
                    <div className="text-blue-600 dark:text-blue-400 text-xs">HELLO</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-teal-200 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
