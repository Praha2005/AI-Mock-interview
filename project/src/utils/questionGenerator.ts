import { InterviewConfig } from '../App';
import { aiService } from '../services/aiService';

export const generateQuestions = async (config: InterviewConfig): Promise<string[]> => {
  try {
    const numQuestions = Math.min(Math.floor(config.duration / 2.5), 12); // Roughly 2.5 minutes per question
    
    const questions = await aiService.generateQuestions(
      config.type,
      config.position,
      config.experience,
      numQuestions
    );

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Fallback to static questions if AI service fails
    return getFallbackQuestions(config);
  }
};

const getFallbackQuestions = (config: InterviewConfig): string[] => {
  const fallbackQuestions = {
    technical: [
      `What technical challenges do you expect in a ${config.position} role?`,
      'Describe your approach to problem-solving in complex technical scenarios.',
      'How do you stay current with technology trends in your field?',
      'Explain a technical project you\'re particularly proud of.',
      'How do you approach code review and quality assurance?'
    ],
    behavioral: [
      'Tell me about a challenging project you completed recently.',
      'Describe a time when you had to work under pressure.',
      'How do you handle conflicts with team members?',
      'Give an example of when you had to adapt to change quickly.',
      'Tell me about a time you failed and what you learned.'
    ],
    leadership: [
      'Describe your leadership style with specific examples.',
      'How do you motivate underperforming team members?',
      'Tell me about a difficult decision you had to make as a leader.',
      'How do you handle disagreements within your team?',
      'Describe how you build and maintain team culture.'
    ],
    general: [
      `Why are you interested in this ${config.position} position?`,
      'What are your greatest strengths and how do they apply to this role?',
      'Where do you see yourself in 5 years?',
      'What motivates you in your professional work?',
      'What questions do you have about our company?'
    ]
  };

  const questions = fallbackQuestions[config.type] || fallbackQuestions.general;
  const numQuestions = Math.min(Math.floor(config.duration / 2.5), questions.length);
  
  return questions.slice(0, numQuestions);
};