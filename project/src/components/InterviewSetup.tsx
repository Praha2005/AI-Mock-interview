import React, { useState } from 'react';
import { ArrowLeft, Clock, User, Briefcase, Target } from 'lucide-react';
import { InterviewType, InterviewConfig } from '../App';

interface InterviewSetupProps {
  onStartInterview: (config: InterviewConfig) => void;
  onBack: () => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartInterview, onBack }) => {
  const [type, setType] = useState<InterviewType>('general');
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [duration, setDuration] = useState(15);

  const interviewTypes = [
    {
      id: 'technical' as InterviewType,
      title: 'Technical Interview',
      description: 'Coding problems, system design, and technical concepts',
      icon: '💻',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'behavioral' as InterviewType,
      title: 'Behavioral Interview',
      description: 'Situational questions about past experiences and teamwork',
      icon: '🤝',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      id: 'leadership' as InterviewType,
      title: 'Leadership Interview',
      description: 'Management scenarios, team leadership, and strategic thinking',
      icon: '👑',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      id: 'general' as InterviewType,
      title: 'General Interview',
      description: 'Mixed questions covering various interview topics',
      icon: '🎯',
      color: 'bg-orange-50 border-orange-200 text-orange-700'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!position.trim()) return;

    const config: InterviewConfig = {
      type,
      position: position.trim(),
      experience: experience.trim(),
      duration
    };

    onStartInterview(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Setup Your Interview</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Interview Type Selection */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-slate-900">Choose Interview Type</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {interviewTypes.map((interviewType) => (
                <label
                  key={interviewType.id}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-md ${
                    type === interviewType.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={interviewType.id}
                    checked={type === interviewType.id}
                    onChange={(e) => setType(e.target.value as InterviewType)}
                    className="sr-only"
                  />
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">{interviewType.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{interviewType.title}</h3>
                      <p className="text-sm text-slate-600">{interviewType.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Position & Experience */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center mb-6">
              <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-slate-900">Position Details</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Position *
                </label>
                <input
                  type="text"
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Experience Level
                </label>
                <select
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6+ years)</option>
                  <option value="lead">Lead/Principal (8+ years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-slate-900">Interview Duration</h2>
            </div>
            
            <div className="flex items-center space-x-6">
              {[10, 15, 20, 30].map((min) => (
                <label key={min} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="duration"
                    value={min}
                    checked={duration === min}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
                    duration === min ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                  }`}>
                    {duration === min && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                  </div>
                  <span className="text-slate-700">{min} minutes</span>
                </label>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!position.trim()}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};