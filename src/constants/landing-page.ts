import { FaInstagram, FaFacebook, FaLinkedin, FaTiktok, FaTwitter, FaYoutube, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { Calendar, BarChart3, Bell, Smartphone } from 'lucide-react';

export const socialPlatforms = [
  { name: 'Instagram', icon: FaInstagram, color: 'text-pink-600' },
  { name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { name: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-700' },
  { name: 'TikTok', icon: FaTiktok, color: 'text-black' },
  { name: 'Twitter', icon: FaTwitter, color: 'text-sky-500' },
  { name: 'YouTube', icon: FaYoutube, color: 'text-red-600' }
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "SJ",
    content: "SaaS Templates has transformed how I manage my social media. I save 10+ hours every week!",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Marketing Manager",
    avatar: "MC",
    content: "The AI caption generator is a game-changer. It understands our brand voice perfectly.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Small Business Owner",
    avatar: "ER",
    content: "Best investment for my business. The scheduling feature keeps me consistent across all platforms.",
    rating: 5
  }
];

export const metrics = [
  { label: "Hours Saved", value: "10+", subtext: "per week on average" },
  { label: "Engagement", value: "3x", subtext: "increase in reach" },
  { label: "Success Rate", value: "98%", subtext: "customer satisfaction" }
];

export const painPoints = [
  "Manually posting on every platform",
  "Forgetting to post consistently",
  "Spending hours creating captions",
  "Missing optimal posting times",
  "Juggling multiple apps and tools",
  "No visibility into what's working"
];

export const solutions = [
  "Schedule once, post everywhere",
  "Set it and forget it automation",
  "AI-powered caption generation",
  "Smart scheduling algorithms",
  "All-in-one unified dashboard",
  "Real-time analytics and insights"
];

export const powerfulFeatures = [
  {
    title: "Visual Content Calendar",
    description: "See your entire content strategy at a glance. Drag, drop, and organize posts with ease.",
    icon: Calendar
  },
  {
    title: "Advanced Analytics",
    description: "Track performance metrics, engagement rates, and audience growth across all platforms.",
    icon: BarChart3
  },
  {
    title: "Smart Notifications",
    description: "Get notified about important metrics, engagement spikes, and optimal posting times.",
    icon: Bell
  },
  {
    title: "Mobile App Access",
    description: "Manage your social media on-the-go with our iOS and Android apps (coming soon).",
    icon: Smartphone
  },
  {
    title: "Bulk Upload & Schedule",
    description: "Upload multiple posts at once and schedule them across different platforms simultaneously.",
    icon: FaCalendarAlt
  },
  {
    title: "Team Collaboration",
    description: "Work with your team, assign roles, approve content, and streamline your workflow.",
    icon: FaUsers
  }
];

export const pricingPlan = {
  name: "Pro Plan",
  price: "$19",
  period: "/month",
  description: "Everything you need to manage your social media",
  features: [
    "Up to 10 social accounts",
    "Unlimited scheduled posts",
    "Advanced analytics dashboard",
    "AI caption generator (unlimited)",
    "10GB media storage",
    "All social platforms supported",
    "Email & chat support",
    "Team collaboration (up to 3 members)",
    "Custom branding",
    "Mobile app access"
  ],
  cta: "Start Free Trial",
  highlight: "Best Value"
};

export const competitorComparison = [
  {
    name: "SaaS Templates",
    logo: "🚀",
    price: "$19",
    color: "bg-blue-600",
    features: {
      accounts: "10",
      posts: "Unlimited",
      ai: true,
      analytics: true,
      team: "3 members",
      storage: "10GB",
      support: "Email & Chat"
    }
  },
  {
    name: "Buffer",
    logo: "📊",
    price: "$60",
    color: "bg-slate-400",
    features: {
      accounts: "8",
      posts: "Unlimited",
      ai: false,
      analytics: true,
      team: "2 members",
      storage: "5GB",
      support: "Email only"
    }
  },
  {
    name: "Hootsuite",
    logo: "🦉",
    price: "$99",
    color: "bg-slate-400",
    features: {
      accounts: "10",
      posts: "Unlimited",
      ai: false,
      analytics: true,
      team: "3 members",
      storage: "5GB",
      support: "Email only"
    }
  },
  {
    name: "Later",
    logo: "📅",
    price: "$40",
    color: "bg-slate-400",
    features: {
      accounts: "6",
      posts: "Limited",
      ai: false,
      analytics: "Basic",
      team: "2 members",
      storage: "3GB",
      support: "Email only"
    }
  },
  {
    name: "Sprout Social",
    logo: "🌱",
    price: "$249",
    color: "bg-slate-400",
    features: {
      accounts: "10",
      posts: "Unlimited",
      ai: false,
      analytics: true,
      team: "5 members",
      storage: "10GB",
      support: "24/7 Phone"
    }
  }
];

export const comparisonFeatures = [
  { label: "Social Accounts", key: "accounts" },
  { label: "Scheduled Posts", key: "posts" },
  { label: "AI Caption Generator", key: "ai" },
  { label: "Analytics", key: "analytics" },
  { label: "Team Members", key: "team" },
  { label: "Storage", key: "storage" },
  { label: "Support", key: "support" }
];

export const faqs = [
  {
    question: "How does the 7-day free trial work?",
    answer: "Start your free trial by signing up and adding a payment method. You'll get full access to all Pro plan features for 7 days. You won't be charged during the trial period. Cancel anytime before the trial ends with no charges."
  },
  {
    question: "Why do I need to add a payment method for the free trial?",
    answer: "We require a valid payment method to prevent abuse and ensure service quality. You won't be charged during the 7-day trial period. If you cancel before the trial ends, you won't be charged at all."
  },
  {
    question: "What happens after the trial ends?",
    answer: "After your 7-day trial, you'll automatically be charged $19/month to continue using SaaS Templates. You can cancel anytime before the trial ends with no charges."
  },
  {
    question: "Which social media platforms do you support?",
    answer: "We currently support Instagram, Facebook, LinkedIn, TikTok, Twitter (X), and YouTube. We're constantly adding new platforms based on user feedback."
  },
  {
    question: "Is my data secure?",
    answer: "Yes! We use bank-level encryption and never store your social media passwords. We connect via official OAuth protocols for maximum security."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. You'll retain access until the end of your billing period."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied with SaaS Templates, contact us within 30 days for a full refund."
  }
];