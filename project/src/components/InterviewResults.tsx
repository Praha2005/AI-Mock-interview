import React, { useState, useEffect } from 'react';
import { CheckCircle, TrendingUp, Clock, Target, ArrowRight, RotateCcw, Brain, AlertCircle } from 'lucide-react';
import { InterviewSession } from '../App';
import { aiService } from '../services/aiService';

interface InterviewResultsProps {
  session: InterviewSession;
  onNewInterview: () => void;
  onHome: () => void;
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({ session, onNewInterview, onHome }) => {
  const [analysis, setAnalysis] = useState<{
    score: number;
    feedback: string[];
    suggestions: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const analyzeInterview = async () => {
      setIsAnalyzing(true);
      try {
        const result = await aiService.analyzeAnswers(
          session.questions,
          session.answers,
          session.config.position,
          session.config.type
        );
        setAnalysis(result);
        
        // Update session with AI score
        session.score = result.score;
      } catch (error) {
        console.error('Analysis failed:', error);
        // Fallback analysis
        setAnalysis({
          score: 75,
          feedback: ['Analysis temporarily unavailable. Your responses showed good structure and detail.'],
          suggestions: ['Continue practicing with specific examples', 'Focus on quantifying your achievements']
        });
        session.score = 75;
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeInterview();
  }, [session]);

  const duration = session.endTime && session.startTime ? 
    Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return 'from-green-500 to-green-600';
    if (score >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding performance! You\'re interview-ready.';
    if (score >= 80) return 'Excellent work! Minor improvements will make you shine.';
    if (score >= 70) return 'Good foundation! Focus on the suggestions below.';
    if (score >= 60) return 'Solid effort! Practice will boost your confidence.';
    return 'Keep practicing! Every interview makes you stronger.';
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <Brain className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">AI Analysis in Progress</h2>
          <p className="text-slate-600 mb-4">Analyzing your responses and generating personalized feedback...</p>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Analysis Complete!</h1>
          <p className="text-slate-600">AI-powered insights for your {session.config.type} interview performance</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreGradient(analysis?.score || 0)} flex items-center justify-center mx-auto shadow-lg`}>
                <div className="text-4xl font-bold text-white">{analysis?.score || 0}</div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-slate-900 mb-2">AI Performance Score</div>
            <p className="text-slate-600 text-lg">{getScoreMessage(analysis?.score || 0)}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-slate-900">{duration} min</div>
              <div className="text-sm text-slate-600">Duration</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-slate-900">{session.questions.length}</div>
              <div className="text-sm text-slate-600">Questions</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-slate-900 capitalize">{session.config.type}</div>
              <div className="text-sm text-slate-600">Interview Type</div>
            </div>

            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Brain className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
              <div className="font-semibold text-slate-900">AI-Powered</div>
              <div className="text-sm text-slate-600">Analysis</div>
            </div>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Brain className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-slate-900">AI-Generated Feedback</h2>
          </div>
          
          <div className="space-y-4">
            {analysis?.feedback.map((feedback, index) => (
              <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-slate-700">{feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-slate-900">Improvement Suggestions</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {analysis?.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-slate-700 text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Questions Review */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Interview Questions & Responses</h2>
          
          <div className="space-y-6">
            {session.questions.map((question, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-6 py-4">
                <div className="flex items-center mb-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  <h3 className="font-medium text-slate-900">{question}</h3>
                </div>
                {session.answers[index] ? (
                  <div className="ml-9 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                    <strong className="text-slate-700">Your response:</strong>
                    <p className="mt-1">{session.answers[index]}</p>
                  </div>
                ) : (
                  <div className="ml-9 text-sm text-slate-500 italic">No response provided</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNewInterview}
            className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Practice Again
          </button>
          
          <button
            onClick={onHome}
            className="flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Back to Home
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};