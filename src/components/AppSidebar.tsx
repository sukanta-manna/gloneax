/********************************************************************* 
Author: Sukanta Manna  
Purpose: Create Sidebar of the application.
**********************************************************************/
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
    HeartHandshake,
    Copyright,
    ShieldCheck,
    Mail
} from "lucide-react";

import Logo from '../components/icons/Logo';
import Volcano from "../components/icons/Volcano";
import Tsunami from "../components/icons/Tsunami";
import Flood from "../components/icons/Flood";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator
} from "./ui/sidebar";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import { ui } from "../i18n/ui";

interface AppSidebarProps {
    currentLang: keyof typeof ui;
    currentPath: string;
}

// Telegram SVG Icon Component
function TelegramIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 7.641l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.536-.194 1.006.128.831.941z" />
        </svg>
    );
}

// Custom GitHub SVG Icon
function GithubIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

function AppSidebar({ currentLang, currentPath }: AppSidebarProps) {
    const t = (key: keyof typeof ui['en']) => {
        const langObj = ui[currentLang] as Record<keyof typeof ui['en'], string>;
        return langObj[key] || ui['en'][key];
    };
    
    const localizeUrl = (url: string) => currentLang === 'en' ? url : `/${currentLang}${url}`;

    // Helper function to check if the path matches the current URL
    const isPathActive = (targetUrl: string) => {
        const cleanCurrent = currentPath.replace(/\/$/, "") || "/";
        const cleanTarget = targetUrl.replace(/\/$/, "") || "/";
        return cleanCurrent === cleanTarget;
    };

    const naturalDisasters = [
        { title: t("sidebar.categories.earthquakes"), url: localizeUrl("/earthquakes"), icon: Activity, color: 'text-emerald-500' },
        { title: t("sidebar.categories.volcaniceruptions"), url: localizeUrl("/volcaniceruptions"), icon: Volcano, color: 'text-amber-500' },
        { title: t("sidebar.categories.storms"), url: localizeUrl("/storms"), icon: Tornado, color: 'text-sky-500' },
        { title: t("sidebar.categories.tsunamis"), url: localizeUrl("/tsunamis"), icon: Tsunami, color: 'text-blue-500' },
        { title: t("sidebar.categories.floods"), url: localizeUrl("/floods"), icon: Flood, color: 'text-indigo-500' },
        { title: t("sidebar.categories.droughts"), url: localizeUrl("/droughts"), icon: ThermometerSun, color: 'text-orange-500' },
        { title: t("sidebar.categories.wildfires"), url: localizeUrl("/wildfires"), icon: Flame, color: 'text-rose-500' },
        { title: t("sidebar.categories.avalanches"), url: localizeUrl("/avalanches"), icon: MountainSnow, color: 'text-cyan-500' },
    ];

    const healthItems = [
        { title: t("sidebar.categories.childmortality"), url: localizeUrl("/childmortality"), icon: Baby, color: 'text-pink-500' },
        { title: t("sidebar.categories.hepatitis"), url: localizeUrl("/hepatitis"), icon: ShieldAlert, color: 'text-violet-500' },
        { title: t("sidebar.categories.hiv"), url: localizeUrl("/hiv"), icon: Ribbon, color: 'text-red-500' },
        { title: t("sidebar.categories.lifeexpectancy"), url: localizeUrl("/lifeexpectancy"), icon: HeartPulse, color: 'text-teal-500' },
        { title: t("sidebar.categories.mumps"), url: localizeUrl("/mumps"), icon: Biohazard, color: 'text-lime-500' },
        { title: t("sidebar.categories.tuberculosis"), url: localizeUrl("/tuberculosis"), icon: Stethoscope, color: 'text-purple-500' },
    ];

    return (
        <Sidebar collapsible="icon" className="relative z-99999 border-r border-slate-200 dark:border-slate-800">
            <SidebarHeader className="h-14 px-0.5 flex items-center shrink-0 justify-start overflow-hidden">
                <SidebarMenu className="w-full">
                    <SidebarMenuItem>
                        <a href={localizeUrl("/")} className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 overflow-hidden">
                            <Logo showText={true} subtitle={t("subtitle")} />
                        </a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />

            {/* CONTENT */}
            <SidebarContent className="overflow-x-hidden group-data-[state=collapsed]:overflow-visible">
                <div className="flex-1 overflow-y-auto overflow-x-hidden group-data-[state=collapsed]:overflow-visible h-full pr-1 group-data-[state=collapsed]:pr-0 scrollbar-thin">

                    {/* 1. NATURAL DISASTERS */}
                    <SidebarGroup className="group-data-[state=collapsed]:overflow-visible">
                        <SidebarGroupLabel className="group-data-[state=collapsed]:hidden truncate">
                            {t("sidebar.naturalDisasters")}
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="group-data-[state=collapsed]:overflow-visible">
                            <SidebarMenu className="group-data-[state=collapsed]:overflow-visible">
                                {/* COLLAPSED FLYOUT */}
                                <div className="hidden group-data-[state=collapsed]:block relative group/flyout w-full mb-2">
                                    <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-md cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <Activity className="h-5 w-5" />
                                    </div>

                                    {/* Flyout Menu Container */}
                                    <div className="absolute left-8 top-0 pl-2 w-56 opacity-0 pointer-events-none group-hover/flyout:opacity-100 group-hover/flyout:pointer-events-auto transition-all duration-150 z-99999">
                                        <div className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-md p-1">
                                            <div className="px-2 py-1.5 text-xs font-semibold border-b border-slate-100 dark:border-slate-800 mb-1 text-slate-400">
                                                {t("sidebar.naturalDisasters")}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto space-y-0.5">
                                                {naturalDisasters.map((item) => {
                                                    const active = isPathActive(item.url);
                                                    return (
                                                        <a 
                                                            key={item.title} 
                                                            href={item.url} 
                                                            className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                                                                active 
                                                                    ? "bg-slate-100 dark:bg-slate-800 font-semibold text-blue-600 dark:text-blue-400" 
                                                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                            }`}
                                                        >
                                                            <item.icon className={`h-4 w-4 ${item.color} shrink-0`} />
                                                            <span className={`inline-block truncate ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>{item.title}</span>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* EXPANDED LIST */}
                                <div className="group-data-[state=collapsed]:hidden space-y-1">
                                    {naturalDisasters.map((item) => {
                                        const active = isPathActive(item.url);
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton 
                                                    asChild 
                                                    isActive={active}
                                                    className={active ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold" : ""}
                                                >
                                                    <a href={item.url} className="flex items-center gap-2 overflow-hidden">
                                                        <item.icon className={`h-4 w-4 shrink-0 ${item.color}`} />
                                                        <span className="truncate">{item.title}</span>
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </div>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* 2. HEALTH METRICS */}
                    <SidebarGroup className="group-data-[state=collapsed]:overflow-visible">
                        <SidebarGroupContent className="group-data-[state=collapsed]:overflow-visible">
                            <SidebarMenu className="group-data-[state=collapsed]:overflow-visible">
                                {/* COLLAPSED FLYOUT */}
                                <div className="hidden group-data-[state=collapsed]:block relative group/flyout w-full">
                                    <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-md cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <HeartPulse className="h-5 w-5" />
                                    </div>

                                    {/* Flyout Menu Container */}
                                    <div className="absolute left-8 top-0 pl-2 w-56 opacity-0 pointer-events-none group-hover/flyout:opacity-100 group-hover/flyout:pointer-events-auto transition-all duration-150 z-99999">
                                        <div className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-md p-1">
                                            <div className="px-2 py-1.5 text-xs font-semibold border-b border-slate-100 dark:border-slate-800 mb-1 text-slate-400">
                                                {t("sidebar.healthMetrics")}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto space-y-0.5">
                                                {healthItems.map((item) => {
                                                    const active = isPathActive(item.url);
                                                    return (
                                                        <a 
                                                            key={item.title} 
                                                            href={item.url} 
                                                            className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                                                                active 
                                                                    ? "bg-slate-100 dark:bg-slate-800 font-semibold text-blue-600 dark:text-blue-400" 
                                                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                            }`}
                                                        >
                                                            <item.icon className={`h-4 w-4 ${item.color} shrink-0`} />
                                                            <span className={`inline-block truncate ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>{item.title}</span>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* EXPANDED COLLAPSIBLE LIST */}
                                <div className="group-data-[state=collapsed]:hidden w-full">
                                    <Collapsible defaultOpen className="group/collapsible w-full">
                                        <SidebarGroupLabel asChild className="p-0 hover:bg-transparent h-auto">
                                            <CollapsibleTrigger className="w-full flex items-center justify-between text-xs font-medium text-slate-500 py-1.5 px-2">
                                                <span className="truncate">{t("sidebar.healthMetrics")}</span>
                                                <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                            </CollapsibleTrigger>
                                        </SidebarGroupLabel>
                                        <CollapsibleContent className="mt-1 space-y-1">
                                            <SidebarMenu>
                                                {healthItems.map((item) => {
                                                    const active = isPathActive(item.url);
                                                    return (
                                                        <SidebarMenuItem key={item.title}>
                                                            <SidebarMenuButton 
                                                                asChild 
                                                                isActive={active}
                                                                className={active ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold" : ""}
                                                            >
                                                                <a href={item.url} className="flex items-center gap-2 overflow-hidden">
                                                                    <item.icon className={`h-4 w-4 ${item.color} shrink-0`} />
                                                                    <span className="truncate">{item.title}</span>
                                                                </a>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    );
                                                })}
                                            </SidebarMenu>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* 3. COMMUNITY & SUPPORT */}
                    <SidebarSeparator className="my-2" />
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {/* Donate Button */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium">
                                        <a href="https://github.com/sponsors" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden">
                                            <HeartHandshake className="h-4 w-4 shrink-0 text-rose-500" />
                                            <span className="truncate">{t("donate")}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Telegram Group Link */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="https://t.me/+ysf-AxpCp5lhMmI1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden">
                                            <TelegramIcon className="h-4 w-4 shrink-0 text-sky-500" />
                                            <span className="truncate">{t("community")}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* GitHub Repository Link */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="https://github.com/gloneax" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden">
                                            <GithubIcon className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400"/>
                                            <span className="truncate">GitHub</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                
                                {/* Terms & Privacy */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        asChild 
                                        isActive={isPathActive(localizeUrl("/license"))}
                                        className={isPathActive(localizeUrl("/license")) ? "bg-slate-100 dark:bg-slate-800 font-semibold text-blue-600 dark:text-blue-400" : ""}
                                    >
                                        <a href={localizeUrl("/terms")} className="flex items-center gap-2 overflow-hidden">
                                            <ShieldCheck className="h-4 w-4 shrink-0 text-blue-700" />
                                            <span className="truncate">{t("terms")}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                {/* Contact Email Link */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="mailto:contact@gloneax.org" className="flex items-center gap-2 overflow-hidden">
                                            <Mail className="h-4 w-4 shrink-0 text-violet-700" />
                                            <span className="truncate">contact@gloneax.org</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                </div>
            </SidebarContent>

            {/* FOOTER - Copyright Info */}
            <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 p-3 group-data-[state=collapsed]:hidden overflow-hidden">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-hidden">
                    <Copyright className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{new Date().getFullYear()} gloneax.org. All rights reserved.</span>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;