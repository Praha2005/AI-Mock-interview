import React from 'react';
import { ArrowLeft, Calendar, Clock, Target, TrendingUp } from 'lucide-react';
import { InterviewSession } from '../App';

interface InterviewHistoryProps {
  sessions: InterviewSession[];
  onBack: () => void;
}

export const InterviewHistory: React.FC<InterviewHistoryProps> = ({ sessions, onBack }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDuration = (session: InterviewSession) => {
    if (!session.endTime) return 'N/A';
    const duration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60);
    return `${duration} min`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const averageScore = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Interview History</h1>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No interviews yet</h2>
            <p className="text-slate-600 mb-6">Start practicing to see your progress here</p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Total Sessions</p>
                    <p className="text-2xl font-bold text-slate-900">{sessions.length}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Average Score</p>
                    <p className="text-2xl font-bold text-slate-900">{averageScore}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Total Time</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {sessions.reduce((total, session) => {
                        if (!session.endTime) return total;
                        return total + Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60);
                      }, 0)} min
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Best Score</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.max(...sessions.map(s => s.score || 0))}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">🏆</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Recent Sessions</h2>
              </div>

              <div className="divide-y divide-slate-200">
                {sessions.slice().reverse().map((session) => (
                  <div key={session.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="font-semibold text-slate-900">
                            {session.config.position}
                          </h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {session.config.type}
                          </span>
                          {session.score && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(session.score)}`}>
                              {session.score}%
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(session.startTime)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {getDuration(session)}
                          </div>
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {session.questions.length} questions
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};