/********************************************************************* 
Author: Sukanta Manna  
Purpose: Horizontal continuous auto-scrolling ticker for app services.
**********************************************************************/
import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
    Flame,
    Tornado,
    ThermometerSun,
    MountainSnow,
    ChevronDown,
    Baby,
    Biohazard,
    HeartPulse,
    ShieldAlert,
    Ribbon,
    Stethoscope,
} from 'lucide-react';
import { ui } from "../i18n/ui";
import Volcano from "../components/icons/Volcano";
import Tsunami from "../components/icons/Tsunami";
import Flood from "../components/icons/Flood";

interface ServicesMarqueeProps {
  currentLang: keyof typeof ui;
}

export default function ServicesMarquee({ currentLang }: ServicesMarqueeProps) {
  const t = (key: keyof typeof ui['en']) => {
        const langObj = ui[currentLang] as Record<keyof typeof ui['en'], string>;
        return langObj[key] || ui['en'][key];
    };  
  const localizeUrl = (url: string) => currentLang === 'en' ? url : `/${currentLang}${url}`;

  const services = [
    { title: t("sidebar.categories.earthquakes"), url: '/earthquakes', icon: Activity, color: 'text-emerald-500' },
    { title: t("sidebar.categories.volcaniceruptions"), url: '/volcaniceruptions', icon: Volcano, color: 'text-amber-500' },
    { title: t("sidebar.categories.storms"), url: '/storms', icon: Tornado, color: 'text-sky-500' },
    { title: t("sidebar.categories.tsunamis"), url: '/tsunamis', icon: Tsunami, color: 'text-blue-500' },
    { title: t("sidebar.categories.floods"), url: '/floods', icon: Flood, color: 'text-indigo-500' },
    { title: t("sidebar.categories.droughts"), url: '/droughts', icon: ThermometerSun, color: 'text-orange-500' },
    { title: t("sidebar.categories.wildfires"), url: '/wildfires', icon: Flame, color: 'text-rose-500' },
    { title: t("sidebar.categories.avalanches"), url: '/avalanches', icon: MountainSnow, color: 'text-cyan-500' },
    { title: t("sidebar.categories.childmortality"), url: '/childmortality', icon: Baby, color: 'text-pink-500' },
    { title: t("sidebar.categories.hepatitis"), url: '/hepatitis', icon: ShieldAlert, color: 'text-violet-500' },
    { title: t("sidebar.categories.hiv"), url: '/hiv', icon: Ribbon, color: 'text-red-500' },
    { title: t("sidebar.categories.lifeexpectancy"), url: '/lifeexpectancy', icon: HeartPulse, color: 'text-teal-500' },
    { title: t("sidebar.categories.mumps"), url: '/mumps', icon: Biohazard, color: 'text-lime-500' },
    { title: t("sidebar.categories.tuberculosis"), url: '/tuberculosis', icon: Stethoscope, color: 'text-purple-500' },
  ];

  // Duplicate list to achieve a seamless loop
  const duplicatedServices = [...services, ...services];

  return (
    <section className="w-full py-6 border-y border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/90 relative overflow-hidden group">
      {/* Edge Fade Overlays matched for both light and dark mode */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-slate-100 dark:from-slate-950 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-slate-100 dark:from-slate-950 to-transparent pointer-events-none" />

      {/* Marquee Motion Container */}
      <motion.div
        className="flex gap-4 w-max h-1 items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          ease: 'linear',
          duration: 30,
          repeat: Infinity,
        }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {duplicatedServices.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={`${item.title}-${index}`}
              href={localizeUrl(item.url)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all shrink-0 group/card"
            >
              <Icon className={`h-4 w-4 ${item.color} group-hover/card:scale-110 transition-transform`} />
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                {item.title}
              </span>
            </a>
          );
        })}
      </motion.div>
    </section>
  );
}