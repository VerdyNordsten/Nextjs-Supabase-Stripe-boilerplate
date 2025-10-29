"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onStartTrial: () => void;
  isCreatingTrial: boolean;
}

export function CTASection({ onStartTrial, isCreatingTrial }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-400">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Social Media?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Join thousands of creators saving 10+ hours every week with SaaS Templates
        </p>
        <motion.button
          onClick={onStartTrial}
          disabled={isCreatingTrial}
          className="px-8 py-4 bg-white text-blue-600 text-lg rounded-lg hover:bg-slate-50 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 font-semibold relative overflow-hidden"
          whileHover={{ scale: isCreatingTrial ? 1 : 1.05 }}
          whileTap={{ scale: isCreatingTrial ? 1 : 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <>
            Start Your Free Trial Today
            <ArrowRight className="inline-block ml-2 h-5 w-5" />
          </>
        </motion.button>
        <p className="mt-4 text-white/80">7-day free trial • No charge during trial • Cancel anytime</p>
      </div>
    </section>
  );
}