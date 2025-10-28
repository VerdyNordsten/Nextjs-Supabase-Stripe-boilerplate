import { motion } from 'framer-motion'
import { BrandTemplateCardProps } from '../types'

const BrandTemplateCard: React.FC<BrandTemplateCardProps> = ({ template, isSelected, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative p-4 rounded-xl border-2 transition-all ${
      isSelected
        ? 'border-transparent bg-gradient-to-r ' + template.color + ' text-white shadow-lg'
        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
    }`}
  >
    <div className="flex flex-col items-center space-y-2">
      <span className="text-2xl">{template.icon}</span>
      <span className="font-medium">{template.name}</span>
    </div>
  </motion.button>
)

export default BrandTemplateCard