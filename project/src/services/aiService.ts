interface AIResponse {
  questions?: string[];
  feedback?: string;
  score?: number;
  suggestions?: string[];
}

// Mock AI service for demonstration - replace with actual OpenAI integration
export class AIService {
  private static instance: AIService;
  private apiKey: string;

  private constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateQuestions(
    interviewType: string,
    position: string,
    experience: string,
    numQuestions: number
  ): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, you would use OpenAI API here
    const prompt = this.buildQuestionPrompt(interviewType, position, experience, numQuestions);
    
    // Mock response - replace with actual OpenAI call
    return this.getMockQuestions(interviewType, position, experience, numQuestions);
  }

  async analyzeAnswers(
    questions: string[],
    answers: string[],
    position: string,
    interviewType: string
  ): Promise<{ score: number; feedback: string[]; suggestions: string[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real implementation, you would use OpenAI API here
    const prompt = this.buildAnalysisPrompt(questions, answers, position, interviewType);
    
    // Mock analysis - replace with actual OpenAI call
    return this.getMockAnalysis(answers, interviewType);
  }

  private buildQuestionPrompt(
    interviewType: string,
    position: string,
    experience: string,
    numQuestions: number
  ): string {
    return `Generate ${numQuestions} ${interviewType} interview questions for a ${position} position with ${experience} experience level. 
    Questions should be:
    - Relevant to the specific role and industry
    - Appropriate for the experience level
    - Realistic and commonly asked
    - Varied in difficulty and scope
    
    Format as a JSON array of strings.`;
  }

  private buildAnalysisPrompt(
    questions: string[],
    answers: string[],
    position: string,
    interviewType: string
  ): string {
    const qaText = questions.map((q, i) => `Q: ${q}\nA: ${answers[i] || 'No answer provided'}`).join('\n\n');
    
    return `Analyze these ${interviewType} interview answers for a ${position} role:

${qaText}

Provide:
1. Overall score (0-100)
2. Specific feedback for each answer
3. Improvement suggestions
4. Strengths identified

Format as JSON with score, feedback array, and suggestions array.`;
  }

  private getMockQuestions(
    interviewType: string,
    position: string,
    experience: string,
    numQuestions: number
  ): string[] {
    const questionSets = {
      technical: {
        'software engineer': [
          `How would you design a scalable system for ${position.toLowerCase()} at a growing company?`,
          'Explain the difference between microservices and monolithic architecture.',
          'How do you handle database optimization in high-traffic applications?',
          'Describe your approach to code review and maintaining code quality.',
          'What testing strategies do you implement for complex software systems?',
          'How would you debug a performance issue in a distributed system?',
          'Explain your experience with CI/CD pipelines and deployment strategies.',
          'How do you stay updated with new technologies and programming languages?'
        ],
        'data scientist': [
          `What machine learning models would you use for ${position.toLowerCase()} challenges?`,
          'How do you handle missing data in large datasets?',
          'Explain the bias-variance tradeoff in machine learning.',
          'How would you validate the performance of a predictive model?',
          'Describe your approach to feature engineering and selection.',
          'How do you communicate complex data insights to non-technical stakeholders?',
          'What tools and frameworks do you prefer for data analysis?',
          'How would you design an A/B test for a new feature?'
        ],
        'product manager': [
          `How would you prioritize features for a ${position.toLowerCase()} role?`,
          'Describe your process for gathering and analyzing user requirements.',
          'How do you handle conflicting stakeholder priorities?',
          'What metrics would you use to measure product success?',
          'How would you conduct market research for a new product?',
          'Describe your experience with agile development methodologies.',
          'How do you work with engineering teams to deliver products on time?',
          'What tools do you use for product roadmap planning?'
        ]
      },
      behavioral: [
        `Tell me about a challenging project you completed in a ${position.toLowerCase()} role.`,
        'Describe a time when you had to work with a difficult team member.',
        'How do you handle tight deadlines and competing priorities?',
        'Give an example of when you had to learn a new skill quickly.',
        'Tell me about a time you disagreed with your manager\'s decision.',
        'Describe a situation where you had to persuade others to adopt your idea.',
        'How do you handle failure or setbacks in your work?',
        'Tell me about a time you went above and beyond your job responsibilities.'
      ],
      leadership: [
        `How would you build and lead a team for ${position.toLowerCase()}?`,
        'Describe your approach to mentoring junior team members.',
        'How do you handle underperforming team members?',
        'Tell me about a time you had to make a difficult decision as a leader.',
        'How do you foster innovation and creativity in your team?',
        'Describe your communication style with different stakeholders.',
        'How do you manage conflicts within your team?',
        'What strategies do you use to motivate your team during challenging times?'
      ],
      general: [
        `Why are you interested in this ${position.toLowerCase()} position?`,
        'What attracts you to our company and industry?',
        'How do your skills align with this role\'s requirements?',
        'What are your career goals for the next 3-5 years?',
        'How do you handle work-life balance in demanding roles?',
        'What questions do you have about our company culture?',
        'Describe your ideal work environment and team dynamics.',
        'How do you stay motivated and productive in your work?'
      ]
    };

    let questions: string[] = [];
    
    if (interviewType === 'technical' && questionSets.technical) {
      const positionKey = Object.keys(questionSets.technical).find(key => 
        position.toLowerCase().includes(key)
      ) as keyof typeof questionSets.technical;
      
      questions = positionKey ? questionSets.technical[positionKey] : questionSets.technical['software engineer'];
    } else {
      questions = questionSets[interviewType as keyof typeof questionSets] || questionSets.general;
    }

    // Add experience-specific questions
    if (experience === 'senior' || experience === 'lead') {
      questions.push(`How would you mentor junior ${position.toLowerCase()}s in your team?`);
      questions.push('Describe your approach to technical decision-making and architecture choices.');
    }

    // Shuffle and return requested number
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestions);
  }

  private getMockAnalysis(
    answers: string[],
    interviewType: string
  ): { score: number; feedback: string[]; suggestions: string[] } {
    const answerQuality = answers.map(answer => {
      if (!answer || answer.trim().length < 10) return 0;
      if (answer.length < 50) return 40;
      if (answer.length < 100) return 60;
      if (answer.length < 200) return 75;
      return 85;
    });

    const avgQuality = answerQuality.reduce((sum, score) => sum + score, 0) / answerQuality.length;
    const score = Math.min(100, Math.max(0, avgQuality + Math.random() * 20 - 10));

    const feedback = answers.map((answer, index) => {
      if (!answer || answer.trim().length < 10) {
        return `Question ${index + 1}: No substantial answer provided. Consider preparing specific examples.`;
      }
      
      const quality = answerQuality[index];
      if (quality < 50) {
        return `Question ${index + 1}: Answer is too brief. Provide more detail and specific examples.`;
      } else if (quality < 70) {
        return `Question ${index + 1}: Good start, but could benefit from more structure and concrete examples.`;
      } else {
        return `Question ${index + 1}: Well-structured answer with good detail. Consider quantifying your impact.`;
      }
    });

    const suggestions = this.generateSuggestions(score, interviewType);

    return { score: Math.round(score), feedback, suggestions };
  }

  private generateSuggestions(score: number, interviewType: string): string[] {
    const baseSuggestions = [
      'Use the STAR method (Situation, Task, Action, Result) for behavioral questions',
      'Prepare specific examples that demonstrate your skills and achievements',
      'Practice speaking clearly and at an appropriate pace',
      'Research the company and role thoroughly before the interview'
    ];

    const typeSuggestions = {
      technical: [
        'Review fundamental concepts and algorithms in your field',
        'Practice coding problems and system design questions',
        'Be prepared to explain your technical decisions and trade-offs',
        'Stay updated with industry trends and best practices'
      ],
      behavioral: [
        'Prepare stories that showcase different competencies',
        'Focus on your specific contributions and measurable outcomes',
        'Practice articulating challenges and how you overcame them',
        'Show self-awareness and ability to learn from experiences'
      ],
      leadership: [
        'Prepare examples of successful team leadership and mentoring',
        'Demonstrate your ability to make difficult decisions',
        'Show how you build consensus and manage conflicts',
        'Highlight your strategic thinking and vision-setting abilities'
      ],
      general: [
        'Research the company culture and values thoroughly',
        'Prepare thoughtful questions about the role and organization',
        'Practice your elevator pitch and career story',
        'Be authentic and show genuine enthusiasm for the opportunity'
      ]
    };

    let suggestions = [...baseSuggestions];
    
    if (score < 70) {
      suggestions.push('Consider doing more mock interviews to build confidence');
      suggestions.push('Work on providing more detailed and structured responses');
    }

    if (score < 50) {
      suggestions.push('Focus on preparing specific examples for common interview questions');
      suggestions.push('Practice your responses out loud to improve fluency');
    }

    suggestions.push(...(typeSuggestions[interviewType as keyof typeof typeSuggestions] || typeSuggestions.general));

    return suggestions.slice(0, 5);
  }
}

export const aiService = AIService.getInstance();