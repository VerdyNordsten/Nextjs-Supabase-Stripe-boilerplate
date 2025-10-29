"use client";

import { VideoModal } from '@/components/VideoModal';
import { useLandingPage } from '@/hooks/useLandingPage';
import {
  Navigation,
  HeroSection,
  TestimonialsSection,
  MetricsSection,
  PainPointsSolutionsSection,
  CalendarSection,
  FeaturesSection,
  ResultsSection,
  PricingSection,
  FAQSection,
  CTASection,
  Footer
} from '@/components/landing-page';

export default function LandingPage() {
  const {
    isVideoModalOpen,
    isCreatingTrial,
    handleStartTrial,
    openVideoModal,
    closeVideoModal
  } = useLandingPage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onStartTrial={handleStartTrial}
        isCreatingTrial={isCreatingTrial}
      />
      
      <HeroSection
        onStartTrial={handleStartTrial}
        isCreatingTrial={isCreatingTrial}
        onOpenVideoModal={openVideoModal}
      />
      
      <TestimonialsSection />
      <MetricsSection />
      <PainPointsSolutionsSection />
      <CalendarSection />
      <FeaturesSection />
      <ResultsSection />
      <PricingSection
        onStartTrial={handleStartTrial}
        isCreatingTrial={isCreatingTrial}
      />
      <FAQSection />
      <CTASection
        onStartTrial={handleStartTrial}
        isCreatingTrial={isCreatingTrial}
      />
      <Footer />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        videoId="3UTMXKg47BM"
      />
    </div>
  );
}