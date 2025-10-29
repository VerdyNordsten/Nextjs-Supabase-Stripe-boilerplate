"use client";

import { motion } from 'framer-motion';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { painPoints, solutions } from '@/constants/landing-page';

export function PainPointsSolutionsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Goodbye Stress. Hello Simpler Scheduling.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-destructive mb-6 flex items-center">
              <FaTimes className="mr-3" /> Old Way
            </h3>
            <div className="space-y-4">
              {painPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start bg-background rounded-lg p-4 border border-destructive/20"
                >
                  <FaTimes className="text-destructive mt-1 mr-3 flex-shrink-0" />
                  <span className="text-foreground/80">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
              <FaCheck className="mr-3" /> SaaS Templates
            </h3>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start bg-background rounded-lg p-4 border border-green-200"
                >
                  <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-foreground/80">{solution}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}