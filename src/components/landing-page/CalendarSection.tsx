"use client";

import { Calendar } from 'lucide-react';

export function CalendarSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 mb-2">VISUAL PLANNING</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Finally, a calendar that expands your view
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See your entire content strategy at a glance. Drag, drop, and organize posts 
            across all platforms with our intuitive calendar view.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-slate-200 shadow-xl">
          <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-24 w-24 text-slate-400" />
          </div>
        </div>
      </div>
    </section>
  );
}