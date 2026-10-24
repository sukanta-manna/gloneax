/********************************************************************* 
Author: Sukanta Manna  
Purpose: Dashboard layout.
**********************************************************************/
import React, { useEffect, useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import Navbar from "@/components/Navbar"
import { ui } from "../i18n/ui";

type DashboardLayoutProps = {
  children: React.ReactNode,
  currentLang: keyof typeof ui;
  currentPath: string;
}

export default function DashboardLayout({ children, currentLang, currentPath }: DashboardLayoutProps) {
  const [open, setOpen] = useState<boolean>(true)

  useEffect(() => {
    const saved = localStorage.getItem("dashboard:sidebar:open")
    if (saved !== null) {
      setOpen(saved === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("dashboard:sidebar:open", String(open))
  }, [open])


  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar currentLang={currentLang} currentPath={currentPath}/>
        <div className="flex-1 flex flex-col h-full min-w-0 relative">
          <Navbar currentLang={currentLang} currentPath={currentPath}/>
          <main className="flex-1 w-full h-full min-h-0 relative overflow-hidden bg-slate-100 dark:bg-slate-900">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}