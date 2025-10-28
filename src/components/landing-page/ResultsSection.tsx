"use client";

import { BarChart3 } from 'lucide-react';
import { FaRobot } from 'react-icons/fa';

export function ResultsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Real results. Real users.<br/>
            <span className="text-blue-600">No fluff.</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Join thousands of content creators, agencies, and brands who trust UptoPilot 
            to manage their social media presence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-slate-200 shadow-lg">
            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-24 w-24 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Engagement Analytics</h3>
            <p className="text-slate-600">
              Track your performance across all platforms with detailed analytics and insights.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-slate-200 shadow-lg">
            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <FaRobot className="h-24 w-24 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Caption Generator</h3>
            <p className="text-slate-600">
              Generate engaging captions in seconds that match your brand voice perfectly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}