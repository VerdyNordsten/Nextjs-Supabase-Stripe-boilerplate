"use client";

import { motion } from 'framer-motion';
import { metrics } from '@/constants/landing-page';

export function MetricsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Stay confident. Look pro. Save hours.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
            >
              <div className="text-5xl font-bold text-blue-600 mb-2">{metric.value}</div>
              <div className="text-xl font-semibold text-slate-900 mb-1">{metric.label}</div>
              <div className="text-slate-600">{metric.subtext}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}