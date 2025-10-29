import { motion } from 'framer-motion'

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
      animate={{
        x: [0, 100, 0],
        y: [0, -100, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
      animate={{
        x: [0, -100, 0],
        y: [0, 100, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  </div>
)

export default AnimatedBackground