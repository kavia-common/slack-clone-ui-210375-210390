// PUBLIC_INTERFACE
/**
 * Mock data for Slack clone UI
 * Provides realistic sample data for workspaces, channels, users, and messages
 */

export const workspaces = [
  {
    id: 'ws1',
    name: 'KAVIA Engineering',
    icon: '🚀',
    isPremium: true,
  },
  {
    id: 'ws2',
    name: 'Design Squad',
    icon: '🎨',
    isPremium: false,
  },
];

export const users = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    avatar: '👩‍💻',
    status: 'online',
    title: 'Senior Engineer',
    timezone: 'PST',
  },
  {
    id: 'u2',
    name: 'Marcus Johnson',
    avatar: '👨‍💼',
    status: 'away',
    title: 'Product Manager',
    timezone: 'EST',
  },
  {
    id: 'u3',
    name: 'Emily Rodriguez',
    avatar: '👩‍🎨',
    status: 'online',
    title: 'UX Designer',
    timezone: 'CST',
  },
  {
    id: 'u4',
    name: 'David Kim',
    avatar: '👨‍💻',
    status: 'offline',
    title: 'DevOps Engineer',
    timezone: 'PST',
  },
  {
    id: 'u5',
    name: 'Aisha Patel',
    avatar: '👩‍🔬',
    status: 'online',
    title: 'Data Scientist',
    timezone: 'IST',
  },
];

export const channels = [
  {
    id: 'ch1',
    name: 'general',
    description: 'Company-wide announcements and work-based matters',
    isPrivate: false,
    members: 156,
    unread: 0,
  },
  {
    id: 'ch2',
    name: 'random',
    description: 'Non-work banter and water cooler conversation',
    isPrivate: false,
    members: 142,
    unread: 3,
  },
  {
    id: 'ch3',
    name: 'engineering',
    description: 'Engineering team discussions',
    isPrivate: false,
    members: 45,
    unread: 12,
  },
  {
    id: 'ch4',
    name: 'design-reviews',
    description: 'Design feedback and iteration',
    isPrivate: false,
    members: 23,
    unread: 0,
  },
  {
    id: 'ch5',
    name: 'product-planning',
    description: 'Product roadmap and feature planning',
    isPrivate: true,
    members: 12,
    unread: 5,
  },
  {
    id: 'ch6',
    name: 'customer-success',
    description: 'Customer feedback and support coordination',
    isPrivate: false,
    members: 34,
    unread: 0,
  },
  {
    id: 'ch7',
    name: 'devops',
    description: 'Infrastructure and deployment discussions',
    isPrivate: false,
    members: 18,
    unread: 0,
  },
];

export const directMessages = [
  {
    id: 'dm1',
    userId: 'u1',
    unread: 2,
    lastMessage: 'Can you review the PR?',
    timestamp: '10:23 AM',
  },
  {
    id: 'dm2',
    userId: 'u2',
    unread: 0,
    lastMessage: 'Thanks for the update!',
    timestamp: 'Yesterday',
  },
  {
    id: 'dm3',
    userId: 'u3',
    unread: 1,
    lastMessage: 'Check out this design',
    timestamp: '2:45 PM',
  },
];

export const messages = [
  {
    id: 'm1',
    userId: 'u1',
    channelId: 'ch3',
    content: 'Hey team! Just pushed the latest updates to the feature branch. Could someone review when you get a chance? 🚀',
    timestamp: '9:15 AM',
    reactions: [
      { emoji: '👍', count: 5, users: ['u2', 'u3', 'u4', 'u5'] },
      { emoji: '🚀', count: 3, users: ['u2', 'u4'] },
    ],
    replies: 3,
    isThreaded: true,
  },
  {
    id: 'm2',
    userId: 'u2',
    channelId: 'ch3',
    content: 'Perfect timing! I\'ll take a look after standup.',
    timestamp: '9:18 AM',
    reactions: [],
    replies: 0,
    isThreaded: false,
  },
  {
    id: 'm3',
    userId: 'u3',
    channelId: 'ch3',
    content: 'I updated the design specs in Figma. Link: https://figma.com/example',
    timestamp: '9:42 AM',
    reactions: [
      { emoji: '🎨', count: 2, users: ['u1', 'u2'] },
    ],
    replies: 0,
    isThreaded: false,
    hasAttachment: true,
    attachmentType: 'link',
  },
  {
    id: 'm4',
    userId: 'u4',
    channelId: 'ch3',
    content: 'Deployment to staging completed successfully ✅\n```\nBuild: #234\nStatus: Success\nTime: 2m 34s\n```',
    timestamp: '10:05 AM',
    reactions: [
      { emoji: '✅', count: 4, users: ['u1', 'u2', 'u3', 'u5'] },
    ],
    replies: 0,
    isThreaded: false,
    hasCodeBlock: true,
  },
  {
    id: 'm5',
    userId: 'u5',
    channelId: 'ch3',
    content: 'Quick question about the analytics dashboard - should we display real-time data or aggregated hourly stats?',
    timestamp: '10:23 AM',
    reactions: [
      { emoji: '🤔', count: 2, users: ['u1', 'u3'] },
    ],
    replies: 7,
    isThreaded: true,
  },
  {
    id: 'm6',
    userId: 'u1',
    channelId: 'ch3',
    content: 'I think real-time would be more valuable for our use case. We can cache aggressively to reduce load.',
    timestamp: '10:25 AM',
    reactions: [],
    replies: 0,
    isThreaded: false,
  },
  {
    id: 'm7',
    userId: 'u3',
    channelId: 'ch3',
    content: 'Just finished the new onboarding flow mockups! Would love feedback from everyone 🎨',
    timestamp: '11:12 AM',
    reactions: [
      { emoji: '🔥', count: 6, users: ['u1', 'u2', 'u4', 'u5'] },
      { emoji: '👀', count: 3, users: ['u2', 'u4'] },
    ],
    replies: 5,
    isThreaded: true,
  },
  {
    id: 'm8',
    userId: 'u2',
    channelId: 'ch3',
    content: '@Sarah great work on the PR! Approved and merged 🎉',
    timestamp: '11:45 AM',
    reactions: [
      { emoji: '🎉', count: 4, users: ['u1', 'u3', 'u4'] },
    ],
    replies: 0,
    isThreaded: false,
    hasMention: true,
  },
];

export const threads = {
  m1: [
    {
      id: 't1-1',
      userId: 'u2',
      content: 'Looking at it now!',
      timestamp: '9:20 AM',
      reactions: [],
    },
    {
      id: 't1-2',
      userId: 'u4',
      content: 'Left a few comments on the implementation approach',
      timestamp: '9:35 AM',
      reactions: [{ emoji: '👍', count: 1, users: ['u1'] }],
    },
    {
      id: 't1-3',
      userId: 'u1',
      content: 'Thanks! I\'ll address those shortly',
      timestamp: '9:38 AM',
      reactions: [],
    },
  ],
  m5: [
    {
      id: 't5-1',
      userId: 'u1',
      content: 'Real-time would be ideal',
      timestamp: '10:25 AM',
      reactions: [{ emoji: '👍', count: 2, users: ['u3', 'u5'] }],
    },
    {
      id: 't5-2',
      userId: 'u3',
      content: 'Agreed, but we should consider the performance implications',
      timestamp: '10:28 AM',
      reactions: [],
    },
    {
      id: 't5-3',
      userId: 'u4',
      content: 'We can use WebSockets for live updates and fall back to polling',
      timestamp: '10:30 AM',
      reactions: [{ emoji: '💡', count: 3, users: ['u1', 'u3', 'u5'] }],
    },
    {
      id: 't5-4',
      userId: 'u5',
      content: 'Perfect! That\'s exactly what I was thinking',
      timestamp: '10:32 AM',
      reactions: [],
    },
  ],
  m7: [
    {
      id: 't7-1',
      userId: 'u1',
      content: 'Love the clean design! The flow is very intuitive',
      timestamp: '11:15 AM',
      reactions: [{ emoji: '❤️', count: 1, users: ['u3'] }],
    },
    {
      id: 't7-2',
      userId: 'u2',
      content: 'This is great! One suggestion - can we add a progress indicator?',
      timestamp: '11:20 AM',
      reactions: [{ emoji: '👍', count: 2, users: ['u1', 'u3'] }],
    },
    {
      id: 't7-3',
      userId: 'u3',
      content: 'Good idea! I\'ll add that in the next iteration',
      timestamp: '11:22 AM',
      reactions: [],
    },
  ],
};

export const emojiList = [
  '👍', '❤️', '😂', '🎉', '🚀', '👀', '🔥', '✅', 
  '💯', '🙌', '👏', '💪', '🤔', '💡', '🎨', '⚡'
];
