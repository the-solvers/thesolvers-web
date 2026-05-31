export type Status = 'live' | 'building' | 'planned';
export type Category = 'Productivity' | 'Health' | 'Finance' | 'Education' | 'Developer Tools' | 'Social' | 'Environment';

export interface Solution {
  id: string;
  number: number;
  name: string;
  slug: string;
  tagline: string;
  problem: string;
  description: string;
  category: Category;
  status: Status;
  url?: string;
  users: number;
  monthlyGrowth: number;
  launchedAt?: string;
  techStack: string[];
  milestones: {
    title: string;
    date?: string;
    done: boolean;
  }[];
  buildTime: string;
  buildCost: string;
}

export const solutions: Solution[] = [
  {
    id: '1',
    number: 1,
    name: 'FocusBlock',
    slug: 'focusblock',
    tagline: 'Distraction ko permanently band karo',
    problem: 'Logon ko apne phone se zyada screen time milta hai padhai/kaam se.',
    description: 'AI-powered focus timer jo websites block karta hai, Pomodoro sessions track karta hai, aur real productivity insights deta hai.',
    category: 'Productivity',
    status: 'live',
    url: 'https://focusblock.app',
    users: 1240,
    monthlyGrowth: 34,
    launchedAt: 'Jan 2025',
    techStack: ['Next.js', 'Chrome Extension', 'Supabase'],
    milestones: [
      { title: 'MVP Launch', date: 'Jan 15, 2025', done: true },
      { title: 'First 100 Users', date: 'Jan 28, 2025', done: true },
      { title: 'First 1000 Users', date: 'Mar 10, 2025', done: true },
      { title: 'Mobile App', done: false },
    ],
    buildTime: '6 days',
    buildCost: '$0',
  },
  {
    id: '2',
    number: 2,
    name: 'MediRemind',
    slug: 'mediremind',
    tagline: 'Dawai bhoolna band',
    problem: '50% patients apni dawai sahi time pe nahi lete, jo serious complications create karta hai.',
    description: 'Smart medicine reminder jo caregivers ko bhi alert karta hai aur adherence track karta hai.',
    category: 'Health',
    status: 'live',
    url: 'https://mediremind.app',
    users: 430,
    monthlyGrowth: 18,
    launchedAt: 'Feb 2025',
    techStack: ['React Native', 'Node.js', 'Twilio'],
    milestones: [
      { title: 'MVP Launch', date: 'Feb 5, 2025', done: true },
      { title: 'First 100 Users', date: 'Feb 20, 2025', done: true },
      { title: 'Caregiver Dashboard', done: false },
    ],
    buildTime: '9 days',
    buildCost: '$12/mo',
  },
  {
    id: '3',
    number: 3,
    name: 'BillSplit',
    slug: 'billsplit',
    tagline: 'Dost ka paisa dost se maango — awkwardness ke bina',
    problem: 'Friends ke beech paise maangna awkward hota hai aur friendships kharab karta hai.',
    description: 'WhatsApp-native bill splitter — ek message bhejo, automatically calculate ho, UPI link generate ho.',
    category: 'Finance',
    status: 'building',
    users: 0,
    monthlyGrowth: 0,
    techStack: ['Next.js', 'WhatsApp API', 'Razorpay'],
    milestones: [
      { title: 'MVP Launch', done: false },
      { title: 'First 500 Users', done: false },
    ],
    buildTime: 'Est. 5 days',
    buildCost: 'Est. $8/mo',
  },
  {
    id: '4',
    number: 4,
    name: 'SkillBridge',
    slug: 'skillbridge',
    tagline: 'Sikh aur kamaao — saath saath',
    problem: 'Students skills seekhte hain but real projects pe apply karne ka mauka nahi milta.',
    description: 'Platform jo students ko real client projects se connect karta hai — learn by doing.',
    category: 'Education',
    status: 'planned',
    users: 0,
    monthlyGrowth: 0,
    techStack: ['Next.js', 'Supabase', 'Stripe'],
    milestones: [
      { title: 'Research & Planning', done: false },
      { title: 'MVP Launch', done: false },
    ],
    buildTime: 'Est. 14 days',
    buildCost: 'Est. $20/mo',
  },
];

export const siteStats = {
  totalSolutions: 100,
  launched: 2,
  building: 1,
  planned: 97,
  totalUsers: 1670,
  weeksIn: 8,
};