"use client"

import { useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Users, Rocket, Target } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabaseBrowser as supabase } from '@/utils/supabase-browser'

import { Step } from './types'
import { useConfetti, useOnboardingState } from './hooks'
import { ProgressStep, StepContent, AnimatedBackground } from './components'

const getSteps = (currentStep: number): Step[] => [
  {
    id: 1,
    title: 'Sign Up',
    icon: <Sparkles className="w-8 h-8" />,
    completed: true,
    color: 'from-green-400 to-emerald-600',
    description: 'Welcome aboard!'
  },
  {
    id: 2,
    title: 'Create Brand',
    icon: <Target className="w-8 h-8" />,
    completed: currentStep > 2,
    color: 'from-blue-400 to-indigo-600',
    description: 'Define your identity'
  },
  {
    id: 3,
    title: 'Connect Accounts',
    icon: <Users className="w-8 h-8" />,
    completed: currentStep > 3,
    color: 'from-purple-400 to-pink-600',
    description: 'Link your socials'
  },
  {
    id: 4,
    title: 'Create Post',
    icon: <Rocket className="w-8 h-8" />,
    completed: currentStep > 4,
    color: 'from-orange-400 to-red-600',
    description: 'Launch your content'
  },
]

export default function OnboardingPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const triggerConfetti = useConfetti()
  
  const {
    currentStep,
    setCurrentStep,
    brandName,
    setBrandName,
    selectedTemplate,
    setSelectedTemplate,
    isLoading,
    setIsLoading,
    isPageReady,
    completeOnboarding
  } = useOnboardingState(user)

  const steps = useMemo(() => getSteps(currentStep), [currentStep])

  const userDisplayName = useMemo(() => {
    return userProfile?.full_name || user?.email?.split('@')[0] || 'there'
  }, [userProfile?.full_name, user?.email])

  useEffect(() => {
    if (userProfile?.full_name && !brandName) {
      setBrandName(userProfile.full_name)
    }
  }, [userProfile?.full_name, brandName, setBrandName])

  const handleCreateBrand = async () => {
    if (!brandName.trim()) return

    setIsLoading(true)
    try {
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle()

      if (existing) {
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({
            brand_name: brandName,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user?.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user?.id,
            brand_name: brandName,
            has_completed_onboarding: false
          })

        if (insertError) throw insertError
      }

      triggerConfetti()

      setTimeout(() => {
        setCurrentStep(3)
      }, 500)
    } catch (error) {
      console.error('Error saving brand preference:', error)
      alert('Failed to save brand name. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectAccounts = useCallback(async () => {
    setIsLoading(true)
    try {
      triggerConfetti()
      
      setTimeout(async () => {
        await completeOnboarding()
        router.push('/dashboard')
      }, 500)
    } catch (error) {
      console.error('Error connecting accounts:', error)
      alert('Failed to complete onboarding. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [completeOnboarding, router, triggerConfetti, setIsLoading])

  const handleSkipToPost = useCallback(() => {
    setCurrentStep(4)
  }, [setCurrentStep])

  const handleCreatePost = useCallback(async () => {
    setIsLoading(true)
    try {
      triggerConfetti()
      
      setTimeout(async () => {
        await completeOnboarding()
        router.push('/dashboard/create-post')
      }, 500)
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to complete onboarding. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [completeOnboarding, router, triggerConfetti, setIsLoading])

  const handleSkipOnboarding = useCallback(async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      await completeOnboarding()
      router.push('/dashboard')
    } catch (error) {
      console.error('Error skipping onboarding:', error)
      alert('Failed to complete onboarding. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [completeOnboarding, router, user?.id, setIsLoading])

  const handleStepClick = useCallback((stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId)
    }
  }, [currentStep, setCurrentStep])

  if (!isPageReady) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-8 pb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Welcome to SaaS Templates! 🎉
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's get your account set up, {userDisplayName}!
          </p>
        </motion.div>
        
        <div className="px-6 pb-8">
          <div className="flex items-center justify-center space-x-8 md:space-x-16">
            {steps.map((step) => (
              <ProgressStep
                key={step.id}
                step={step}
                isCurrent={currentStep === step.id}
                isCompleted={step.completed}
                onClick={() => handleStepClick(step.id)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 py-12">
          <div className="w-full max-w-2xl">
            <StepContent
              currentStep={currentStep}
              brandName={brandName}
              selectedTemplate={selectedTemplate}
              isLoading={isLoading}
              onBrandNameChange={setBrandName}
              onTemplateSelect={(template) => setSelectedTemplate(template.id)}
              onCreateBrand={handleCreateBrand}
              onConnectAccounts={handleConnectAccounts}
              onSkipToPost={handleSkipToPost}
              onCreatePost={handleCreatePost}
              onSkipOnboarding={handleSkipOnboarding}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
