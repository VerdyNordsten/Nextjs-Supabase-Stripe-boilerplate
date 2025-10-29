"use client";

import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { 
  pricingPlan, 
  competitorComparison, 
  comparisonFeatures 
} from '@/constants/landing-page';

interface PricingSectionProps {
  onStartTrial: () => void;
  isCreatingTrial: boolean;
}

export function PricingSection({ onStartTrial, isCreatingTrial }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 mb-2">PRICING</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Affordable Pricing</h2>
          <p className="text-xl text-slate-600">One plan with everything you need. No hidden fees.</p>
        </div>

        <div className="max-w-lg mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl p-8 shadow-2xl text-white"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-slate-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                {pricingPlan.highlight}
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">{pricingPlan.name}</h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-6xl font-bold">{pricingPlan.price}</span>
                <span className="text-2xl ml-2 opacity-90">{pricingPlan.period}</span>
              </div>
              <p className="text-xl opacity-90">{pricingPlan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {pricingPlan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <FaCheck className="mt-1 mr-3 flex-shrink-0 text-yellow-300" />
                  <span className="text-white text-lg">{feature}</span>
                </li>
              ))}
            </ul>

            <motion.button
              onClick={onStartTrial}
              disabled={isCreatingTrial}
              className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-lg disabled:opacity-50"
              whileHover={{ scale: isCreatingTrial ? 1 : 1.02 }}
              whileTap={{ scale: isCreatingTrial ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {pricingPlan.cta}
            </motion.button>
            <p className="text-center mt-4 text-sm opacity-90">7-day free trial • Payment method required • No charge during trial</p>
          </motion.div>
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Why Pay More for Less?
            </h3>
            <p className="text-xl text-slate-600">
              Compare SaaS Templates with other social media management tools
            </p>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 w-48">Feature</th>
                  {competitorComparison.map((competitor, idx) => (
                    <th key={idx} className={`px-6 py-4 text-center ${idx === 0 ? 'bg-blue-50' : ''}`}>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl mb-2">{competitor.logo}</span>
                        <span className="text-sm font-bold text-slate-900">{competitor.name}</span>
                        <span className={`text-2xl font-bold mt-2 ${idx === 0 ? 'text-blue-600' : 'text-slate-600'}`}>
                          {competitor.price}
                        </span>
                        <span className="text-xs text-slate-500">/month</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{feature.label}</td>
                    {competitorComparison.map((competitor, cidx) => {
                      const value = competitor.features[feature.key as keyof typeof competitor.features];
                      return (
                        <td key={cidx} className={`px-6 py-4 text-center ${cidx === 0 ? 'bg-blue-50/50' : ''}`}>
                          {typeof value === 'boolean' ? (
                            value ? (
                              <FaCheck className={`inline-block ${cidx === 0 ? 'text-green-500 text-xl' : 'text-green-500'}`} />
                            ) : (
                              <FaTimes className="inline-block text-red-400" />
                            )
                          ) : (
                            <span className={`text-sm ${cidx === 0 ? 'font-bold text-blue-600' : 'text-slate-600'}`}>
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-white border-t-2 border-slate-200">
                  <td className="px-6 py-4"></td>
                  {competitorComparison.map((competitor, cidx) => (
                    <td key={cidx} className={`px-6 py-4 ${cidx === 0 ? 'bg-blue-50/50' : ''}`}>
                      {cidx === 0 ? (
                        <motion.button
                          onClick={onStartTrial}
                          disabled={isCreatingTrial}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 relative overflow-hidden"
                          whileHover={{ scale: isCreatingTrial ? 1 : 1.02 }}
                          whileTap={{ scale: isCreatingTrial ? 1 : 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          Start Free Trial
                        </motion.button>
                      ) : (
                        <div className="text-center">
                          <span className="text-xs text-slate-500">Starting from</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-6">
            {competitorComparison.map((competitor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 ${
                  idx === 0 ? 'border-blue-600' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{competitor.logo}</span>
                    <div>
                      <h4 className="font-bold text-slate-900">{competitor.name}</h4>
                      <p className={`text-2xl font-bold ${idx === 0 ? 'text-blue-600' : 'text-slate-600'}`}>
                        {competitor.price}<span className="text-sm text-slate-500">/mo</span>
                      </p>
                    </div>
                  </div>
                  {idx === 0 && (
                    <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                      Best Value
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {comparisonFeatures.map((feature, fidx) => {
                    const value = competitor.features[feature.key as keyof typeof competitor.features];
                    return (
                      <div key={fidx} className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">{feature.label}</span>
                        <span className="font-medium text-slate-900">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <FaCheck className="text-green-500" />
                            ) : (
                              <FaTimes className="text-red-400" />
                            )
                          ) : (
                            value
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {idx === 0 && (
                  <motion.button
                    onClick={onStartTrial}
                    disabled={isCreatingTrial}
                    className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 relative overflow-hidden"
                    whileHover={{ scale: isCreatingTrial ? 1 : 1.02 }}
                    whileTap={{ scale: isCreatingTrial ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    Start Free Trial
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-6 py-3">
              <FaCheckCircle className="text-green-500 text-xl" />
              <span className="font-semibold text-green-700">
                Save up to $230/month compared to other tools!
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}