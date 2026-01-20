import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer
      className={`bg-black text-white ${className}`}
      role="contentinfo"
    >
      <div className="px-6 pt-8 pb-6">
        {/* Top section with links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left column */}
          <div className="flex flex-col gap-3">
            <a
              href="#about"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#press-room"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Press Room
            </a>
            <a
              href="#careers"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Careers
            </a>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3">
            <a
              href="#contact"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Contact Us
            </a>
            <a
              href="#privacy"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#legal"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Legal
            </a>
          </div>
        </div>

        {/* Copyright text */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            © 1825—2022 copyright of Western Insurance Company, Inc. Serving
            Colorado, Connecticut, Georgia, Illinois, Kentucky, Maine, Maryland,
            Massachusetts, Michigan, Missouri, New Hampshire, New Jersey, New
            York, North Carolina, Ohio, Pennsylvania, Rhode Island, South
            Carolina, Virginia, West Virginia, Wyoming and the District of
            Washington D.C.® and Wisconsin
          </p>
        </div>

        {/* Bottom section with legal links and language selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-gray-800">
          {/* Legal links */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#legal-disclaimer"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Legal Disclaimer
            </a>
            <a
              href="#accessibility"
              className="text-xs text-gray-400 hover:text-white transition-colors whitespace-nowrap"
            >
              Accessibility &amp; Usability
            </a>
            <a
              href="#nondiscrimination"
              className="text-xs text-gray-400 hover:text-white transition-colors whitespace-nowrap"
            >
              Nondiscrimination Notice
            </a>
            <a
              href="#healthcare-fraud"
              className="text-xs text-gray-400 hover:text-white transition-colors whitespace-nowrap"
            >
              Healthcare Fraud Prevention
            </a>
          </div>

          {/* Right side: WCAG badge and language selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5" />
                <path
                  d="M5 8L7 10L11 6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-medium text-white">WCAG 2.1 AA</span>
            </div>

            <button
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-900 rounded transition-colors"
              aria-label="Select language"
            >
              <span className="text-xs font-medium text-white">
                Select a Language
              </span>
              <ChevronDown size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
