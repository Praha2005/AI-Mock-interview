import React, { useState, useEffect } from 'react';
import { Clock, Mic, MicOff, X, ArrowRight, SkipForward, Brain } from 'lucide-react';
import { InterviewSession as InterviewSessionType } from '../App';
import { generateQuestions } from '../utils/questionGenerator';

interface InterviewSessionProps {
  session: InterviewSessionType;
  onComplete: (session: InterviewSessionType) => void;
  onExit: () => void;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({ session, onComplete, onExit }) => {
  const [currentSession, setCurrentSession] = useState<InterviewSessionType>(session);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing AI interview system...');

  // Initialize questions when component mounts
  useEffect(() => {
    const initializeQuestions = async () => {
      setIsLoading(true);
      
      // Show different loading messages
      const messages = [
        'Analyzing your position requirements...',
        'Generating personalized interview questions...',
        'Tailoring questions to your experience level...',
        'Preparing your interview session...'
      ];

      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        setLoadingMessage(messages[messageIndex]);
        messageIndex = (messageIndex + 1) % messages.length;
      }, 1000);

      try {
        const questions = await generateQuestions(session.config);
        setCurrentSession(prev => ({ ...prev, questions }));
      } catch (error) {
        console.error('Failed to generate questions:', error);
        // Use fallback questions
        setCurrentSession(prev => ({ 
          ...prev, 
          questions: [`Tell me about your experience as a ${session.config.position}.`] 
        }));
      } finally {
        clearInterval(messageInterval);
        setIsLoading(false);
      }
    };

    initializeQuestions();
  }, [session.config]);

  // Timer
  useEffect(() => {
    if (!isLoading) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    const updatedAnswers = [...currentSession.answers];
    updatedAnswers[currentSession.currentQuestion] = currentAnswer;

    if (currentSession.currentQuestion < currentSession.questions.length - 1) {
      setCurrentSession(prev => ({
        ...prev,
        answers: updatedAnswers,
        currentQuestion: prev.currentQuestion + 1
      }));
      setCurrentAnswer('');
    } else {
      // Interview completed
      const finalSession: InterviewSessionType = {
        ...currentSession,
        answers: updatedAnswers,
        endTime: new Date()
      };
      onComplete(finalSession);
    }
  };

  const handleSkipQuestion = () => {
    const updatedAnswers = [...currentSession.answers];
    updatedAnswers[currentSession.currentQuestion] = ''; // Empty answer for skipped question
    
    if (currentSession.currentQuestion < currentSession.questions.length - 1) {
      setCurrentSession(prev => ({
        ...prev,
        answers: updatedAnswers,
        currentQuestion: prev.currentQuestion + 1
      }));
      setCurrentAnswer('');
    } else {
      const finalSession: InterviewSessionType = {
        ...currentSession,
        answers: updatedAnswers,
        endTime: new Date()
      };
      onComplete(finalSession);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop audio recording
    if (!isRecording) {
      // Simulate recording feedback
      setTimeout(() => {
        setCurrentAnswer(prev => prev + (prev ? ' ' : '') + '[Voice input simulated - in production, this would transcribe your speech]');
      }, 2000);
    }
  };

  const progress = currentSession.questions.length > 0 
    ? ((currentSession.currentQuestion + 1) / currentSession.questions.length) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <Brain className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">AI Interview Preparation</h2>
          <p className="text-slate-600 mb-4">{loadingMessage}</p>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onExit}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {currentSession.config.type.charAt(0).toUpperCase() + currentSession.config.type.slice(1)} Interview
                </h1>
                <p className="text-sm text-slate-600">{currentSession.config.position}</p>
              </div>
              <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <Brain className="h-3 w-3 mr-1" />
                AI-Powered
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-slate-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-medium">{currentSession.currentQuestion + 1}</span> of {currentSession.questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">{currentSession.currentQuestion + 1}</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 leading-tight">
                {currentSession.questions[currentSession.currentQuestion]}
              </h2>
            </div>
            <div className="ml-11 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
              💡 <strong>Tip:</strong> Take your time to structure your response. Consider using specific examples and quantifiable results where possible.
            </div>
          </div>

          {/* Answer Input */}
          <div className="mb-8">
            <label htmlFor="answer" className="block text-sm font-medium text-slate-700 mb-3">
              Your Response
            </label>
            <textarea
              id="answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here, or use the microphone to practice speaking aloud..."
              rows={8}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-slate-900 placeholder-slate-400"
            />
            <div className="mt-2 text-xs text-slate-500">
              {currentAnswer.length} characters • Aim for detailed, specific responses
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 rounded-lg">
            <button
              onClick={toggleRecording}
              className={`flex items-center px-4 py-2 rounded-lg transition-all font-medium ${
                isRecording 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Practice Speaking
                </>
              )}
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSkipQuestion}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <SkipForward className="h-4 w-4 mr-1" />
                Skip
              </button>
              
              <button
                onClick={handleNextQuestion}
                className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                {currentSession.currentQuestion < currentSession.questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Interview Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🎯 Interview Strategy</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>Structure:</strong> Use STAR method (Situation, Task, Action, Result)</p>
              <p>• <strong>Specificity:</strong> Include concrete examples and measurable outcomes</p>
              <p>• <strong>Relevance:</strong> Connect your experience to the {currentSession.config.position} role</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};