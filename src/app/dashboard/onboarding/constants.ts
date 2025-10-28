import { BrandTemplate } from './types'

export const BRAND_TEMPLATES: BrandTemplate[] = [
  { id: 'personal', name: 'Personal', icon: '👤', color: 'from-purple-500 to-pink-500' },
  { id: 'business', name: 'My Business', icon: '💼', color: 'from-blue-500 to-cyan-500' },
  { id: 'side-project', name: 'Side Project', icon: '🚀', color: 'from-orange-500 to-red-500' },
  { id: 'agency', name: 'Agency', icon: '🏢', color: 'from-green-500 to-teal-500' },
  { id: 'startup', name: 'Startup', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
]

export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  },
  pageTransition: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.3 },
  }
}