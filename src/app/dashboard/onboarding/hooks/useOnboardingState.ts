import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser as supabase } from '@/utils/supabase-browser'
import { User } from '@supabase/supabase-js'

export const useOnboardingState = (user: User | null) => {
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onboarding_step')
      return saved ? parseInt(saved) : 2
    }
    return 2
  })
  
  const [brandName, setBrandName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false)
  const [isPageReady, setIsPageReady] = useState(false)

  // Save step to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_step', currentStep.toString())
    }
  }, [currentStep])

  // Check if onboarding is already completed
  const checkOnboarding = useCallback(async () => {
    if (!user?.id || hasCheckedOnboarding) return
    
    setHasCheckedOnboarding(true)

    const { data } = await supabase
      .from('user_preferences')
      .select('has_completed_onboarding')
      .eq('user_id', user.id)
      .maybeSingle()

    if (data?.has_completed_onboarding) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('onboarding_step')
      }
      router.push('/dashboard')
    }
  }, [user?.id, hasCheckedOnboarding, router])

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (existing) {
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({ has_completed_onboarding: true })
          .eq('user_id', user.id)
        
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            has_completed_onboarding: true
          })
        
        if (insertError) throw insertError
      }
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('onboarding_step')
      }
      
      return true
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw error
    }
  }, [user?.id])

  // Initialize page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageReady(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    checkOnboarding()
  }, [checkOnboarding])

  return {
    currentStep,
    setCurrentStep,
    brandName,
    setBrandName,
    selectedTemplate,
    setSelectedTemplate,
    isLoading,
    setIsLoading,
    isPageReady,
    completeOnboarding,
    checkOnboarding
  }
}