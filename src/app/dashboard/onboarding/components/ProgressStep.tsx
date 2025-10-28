import { motion } from 'framer-motion'
import { CheckCircle, Trophy } from 'lucide-react'
import { ProgressStepProps } from '../types'

const ProgressStep: React.FC<ProgressStepProps> = ({ step, isCurrent, isCompleted, onClick }) => {
  const getAnimationState = () => {
    if (isCompleted) return "completed";
    if (isCurrent) return "active";
    return "inactive";
  };

  const stepVariants = {
    inactive: { scale: 1, rotateY: 0, opacity: 0.7, transition: { duration: 0.3 } },
    active: {
      scale: 1.15,
      rotateY: 360,
      opacity: 1,
      transition: { duration: 0.5, rotateY: { duration: 0.6, ease: "easeInOut" } }
    },
    completed: {
      scale: 1,
      rotateY: 720,
      opacity: 1,
      transition: { duration: 0.4, rotateY: { duration: 0.8, ease: "easeInOut" } }
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center cursor-pointer"
      onClick={onClick}
      variants={stepVariants}
      animate={getAnimationState()}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {isCurrent && (
        <motion.div
          className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      <motion.div
        className={`relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform-gpu preserve-3d ${
          isCompleted
            ? 'bg-gradient-to-br ' + step.color
            : isCurrent
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl'
            : 'bg-gray-200'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateY(0deg)',
        }}
      >
        <div className="relative z-10">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
          ) : (
            <div className="text-white">
              {step.icon}
            </div>
          )}
        </div>
        
        {isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </motion.div>
      
      <motion.div
        className={`mt-4 text-center max-w-[120px] ${
          isCurrent ? 'text-blue-600 font-bold' : isCompleted ? 'text-green-600 font-semibold' : 'text-gray-500'
        }`}
        animate={{
          y: isCurrent ? [0, -3, 0] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isCurrent ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <p className="text-sm font-medium">{step.title}</p>
        {isCurrent && (
          <p className="text-xs mt-1 opacity-80">{step.description}</p>
        )}
      </motion.div>
      
      {isCompleted && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressStep