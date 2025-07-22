import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Survey, SurveyResponse, SurveyInstance } from '../types';

export const useSurveyStore = defineStore('surveys', () => {
  const surveys = ref<Survey[]>([
    {
      id: '1',
      title: 'Engineering Exit Survey',
      description: 'Comprehensive survey for engineering team members',
      createdBy: '1',
      createdAt: '2024-01-15T10:00:00Z',
      targetAudience: {
        type: 'team',
        value: 'Engineering'
      },
      questions: [
        {
          id: '1',
          text: 'What were the main challenges you faced in your role?',
          type: 'text',
          required: true,
          expectations: [
            'Technical challenges',
            'Team dynamics',
            'Process improvements'
          ],
          acceptanceCriteria: 'Should provide specific examples and actionable feedback',
          order: 1
        },
        {
          id: '2',
          text: 'Describe your experience with team collaboration',
          type: 'text',
          required: true,
          expectations: [
            'Communication patterns',
            'Knowledge sharing',
            'Conflict resolution'
          ],
          acceptanceCriteria: 'Should cover both positive and negative aspects',
          order: 2
        }
      ],
      status: 'active',
      completedCount: 8,
      totalTargeted: 15
    },
    {
      id: '2',
      title: 'Sales Team Exit Survey',
      description: 'Focused on sales processes and customer relationships',
      createdBy: '1',
      createdAt: '2024-01-10T14:30:00Z',
      targetAudience: {
        type: 'team',
        value: 'Sales'
      },
      questions: [
        {
          id: '3',
          text: 'What insights do you have about our sales process?',
          type: 'text',
          required: true,
          expectations: [
            'Process efficiency',
            'Customer feedback',
            'Tools and resources'
          ],
          acceptanceCriteria: 'Should include specific recommendations',
          order: 1
        }
      ],
      status: 'active',
      completedCount: 3,
      totalTargeted: 8
    }
  ]);

  const userResponses = ref<SurveyResponse[]>([]);
  
  const surveyInstances = ref<SurveyInstance[]>([
    {
      id: '1',
      surveyId: '1',
      respondent: {
        id: '2',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        department: 'Engineering',
        position: 'Senior Software Engineer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      responses: [
        {
          questionId: '1',
          answer: '<p>The main challenges I faced were around deployment processes and code review bottlenecks. Our CI/CD pipeline was inconsistent, leading to frequent deployment failures. Additionally, the code review process often took 2-3 days, which slowed down feature delivery significantly.</p><p>I think implementing automated testing and having clearer review guidelines would help future team members avoid these issues.</p>',
          type: 'text',
          approved: true,
          createdAt: '2024-01-20T14:30:00Z'
        },
        {
          questionId: '2',
          answer: '<p>Team collaboration was generally positive, but there were some communication gaps between frontend and backend teams. We often had misaligned expectations about API contracts, which led to integration delays.</p><p>Regular cross-team sync meetings and better API documentation would improve this significantly.</p>',
          type: 'text',
          approved: true,
          createdAt: '2024-01-20T14:35:00Z'
        }
      ],
      status: 'completed',
      submittedAt: '2024-01-20T14:40:00Z',
      comments: [
        {
          id: '1',
          userId: '1',
          userName: 'John Doe',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          content: 'Thanks for the detailed feedback, Sarah. The deployment pipeline issues you mentioned align with what we\'ve heard from other team members. We\'re already working on implementing automated testing.',
          createdAt: '2024-01-20T15:00:00Z',
          replies: [
            {
              id: '2',
              userId: '2',
              userName: 'Sarah Chen',
              userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
              content: 'That\'s great to hear! I\'d be happy to share some specific tools and practices that worked well in my previous role if that would be helpful.',
              createdAt: '2024-01-20T15:15:00Z'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      surveyId: '1',
      respondent: {
        id: '3',
        name: 'Mike Rodriguez',
        email: 'mike.rodriguez@company.com',
        department: 'Engineering',
        position: 'Frontend Developer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      responses: [
        {
          questionId: '1',
          answer: '<p>My biggest challenge was the lack of clear documentation for our internal tools and processes. It took me weeks to understand how different systems connected, and I often had to interrupt colleagues to get basic information.</p><p>Creating comprehensive onboarding documentation and maintaining it would save a lot of time for new team members.</p>',
          type: 'text',
          approved: true,
          createdAt: '2024-01-18T11:20:00Z'
        },
        {
          questionId: '2',
          answer: '<p>The team was very supportive and welcoming. However, I noticed that knowledge sharing sessions were infrequent, and most learning happened through informal conversations. More structured knowledge sharing would benefit everyone.</p>',
          type: 'text',
          approved: true,
          createdAt: '2024-01-18T11:25:00Z'
        }
      ],
      status: 'completed',
      submittedAt: '2024-01-18T11:30:00Z',
      comments: [
        {
          id: '3',
          userId: '1',
          userName: 'John Doe',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          content: 'Mike, your point about documentation is spot on. We\'ve started a documentation initiative and would love to get your input on what would have been most helpful during your onboarding.',
          createdAt: '2024-01-18T12:00:00Z'
        }
      ]
    },
    {
      id: '3',
      surveyId: '2',
      respondent: {
        id: '4',
        name: 'Lisa Wang',
        email: 'lisa.wang@company.com',
        department: 'Sales',
        position: 'Account Executive',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      responses: [
        {
          questionId: '3',
          answer: '<p>Our sales process works well for inbound leads, but we struggle with outbound prospecting. The CRM system doesn\'t integrate well with our email tools, making follow-ups cumbersome.</p><p>I\'d recommend investing in better sales automation tools and providing more training on consultative selling techniques.</p>',
          type: 'text',
          approved: true,
          createdAt: '2024-01-16T09:45:00Z'
        }
      ],
      status: 'completed',
      submittedAt: '2024-01-16T09:50:00Z',
      comments: []
    }
  ]);

  const activeSurveys = computed(() => 
    surveys.value.filter(survey => survey.status === 'active')
  );

  const draftResponses = computed(() => 
    userResponses.value.filter(response => response.status === 'draft')
  );

  const createSurvey = (surveyData: Partial<Survey>) => {
    const newSurvey: Survey = {
      id: Date.now().toString(),
      title: surveyData.title || '',
      description: surveyData.description || '',
      createdBy: '1', // TODO: Use actual user ID
      createdAt: new Date().toISOString(),
      targetAudience: surveyData.targetAudience || { type: 'company', value: 'all' },
      questions: surveyData.questions || [],
      status: 'draft',
      completedCount: 0,
      totalTargeted: 0
    };
    
    surveys.value.push(newSurvey);
    return newSurvey;
  };

  const updateSurvey = (id: string, updates: Partial<Survey>) => {
    const index = surveys.value.findIndex(s => s.id === id);
    if (index !== -1) {
      surveys.value[index] = { ...surveys.value[index], ...updates };
    }
  };

  const getSurveyById = (id: string) => {
    return surveys.value.find(s => s.id === id);
  };
  
  const getSurveyInstances = (surveyId: string) => {
    return surveyInstances.value.filter(instance => instance.surveyId === surveyId);
  };
  
  const addComment = (instanceId: string, content: string, userId: string, userName: string, userAvatar: string, parentId?: string) => {
    const instance = surveyInstances.value.find(i => i.id === instanceId);
    if (!instance) return;
    
    const newComment = {
      id: Date.now().toString(),
      userId,
      userName,
      userAvatar,
      content,
      createdAt: new Date().toISOString()
    };
    
    if (parentId) {
      const parentComment = instance.comments.find(c => c.id === parentId);
      if (parentComment) {
        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies.push(newComment);
      }
    } else {
      instance.comments.push(newComment);
    }
  };

  const submitSurveyResponse = (surveyId: string, responses: { questionId: string; answer: string; type: string }[], userId: string) => {
    // Find the survey to get user info and update completion count
    const survey = surveys.value.find(s => s.id === surveyId);
    if (!survey) return null;
    
    // Get current user info (in a real app, this would come from the auth store)
    const currentUser = {
      id: userId,
      name: 'Current User', // This would be from auth store
      email: 'user@company.com',
      department: 'Engineering', // This would be from auth store
      position: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    };
    
    // Create survey instance
    const newInstance = {
      id: Date.now().toString(),
      surveyId,
      respondent: currentUser,
      responses: responses.map(response => ({
        questionId: response.questionId,
        answer: response.answer,
        type: response.type as 'text' | 'audio' | 'video' | 'file',
        approved: true,
        createdAt: new Date().toISOString()
      })),
      status: 'completed' as const,
      submittedAt: new Date().toISOString(),
      comments: []
    };
    
    // Add to survey instances
    surveyInstances.value.push(newInstance);
    
    // Update survey completion count
    survey.completedCount += 1;
    
    return newInstance;
  };
  return {
    surveys: computed(() => surveys.value),
    surveyInstances: computed(() => surveyInstances.value),
    activeSurveys,
    draftResponses,
    createSurvey,
    updateSurvey,
    getSurveyById,
    getSurveyInstances,
    addComment,
    submitSurveyResponse
  };
});