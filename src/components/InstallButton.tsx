"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function InstallButton() {
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

    if (!isInstalled) {
      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setShowInstallButton(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      };
    }
  }, []);

  const handleInstallClick = () => {
    if (
      typeof window !== "undefined" &&
      (window as { showInstallPrompt?: () => void }).showInstallPrompt
    ) {
      (window as { showInstallPrompt?: () => void }).showInstallPrompt?.();
      setShowInstallButton(false);
    }
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <button
      id="install-button"
      onClick={handleInstallClick}
      className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center space-x-2"
      aria-label="Install Set Swiper app"
    >
      <Download className="w-4 h-4" />
      <span className="text-sm font-medium">Install App</span>
    </button>
  );
}
