import React, { useState } from 'react';
import { Home } from './components/Home';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewSession } from './components/InterviewSession';
import { InterviewResults } from './components/InterviewResults';
import { InterviewHistory } from './components/InterviewHistory';

export type InterviewType = 'technical' | 'behavioral' | 'leadership' | 'general';

export interface InterviewConfig {
  type: InterviewType;
  position: string;
  experience: string;
  duration: number;
}

export interface InterviewSession {
  id: string;
  config: InterviewConfig;
  questions: string[];
  answers: string[];
  currentQuestion: number;
  startTime: Date;
  endTime?: Date;
  score?: number;
}

export type AppView = 'home' | 'setup' | 'interview' | 'results' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [completedSessions, setCompletedSessions] = useState<InterviewSession[]>([]);

  const handleStartInterview = (config: InterviewConfig) => {
    const session: InterviewSession = {
      id: Date.now().toString(),
      config,
      questions: [],
      answers: [],
      currentQuestion: 0,
      startTime: new Date(),
    };
    setCurrentSession(session);
    setCurrentView('interview');
  };

  const handleCompleteInterview = (session: InterviewSession) => {
    setCompletedSessions(prev => [...prev, session]);
    setCurrentSession(session);
    setCurrentView('results');
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'setup':
        return <InterviewSetup onStartInterview={handleStartInterview} onBack={() => setCurrentView('home')} />;
      case 'interview':
        return currentSession ? (
          <InterviewSession 
            session={currentSession} 
            onComplete={handleCompleteInterview}
            onExit={() => setCurrentView('home')}
          />
        ) : null;
      case 'results':
        return currentSession ? (
          <InterviewResults 
            session={currentSession} 
            onNewInterview={() => setCurrentView('setup')}
            onHome={() => setCurrentView('home')}
          />
        ) : null;
      case 'history':
        return <InterviewHistory sessions={completedSessions} onBack={() => setCurrentView('home')} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {renderCurrentView()}
    </div>
  );
}

export default App;