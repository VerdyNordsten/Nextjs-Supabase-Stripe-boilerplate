import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Users, PenTool, ChevronRight, Zap, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StepContentProps, BrandTemplate } from '../types'
import { BRAND_TEMPLATES, ANIMATION_VARIANTS } from '../constants'
import BrandTemplateCard from './BrandTemplateCard'

const StepContent: React.FC<StepContentProps> = ({
  currentStep,
  brandName,
  selectedTemplate,
  isLoading,
  onBrandNameChange,
  onTemplateSelect,
  onCreateBrand,
  onConnectAccounts,
  onSkipToPost,
  onCreatePost,
  onSkipOnboarding
}) => {
  const handleTemplateSelect = (template: BrandTemplate) => {
    onTemplateSelect(template)
    onBrandNameChange(template.name)
  }

  return (
    <AnimatePresence mode="wait">
      {currentStep === 2 && (
        <motion.div
          key="step2"
          {...ANIMATION_VARIANTS.pageTransition}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <motion.div
            variants={ANIMATION_VARIANTS.container}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={ANIMATION_VARIANTS.item} className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Create Your First Brand
              </h2>
              <p className="text-gray-600 text-lg">
                Organize your social accounts and posts in one beautiful space
              </p>
            </motion.div>
            
            <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  What's your brand name?
                </label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {BRAND_TEMPLATES.map((template) => (
                    <BrandTemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onClick={() => handleTemplateSelect(template)}
                    />
                  ))}
                </div>
                
                <div className="relative">
                  <Input
                    type="text"
                    value={brandName}
                    onChange={(e) => onBrandNameChange(e.target.value)}
                    placeholder="Enter your brand name"
                    className="h-14 text-lg px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all"
                    maxLength={50}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-3 flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  You can always change this later and add more brands
                </p>
              </div>
            </motion.div>

            <motion.div variants={ANIMATION_VARIANTS.item} className="pt-4 space-y-4">
              <Button
                onClick={onCreateBrand}
                disabled={!brandName.trim() || isLoading}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating your brand...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <span className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  368+ brands created on SaaS Templates
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {currentStep === 3 && (
        <motion.div
          key="step3"
          {...ANIMATION_VARIANTS.pageTransition}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <motion.div
            variants={ANIMATION_VARIANTS.container}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={ANIMATION_VARIANTS.item} className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Connect Your Social Accounts
              </h2>
              <p className="text-gray-600 text-lg">
                Link your social media accounts to start managing your content
              </p>
            </motion.div>
            
            <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-4">
              <Button
                onClick={onConnectAccounts}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-lg font-semibold rounded-xl shadow-lg transition-all"
              >
                <Users className="w-5 h-5 mr-3" />
                Connect Your Accounts
              </Button>
              
              <Button
                onClick={onSkipToPost}
                variant="outline"
                className="w-full h-14 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-lg font-semibold rounded-xl transition-all"
              >
                Skip for Now
              </Button>
            </motion.div>

            <motion.div variants={ANIMATION_VARIANTS.item} className="text-center">
              <span className="inline-flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
                <Star className="w-4 h-4" />
                Almost there! 50% Complete
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {currentStep === 4 && (
        <motion.div
          key="step4"
          {...ANIMATION_VARIANTS.pageTransition}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <motion.div
            variants={ANIMATION_VARIANTS.container}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={ANIMATION_VARIANTS.item} className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <PenTool className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Create Your First Post
              </h2>
              <p className="text-gray-600 text-lg">
                Start creating and scheduling content for your social media
              </p>
            </motion.div>

            <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-4">
              <Button
                onClick={onCreatePost}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg font-semibold rounded-xl shadow-lg transition-all"
              >
                <PenTool className="w-5 h-5 mr-3" />
                Create Your First Post
              </Button>
              
              <Button
                onClick={onSkipOnboarding}
                variant="outline"
                disabled={isLoading}
                className="w-full h-14 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-lg font-semibold rounded-xl transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    Completing setup...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    Skip & Go to Dashboard
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </motion.div>

            <motion.div variants={ANIMATION_VARIANTS.item} className="text-center">
              <span className="inline-flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4" />
                Final step! 75% Complete
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StepContent