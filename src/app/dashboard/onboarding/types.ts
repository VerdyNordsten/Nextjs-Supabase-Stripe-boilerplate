export interface BrandTemplate {
  id: string
  name: string
  icon: string
  color: string
}

export interface Step {
  id: number
  title: string
  icon: React.ReactNode
  completed: boolean
  color: string
  description: string
}

export interface ProgressStepProps {
  step: Step
  isCurrent: boolean
  isCompleted: boolean
  onClick: () => void
}

export interface BrandTemplateCardProps {
  template: BrandTemplate
  isSelected: boolean
  onClick: () => void
}

export interface StepContentProps {
  currentStep: number
  brandName: string
  selectedTemplate: string
  isLoading: boolean
  onBrandNameChange: (value: string) => void
  onTemplateSelect: (template: BrandTemplate) => void
  onCreateBrand: () => void
  onConnectAccounts: () => void
  onSkipToPost: () => void
  onCreatePost: () => void
  onSkipOnboarding: () => void
}