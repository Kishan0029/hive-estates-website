import { useState, useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "hi", label: "हिंदी" },
];

export function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read the current language from the googtrans cookie
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match) {
      const parts = match[1].split("/");
      if (parts.length > 2 && parts[2]) {
        setCurrentLang(parts[2]);
      }
    }

    if (!document.querySelector("#google-translate-script")) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate) {
          new window.google.translate.TranslateElement(
            { pageLanguage: "en", autoDisplay: false },
            "google_translate_element"
          );
        }
      };
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (code: string) => {
    // Aggressively set and clear cookies for both current domain and root
    if (code === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
      document.cookie = "googtrans=/en/en; path=/;";
      document.cookie = `googtrans=/en/en; domain=.${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${code}; path=/;`;
      document.cookie = `googtrans=/en/${code}; domain=.${window.location.hostname}; path=/;`;
    }
    
    try {
      window.localStorage.removeItem("googtrans");
      window.sessionStorage.removeItem("googtrans");
    } catch (e) {}

    window.location.reload();
  };

  return (
    <div className="relative">
      {/* Hidden element for Google Translate to attach to */}
      <div id="google_translate_element" className="hidden" />

      {/* Global CSS overrides to brutally hide Google's default banner and tooltips */}
      <style>{`
        body { top: 0 !important; position: static !important; }
        .goog-te-banner-frame { display: none !important; }
        .skiptranslate > iframe { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
      `}</style>

      {/* Our Custom Beautiful UI */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="notranslate flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-[13px] font-bold rounded-full bg-secondary/70 text-foreground hover:bg-secondary transition-all shadow-sm"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
        <span>{LANGUAGES.find(l => l.code === currentLang)?.label || "English"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-[100]">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setIsOpen(false);
                changeLanguage(lang.code);
              }}
              className={`notranslate w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors ${currentLang === lang.code ? 'font-bold text-primary bg-primary/5' : 'font-medium text-foreground/80'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
