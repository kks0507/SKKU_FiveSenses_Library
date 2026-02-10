'use client';

import { useState } from 'react';
import HighlightsBanner from '@/components/home/HighlightsBanner';
import ModeToggle from '@/components/home/ModeToggle';
import BookclubZoneSection from '@/components/home/emax/BookclubZoneSection';
import NarrationZoneSection from '@/components/home/emax/NarrationZoneSection';
import ListeningZoneSection from '@/components/home/emax/ListeningZoneSection';
import WritingZoneSection from '@/components/home/emax/WritingZoneSection';
import ReviewZoneSection from '@/components/home/emax/ReviewZoneSection';
import InstaFeed from '@/components/home/InstaFeed';

export default function HomePage() {
  const [mode, setMode] = useState<'emax' | 'insta'>('emax');

  return (
    <div className="w-full">
      <HighlightsBanner />
      <ModeToggle mode={mode} onModeChange={setMode} />
      {mode === 'emax' ? (
        <>
          <BookclubZoneSection />
          <NarrationZoneSection />
          <ListeningZoneSection />
          <WritingZoneSection />
          <ReviewZoneSection />
        </>
      ) : (
        <InstaFeed />
      )}
    </div>
  );
}
