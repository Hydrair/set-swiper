"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ScryfallStatus() {
  const [isScryfallDown, setIsScryfallDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScryfallStatus = async () => {
      try {
        const response = await fetch("https://api.scryfall.com/health");
        const data = await response.json();

        if (!response.ok || data.status !== "healthy") {
          setIsScryfallDown(true);
          setIsVisible(true);
        } else {
          setIsScryfallDown(false);
          setIsVisible(false);
        }
      } catch (error) {
        console.error("Error checking Scryfall status:", error);
        setIsScryfallDown(true);
        setIsVisible(true);
      }
    };

    // Check immediately
    checkScryfallStatus();

    // Check every 5 minutes
    const interval = setInterval(checkScryfallStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !isScryfallDown) {
    return null;
  }

  return (
    <div className="bg-theme-warning border-b border-theme-warning">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-theme-warning mr-2" />
          <span className="text-sm text-theme-warning">
            Scryfall API is currently experiencing issues. Some card data may be
            unavailable.
          </span>
        </div>
      </div>
    </div>
  );
}
