/********************************************************************* 
Author: Sukanta Manna  
Purpose: Switch language with Astro-island-compatible dropdown styles.
**********************************************************************/
import React from 'react';
import { Globe, Check } from 'lucide-react';
import { languages } from '../i18n/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LanguageSwitcherProps {
  currentLang: string;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const handleLanguageChange = (langKey: string) => {
    if (langKey === currentLang) return;

    const currentPath = window.location.pathname;
    const segments = currentPath.split('/').filter(Boolean);
    const supportedLangs = Object.keys(languages);

    if (supportedLangs.includes(segments[0])) {
      segments.shift();
    }

    const newPath =
      langKey === 'en'
        ? `/${segments.join('/')}`
        : `/${langKey}/${segments.join('/')}`;

    window.location.href = newPath || '/';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Select Language"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-foreground bg-background hover:bg-accent border border-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{languages[currentLang as keyof typeof languages] || 'English'}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 mt-2">
        {Object.entries(languages).map(([key, label]) => {
          const isActive = currentLang === key;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => handleLanguageChange(key)}
              className={`flex items-center justify-between font-medium cursor-pointer ${
                isActive
                  ? 'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground'
                  : 'text-foreground hover:bg-accent focus:bg-accent'
              }`}
            >
              <span>{label}</span>
              {isActive && <Check className="w-3.5 h-3.5 shrink-0 ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}