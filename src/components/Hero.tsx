/********************************************************************* 
Author: Sukanta Manna  
Purpose: Hero section top
**********************************************************************/
import { ui } from "../i18n/ui";

interface HeroProps {
  currentLang: keyof typeof ui;
}

export default function Hero({ currentLang }: HeroProps) {
  const t = (key: keyof typeof ui['en']) => {
        const langObj = ui[currentLang] as Record<keyof typeof ui['en'], string>;
        return langObj[key] || ui['en'][key];
    };  
  const localizeUrl = (url: string) => currentLang === 'en' ? url : `/${currentLang}${url}`;

  return (
    
      <section
      className="w-full border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-12 sm:px-6 md:py-16 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900"
    >
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        {/* Status Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-rose-600 uppercase dark:text-rose-400"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500"></span>
          {t("hero.l1")}
        </div>

        {/* Hero Title */}
        <h1
          className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100"
        >
          {t("hero.l2")}
        </h1>

        {/* Subtitle / Description */}
        <p
          className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400"
        >
          {t("hero.l3")}
        </p>

        {/* Call To Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={localizeUrl("/earthquakes")}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700"
          >
            {t("hero.map")}
          </a>
          <a
            href="https://t.me/+ysf-AxpCp5lhMmI1"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {t("hero.community")}
          </a>
        </div>
      </div>
    
    </section>
  );
}