"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Activity,
  Target,
  Plus,
  X
} from 'lucide-react'
import { 
  FaInstagram, 
  FaFacebook, 
  FaLinkedin, 
  FaTiktok 
} from 'react-icons/fa6'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { supabaseBrowser as supabase } from '@/utils/supabase-browser'

const overviewMetrics = [
  {
    title: 'Total Posts',
    value: '127',
    change: '+12.5%',
    trend: 'up',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Total Engagement',
    value: '24.8K',
    change: '+18.3%',
    trend: 'up',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    title: 'Total Reach',
    value: '156K',
    change: '+23.1%',
    trend: 'up',
    icon: Eye,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    title: 'Avg. Engagement Rate',
    value: '4.2%',
    change: '+0.8%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
]

const platformPerformance = [
  {
    platform: 'Instagram',
    icon: FaInstagram,
    posts: 42,
    engagement: '12.3K',
    rate: '5.2%',
    trend: 'up',
    color: 'from-pink-500 to-purple-600',
    iconColor: 'text-pink-600'
  },
  {
    platform: 'TikTok',
    icon: FaTiktok,
    posts: 28,
    engagement: '8.9K',
    rate: '6.8%',
    trend: 'up',
    color: 'from-gray-800 to-gray-900',
    iconColor: 'text-gray-900'
  },
  {
    platform: 'LinkedIn',
    icon: FaLinkedin,
    posts: 35,
    engagement: '2.1K',
    rate: '3.1%',
    trend: 'up',
    color: 'from-blue-600 to-blue-700',
    iconColor: 'text-blue-700'
  },
  {
    platform: 'Facebook',
    icon: FaFacebook,
    posts: 22,
    engagement: '1.5K',
    rate: '2.8%',
    trend: 'down',
    color: 'from-blue-500 to-blue-600',
    iconColor: 'text-blue-600'
  }
]

const recentPosts = [
  {
    id: 1,
    platform: 'Instagram',
    content: 'Just launched our new product line! 🚀 Check it out...',
    time: '2 hours ago',
    likes: 1243,
    comments: 89,
    shares: 34,
    status: 'posted'
  },
  {
    id: 2,
    platform: 'TikTok',
    content: 'Behind the scenes of our creative process 🎬',
    time: '5 hours ago',
    likes: 3421,
    comments: 234,
    shares: 156,
    status: 'posted'
  },
  {
    id: 3,
    platform: 'LinkedIn',
    content: 'Industry insights: The future of social media marketing...',
    time: '1 day ago',
    likes: 456,
    comments: 67,
    shares: 89,
    status: 'posted'
  }
]

const upcomingPosts = [
  {
    id: 1,
    platform: 'Instagram',
    content: 'Weekly tips for better content creation 💡',
    scheduledTime: 'Today, 3:00 PM',
    status: 'scheduled'
  },
  {
    id: 2,
    platform: 'Facebook',
    content: 'Join our live webinar this Friday!',
    scheduledTime: 'Tomorrow, 10:00 AM',
    status: 'scheduled'
  },
  {
    id: 3,
    platform: 'LinkedIn',
    content: 'Case study: How we increased engagement by 300%',
    scheduledTime: 'Dec 28, 2:00 PM',
    status: 'scheduled'
  }
]

const quickStats = [
  { label: 'Scheduled', value: 24, icon: Clock, color: 'text-blue-600' },
  { label: 'Posted Today', value: 8, icon: CheckCircle, color: 'text-green-600' },
  { label: 'Failed', value: 2, icon: AlertCircle, color: 'text-red-600' },
  { label: 'Draft', value: 12, icon: Calendar, color: 'text-gray-600' }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState<'canceled' | 'started' | null>(null)
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const checkOnboarding = useCallback(async () => {
    
    if (hasCheckedOnboarding || pathname?.includes('/onboarding')) {
      console.log('Dashboard: Skipping onboarding check', {
        hasCheckedOnboarding,
        isOnboardingPage: pathname?.includes('/onboarding')
      })
      setIsCheckingOnboarding(false)
      return
    }
    
    try {
      console.log('Dashboard: Starting onboarding check')
      setIsCheckingOnboarding(true)
      
      // Add minimum delay for smooth UX (500ms)
      const [userData] = await Promise.all([
        supabase.auth.getUser(),
        new Promise(resolve => setTimeout(resolve, 500))
      ])
      
      const { data: { user } } = userData
      
      if (!user) {
        console.log('Dashboard: No user found, skipping onboarding check')
        setIsCheckingOnboarding(false)
        return
      }
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('has_completed_onboarding')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (error) {
        console.error('Error fetching onboarding preferences:', error)
        setIsCheckingOnboarding(false)
        return
      }
      
      console.log('Dashboard: Onboarding check result', {
        userId: user.id,
        hasCompletedOnboarding: data?.has_completed_onboarding
      })
      
      setHasCheckedOnboarding(true)
      
      // If no preferences record exists or onboarding not completed
      if (!data || data.has_completed_onboarding !== true) {
        setIsRedirecting(true)
        
        // Add smooth transition delay
        await new Promise(resolve => setTimeout(resolve, 300))
        
        router.push('/dashboard/onboarding')
      } else {
        setIsCheckingOnboarding(false)
      }
    } catch (error) {
      console.error('Error checking onboarding:', error)
      setIsCheckingOnboarding(false)
    }
  }, [hasCheckedOnboarding, pathname, router])

  // Check onboarding status ONCE on mount
  useEffect(() => {
    console.log('Dashboard: useEffect triggered', {
      hasCheckedOnboarding,
      pathname,
      isCheckingOnboarding,
      isRedirecting
    })
    
    checkOnboarding()
  }, [hasCheckedOnboarding, pathname, isCheckingOnboarding, isRedirecting, checkOnboarding])

  useEffect(() => {
    const trial = searchParams.get('trial')
    if (trial === 'canceled') {
      setNotificationType('canceled')
      setShowNotification(true)
      // Auto dismiss after 8 seconds
      setTimeout(() => setShowNotification(false), 8000)
    } else if (trial === 'started') {
      setNotificationType('started')
      setShowNotification(true)
      // Auto dismiss after 8 seconds
      setTimeout(() => setShowNotification(false), 8000)
    }
  }, [searchParams])

  // Show loading screen while checking onboarding
  if (isCheckingOnboarding || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Sparkles className="w-16 h-16 text-purple-600" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-gray-900 mb-2"
          >
            {isRedirecting ? 'Redirecting to onboarding...' : 'Loading your dashboard...'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            {isRedirecting ? 'Setting up your experience' : 'Just a moment'}
          </motion.p>
          
          {/* Loading progress animation */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4 max-w-xs mx-auto"
          />
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-6 min-h-screen relative overflow-hidden"
    >
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            {notificationType === 'canceled' ? (
              <div className="bg-white border-l-4 border-yellow-500 rounded-lg shadow-xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Trial Setup Canceled</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    No worries! You can start your 7-day free trial anytime from Settings.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push('/dashboard/settings?tab=subscription')}
                    className="mt-3"
                  >
                    Start Trial Now
                  </Button>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-xl p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">🎉 Trial Started!</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your 7-day free trial is now active. Enjoy full access to all features!
                  </p>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your social media performance across all platforms
          </p>
        </div>
        <motion.div 
          className="flex gap-2 flex-wrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="outline" size="sm" className="border-2 hover:shadow-lg transition-all">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            size="sm" 
            onClick={() => router.push('/dashboard/create-post')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {overviewMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              style={{ perspective: 1000 }}
            >
              <Card className="relative overflow-hidden border-2 border-white/50 backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 hover:opacity-5 transition-opacity`}></div>
                
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      className={`p-3 rounded-xl ${metric.bgColor}`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`h-6 w-6 ${metric.color}`} />
                    </motion.div>
                    <motion.div 
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                        metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                      animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                    >
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-sm font-bold">{metric.change}</span>
                    </motion.div>
                  </div>
                  <motion.h3 
                    className="text-3xl font-bold text-gray-900 mb-1"
                    animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                  >
                    {metric.value}
                  </motion.h3>
                  <p className="text-sm text-gray-600 font-medium">{metric.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="relative overflow-hidden border-2 border-white/50 backdrop-blur-md bg-gradient-to-br from-white/90 to-white/70 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-20"></div>
          
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-2 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-6 w-6 text-yellow-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900">Quick Stats</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group"
                  >
                    <div className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all cursor-pointer">
                      <Icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-600 font-medium text-center">{stat.label}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="relative overflow-hidden border-2 border-white/50 backdrop-blur-md bg-gradient-to-br from-white/90 to-white/70 shadow-2xl">
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20"></div>
            
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Platform Performance</h3>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  {platformPerformance.length} Platforms
                </Badge>
              </div>

              <div className="space-y-3">
                {platformPerformance.map((platform, index) => {
                  const Icon = platform.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="group"
                    >
                      <div className="relative overflow-hidden flex items-center justify-between p-4 rounded-xl bg-white/70 backdrop-blur-sm border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all">
                        <div className={`absolute inset-0 bg-gradient-to-r ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                        
                        <div className="flex items-center gap-4 relative">
                          <motion.div 
                            className="p-3 bg-white rounded-xl shadow-md"
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className={`h-6 w-6 ${platform.iconColor}`} />
                          </motion.div>
                          <div>
                            <p className="font-bold text-gray-900">{platform.platform}</p>
                            <p className="text-sm text-gray-600">{platform.posts} posts published</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 relative">
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {platform.engagement}
                            </p>
                            <p className="text-xs text-gray-600 font-medium">Engagement</p>
                          </div>
                          <div className="text-right">
                            <div className={`flex items-center gap-1 ${
                              platform.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {platform.trend === 'up' ? (
                                <ArrowUpRight className="h-5 w-5" />
                              ) : (
                                <TrendingDown className="h-5 w-5" />
                              )}
                              <span className="font-bold text-lg">{platform.rate}</span>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Rate</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="relative overflow-hidden border-2 border-white/50 backdrop-blur-md bg-gradient-to-br from-white/90 to-white/70 shadow-2xl h-full">
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-3xl opacity-20"></div>
            
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Upcoming</h3>
                </div>
                <Badge className="bg-green-100 text-green-700 border-0">
                  {upcomingPosts.length} Scheduled
                </Badge>
              </div>

              <div className="space-y-3">
                {upcomingPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.03, x: 5 }}
                  >
                    <div className="p-3 bg-white/70 backdrop-blur-sm border-2 border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 capitalize">
                            {post.platform}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold ml-6">
                        {post.scheduledTime}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="relative overflow-hidden border-2 border-white/50 backdrop-blur-md bg-gradient-to-br from-white/90 to-white/70 shadow-2xl">
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full blur-3xl opacity-20"></div>
          
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-pink-600" />
                <h3 className="text-xl font-bold text-gray-900">Recent Posts Performance</h3>
              </div>
            </div>

            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="group p-4 bg-white/70 backdrop-blur-sm border-2 border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-xl transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="capitalize bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 border-0">
                            {post.platform}
                          </Badge>
                          <span className="text-xs text-gray-500 font-medium">{post.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 font-medium">{post.content}</p>
                        <div className="flex items-center gap-6">
                          <motion.div 
                            className="flex items-center gap-1 text-pink-600"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Heart className="h-4 w-4" />
                            <span className="text-sm font-bold">{post.likes.toLocaleString()}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-1 text-blue-600"
                            whileHover={{ scale: 1.1 }}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm font-bold">{post.comments}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-1 text-green-600"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm font-bold">{post.shares}</span>
                          </motion.div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-2 hover:shadow-md transition-all whitespace-nowrap"
                      >
                        View Details →
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="relative overflow-hidden border-2 border-white/50 backdrop-blur-md bg-gradient-to-br from-white/90 to-white/70 shadow-2xl">
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full blur-3xl opacity-20"></div>
          
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Engagement Trend (Last 7 Days)</h3>
              </div>
            </div>

            <motion.div 
              className="h-64 flex items-center justify-center bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center p-6">
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                >
                  <BarChart3 className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-900 font-bold text-lg mb-2">Chart Visualization Coming Soon</p>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Advanced analytics with engagement trends, best posting times, and performance insights
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
