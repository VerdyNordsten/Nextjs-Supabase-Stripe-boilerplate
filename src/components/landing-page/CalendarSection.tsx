"use client";

import { Calendar } from 'lucide-react';

export function CalendarSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary mb-2">VISUAL PLANNING</p>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Finally, a calendar that expands your view
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See your entire content strategy at a glance. Drag, drop, and organize posts
            across all platforms with our intuitive calendar view.
          </p>
        </div>
        <div className="bg-linear-to-br from-muted/50 to-background rounded-2xl p-8 border border-border shadow-xl">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Calendar className="h-24 w-24 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}