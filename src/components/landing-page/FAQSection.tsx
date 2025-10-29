"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { faqs } from '@/constants/landing-page';

export function FAQSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary mb-2">FAQ</p>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center bg-background hover:bg-muted transition"
              >
                <span className="font-semibold text-foreground text-left">{faq.question}</span>
                {openFaqIndex === index ? (
                  <FaChevronUp className="text-primary flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {openFaqIndex === index && (
                <div className="px-6 py-4 bg-muted border-t border-border">
                  <p className="text-foreground/80">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}