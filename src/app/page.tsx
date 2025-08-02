"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import CardInput from "@/components/CardInput";
import CardDisplay from "@/components/CardDisplay";
import FavoritesList from "@/components/FavoritesList";
import CacheDebug from "@/components/CacheDebug";
import InstallButton from "@/components/InstallButton";
import { useAppStore } from "@/lib/store";

type View = "input" | "swipe" | "favorites";

export default function Home() {
  const { cardList, currentCardIndex } = useAppStore();
  const [currentView, setCurrentView] = useState<View>("input");

  // Auto-switch to completion view if we've finished swiping
  useEffect(() => {
    if (cardList.length > 0 && currentCardIndex >= cardList.length) {
      setCurrentView("favorites");
    }
  }, [cardList.length, currentCardIndex]);

  const renderCurrentView = () => {
    switch (currentView) {
      case "input":
        return <CardInput onCardsAdded={() => setCurrentView("swipe")} />;
      case "swipe":
        return <CardDisplay />;
      case "favorites":
        return <FavoritesList />;
      default:
        return <CardInput onCardsAdded={() => setCurrentView("swipe")} />;
    }
  };

  return (
    <div className="min-h-screen bg-theme-primary">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      <main className="mx-auto py-4 md:py-8 px-4">{renderCurrentView()}</main>

      <CacheDebug />
      <InstallButton />
    </div>
  );
}
