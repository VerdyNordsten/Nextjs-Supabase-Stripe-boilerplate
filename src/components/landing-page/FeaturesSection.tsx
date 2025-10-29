"use client";

import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { powerfulFeatures } from '@/constants/landing-page';

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary mb-2">FEATURES</p>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Powerful <span className="text-primary">Features</span> Built to Save Time
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {powerfulFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="mt-4">
                  <FaCheck className="text-green-500 inline-block mr-2" />
                  <span className="text-sm text-foreground/80">Available on all plans</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}