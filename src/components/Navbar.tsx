/********************************************************************* 
Author: Sukanta Manna   
Purpose: Show navbar with multi-language switching capabilities.
**********************************************************************/
import React from 'react';
import { ModeToggle } from './ModeToggle'; 
import { SidebarTrigger } from './ui/sidebar';
import { Languages } from 'lucide-react';
import { ui } from '../i18n/ui';

interface NavbarProps {
  currentLang: keyof typeof ui;
  currentPath: string;
}

function Navbar({ currentLang, currentPath }: NavbarProps) {
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetLang = e.target.value;
    
    // Strip out existing language prefix (es, fr, etc.) to avoid nested paths
    let cleanPath = currentPath;
    const langPrefixPattern = /^\/(bn|es|fr|hi|ja|ru|zh)(\/|$)/;
    
    if (langPrefixPattern.test(cleanPath)) {
      cleanPath = cleanPath.replace(/^\/(bn|es|fr|hi|ja|ru|zh)/, '') || '/';
    }
    
    const destination = targetLang === 'en' 
      ? cleanPath 
      : `/${targetLang}${cleanPath === '/' ? '' : cleanPath}`;
      
    window.location.href = destination; // Triggers full server page reload for Astro
  };

  return (
    <nav className='h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 w-full bg-white dark:bg-slate-950 shrink-0'>
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle Button */}
        <SidebarTrigger className="mr-2" />
      </div>

      {/* RIGHT */}
      <div className='flex items-center gap-4'>
        <ModeToggle />
        
        {/* 🌟 Language Selector added right after ModeToggle */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm">
          <Languages className="h-4 w-4 text-slate-400 shrink-0" />
          <select 
            value={currentLang} 
            onChange={handleLanguageChange}
            className="text-xs font-medium focus:outline-none cursor-pointer bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="en" >English (EN)</option>
            <option value="bn">বাংলা (IN)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="hi">हिंदी (IN)</option>
            <option value="ja">日本語 (JP)</option>
            <option value="ru">русский (RU)</option>
            <option value="zh">中国人 (CN)</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

/*
import React from 'react';
import { ModeToggle } from './ModeToggle'; 
import { SidebarTrigger } from './ui/sidebar';
import { Languages } from 'lucide-react';
import { ui } from '../i18n/ui';

interface NavbarProps {
  currentLang: keyof typeof ui;
  currentPath: string;
}

function Navbar({ currentLang, currentPath }: NavbarProps) {
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetLang = e.target.value;
    
    // Strip out existing language prefix (es, fr, etc.) to avoid nested paths
    let cleanPath = currentPath;
    const langPrefixPattern = /^\/(bn|es|fr|hi|ja|ru|zh)(\/|$)/;
    
    if (langPrefixPattern.test(cleanPath)) {
      cleanPath = cleanPath.replace(/^\/(bn|es|fr|hi|ja|ru|zh)/, '') || '/';
    }
    
    const destination = targetLang === 'en' 
      ? cleanPath 
      : `/${targetLang}${cleanPath === '/' ? '' : cleanPath}`;
      
    window.location.href = destination; // Triggers full server page reload for Astro
  };

  return (
    <nav className='h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 w-full bg-white dark:bg-slate-950 shrink-0'>
  
      <div className="flex items-center gap-3">
  
        <SidebarTrigger className="mr-2" />
      </div>

  
      <div className='flex items-center gap-4'>
        <ModeToggle />
        
  
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm">
          <Languages className="h-4 w-4 text-slate-400 shrink-0" />
          <select className="text-xs font-medium focus:outline-none cursor-pointer bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            <option value="en" >English (EN)</option>
            <option value="bn">বাংলা (IN)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="hi">हिंदी (IN)</option>
            <option value="ja">日本語 (JP)</option>
            <option value="ru">русский (RU)</option>
            <option value="zh">中国人 (CN)</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
*/