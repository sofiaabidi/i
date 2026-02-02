import React, { useState, useEffect } from 'react';

import {
  Moon,
  Sun,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  Play,
  Pause,
  Volume2,
  Maximize,
  CheckCircle2,
  AlertCircle,
  Info,
  Camera,
  CameraOff,
} from 'lucide-react';

import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { Progress } from './components/ui/progress';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';

import { VideoPlayer } from './components/video-player';
import { CameraFeed } from './components/camera-feed';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(8);
  const [showCamera, setShowCamera] = useState(true);
  const [videoProgress, setVideoProgress] = useState(35);

  const lessons = [
    { id: 1, title: 'Introduction', duration: '5 min', completed: true },
    { id: 2, title: 'Hand Positions', duration: '8 min', completed: true },
    { id: 3, title: 'Letter C', duration: '6 min', completed: false },
    { id: 4, title: 'Letter D', duration: '6 min', completed: false },
    { id: 5, title: 'Letter E', duration: '7 min', completed: false },
    { id: 6, title: 'Letter F', duration: '6 min', completed: false },
    { id: 7, title: 'Practice Session A-F', duration: '10 min', completed: false },
    { id: 8, title: 'Letter G', duration: '6 min', completed: false },
  ];

  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const aiFeedback = [
    { type: 'success', message: 'Hand position is correct', icon: CheckCircle2 },
    { type: 'warning', message: 'Straighten your forefinger slightly', icon: AlertCircle },
    { type: 'info', message: 'Raise your hand slightly higher', icon: Info },
  ];

  const handleMarkComplete = () => {
    // Mark current lesson as complete
    if (currentLesson < totalLessons) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">👋</span>
              </div>
              <span className="font-semibold text-xl text-gray-900 dark:text-white">SignSpeak</span>
            </div>

            <div className="hidden md:block text-center">
              <h1 className="font-semibold text-gray-900 dark:text-white">Alphabet – Lesson 8: Letter C</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Learn to sign the letter C correctly</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  2 / 8 lessons completed
                </span>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              <Avatar>
                <AvatarFallback className="bg-blue-500 text-white">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VideoPlayer
                  title="Instructor Video"
                  isPlaying={isPlaying}
                  onTogglePlay={() => setIsPlaying(!isPlaying)}
                  progress={videoProgress}
                  currentTime="2:15"
                  totalTime="6:00"
                  className="md:col-span-2"
                />

                <CameraFeed
                  isActive={showCamera}
                  onToggle={() => setShowCamera(!showCamera)}
                />
              </div>

              <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-white">AI Feedback & Suggestions</h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                    <span className="text-sm font-medium text-teal-700 dark:text-teal-400">Accuracy Score</span>
                    <span className="font-bold text-lg text-teal-600 dark:text-teal-400">82%</span>
                  </div>
                </div>

                <div className="mb-4">
                  <Progress value={82} className="h-2" />
                </div>

                <div className="space-y-3">
                  {aiFeedback.map((feedback, index) => {
                    const Icon = feedback.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          feedback.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : feedback.type === 'warning'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20'
                            : 'bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mt-0.5 ${
                            feedback.type === 'success'
                              ? 'text-green-600 dark:text-green-400'
                              : feedback.type === 'warning'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            feedback.type === 'success'
                              ? 'text-green-800 dark:text-green-300'
                              : feedback.type === 'warning'
                              ? 'text-yellow-800 dark:text-yellow-300'
                              : 'text-blue-800 dark:text-blue-300'
                          }`}
                        >
                          {feedback.message}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentLesson(Math.max(1, currentLesson - 1))}
                  disabled={currentLesson === 1}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous Lesson</span>
                  <span className="sm:hidden">Previous</span>
                </Button>

                <Button 
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 sm:px-8 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all" 
                  onClick={handleMarkComplete}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setCurrentLesson(Math.min(totalLessons, currentLesson + 1))}
                  disabled={currentLesson === totalLessons}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Next Lesson</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg sticky top-24 border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Course Content</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Alphabet Course</p>
                </div>

                <div className="p-4 max-h-[600px] overflow-y-auto">
                  <div className="space-y-2">
                    {lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          lesson.id === currentLesson
                            ? 'bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 border-2 border-blue-500 shadow-sm'
                            : lesson.completed
                            ? 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs font-medium ${
                                  lesson.id === currentLesson
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                Lesson {lesson.id}
                              </span>
                              {lesson.id === currentLesson && (
                                <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <h3
                              className={`font-medium mb-1 ${
                                lesson.id === currentLesson
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {lesson.title}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.duration}</span>
                          </div>
                          <div>
                            {lesson.completed ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            ) : lesson.id === currentLesson ? (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Play className="w-3 h-3 text-white ml-0.5" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}