"use client";

import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { socialPlatforms } from '@/constants/landing-page';

interface HeroSectionProps {
  onStartTrial: () => void;
  isCreatingTrial: boolean;
  onOpenVideoModal: () => void;
}

export function HeroSection({ onStartTrial, isCreatingTrial, onOpenVideoModal }: HeroSectionProps) {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-b from-blue-50/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Schedule your social<br/>
              <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                media posts
              </span> in one place.
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Save time and stay consistent with SaaS Templates. Schedule, manage, and publish content 
              across all your social media platforms with AI-powered tools.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={onStartTrial}
                disabled={isCreatingTrial}
                className="px-8 py-4 bg-primary text-primary-foreground text-lg rounded-lg hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 font-medium"
                whileHover={{ scale: isCreatingTrial ? 1 : 1.05 }}
                whileTap={{ scale: isCreatingTrial ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Get Started - 7 Day Free Trial
              </motion.button>
              <button
                onClick={onOpenVideoModal}
                className="px-8 py-4 bg-background text-primary text-lg rounded-lg border-2 border-primary hover:bg-muted transition-all font-medium"
              >
                Watch Demo
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                Free 7-day trial
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                No charge during trial
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 flex justify-center items-center gap-8 flex-wrap"
          >
            {socialPlatforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <platform.icon className={`h-10 w-10 ${platform.color}`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}