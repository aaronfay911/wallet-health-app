

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Eye, CreditCard, BarChart3, Zap, User as UserIcon, Mail, BookOpen, Settings as SettingsIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User } from "@/api/entities";
import { Toaster } from "@/components/ui/toaster";

const navigationItems = [
  {
    title: "Analyzer",
    url: createPageUrl("Analyzer"),
    icon: Search,
  },
  {
    title: "Watchlist",
    url: createPageUrl("Watchlist"),
    icon: Eye,
  },
  {
    title: "Compare",
    url: createPageUrl("WalletComparison"),
    icon: BarChart3,
  },
  {
    title: "Instructions",
    url: createPageUrl("Instructions"),
    icon: BookOpen,
  },
  {
    title: "Plans and Pricing",
    url: createPageUrl("Pricing"),
    icon: CreditCard,
  },
];

const contactEmail = "your-email@your-domain.com";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.log("User not logged in");
        setUser(null);
      }
    };
    fetchUser();
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary: #00D4FF;
            --primary-dark: #0098CC;
            --primary-foreground: #000000;
            --background: #0B1426;
            --background-secondary: #1A2332;
            --surface: #243447;
            --text-primary: #FFFFFF;
            --text-secondary: #94A3B8;
            --success: #10B981;
            --warning: #F59E0B;
            --error: #EF4444;
            --glass: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
          }
          
          body {
            background: linear-gradient(135deg, #0B1426 0%, #1A2332 100%);
            color: var(--text-primary);
          }
          
          .glass-effect {
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #00D4FF 0%, #0098CC 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite alternate;
          }
          
          @keyframes pulse-glow {
            from { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
            to { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6); }
          }
          
          .crypto-pattern {
            background-image: 
              radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0, 212, 255, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(0, 212, 255, 0.02) 0%, transparent 50%);
          }

          .prose {
            line-height: 1.7;
          }
          .prose h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5em;
            margin-top: 2em;
            border-bottom: 1px solid var(--glass-border);
            padding-bottom: 0.5em;
          }
          .prose h3 {
            font-size: 1.25rem;
            margin-bottom: 1em;
            margin-top: 1.5em;
          }
          .prose p, .prose ul, .prose ol {
            margin-bottom: 1.25em;
          }
          .prose li {
            margin-bottom: 0.5em;
          }
        `}
      </style>
      
      <div className="min-h-screen flex w-full" style={{background: 'var(--background)'}}>
        <Sidebar className="border-r border-gray-800">
          <SidebarHeader className="border-b border-gray-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass-effect flex items-center justify-center animate-pulse-glow">
                <Zap className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="font-bold text-lg gradient-text">Wallet Watchdog</h2>
                <p className="text-xs text-gray-400">AI On-Chain Intelligence</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-3">
                Platform
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    // AdminSettings item removed per instructions, so this check is technically not needed for this list but kept for robustness.
                    // If any future adminOnly items are added, this check would filter them correctly.
                    if (item.adminOnly && user?.role !== 'admin') {
                        return null;
                    }
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`rounded-lg mb-1 transition-all duration-300 ${
                            isActive 
                              ? 'bg-[var(--primary)] text-black shadow-lg shadow-[var(--primary)]/25' 
                              : 'hover:bg-[var(--surface)] text-gray-300 hover:text-white'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      className={`rounded-lg mb-1 transition-all duration-300 hover:bg-[var(--surface)] text-gray-300 hover:text-white`}
                    >
                      <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 px-4 py-3">
                        <Mail className="w-5 h-5" />
                        <span className="font-medium">Contact</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-800 p-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full glass-effect flex items-center justify-center">
                {user ? (
                  <span className="text-sm font-bold gradient-text">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserIcon className="w-5 h-5 text-[var(--primary)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">
                  {user ? user.email : "Guest User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user ? (user.role === 'admin' ? "Administrator" : "Intelligence Analyst") : "Sign in to get started"}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen crypto-pattern min-w-0">
          <header className="bg-[var(--background-secondary)] border-b border-gray-800 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-[var(--surface)] p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold gradient-text">Wallet Watchdog</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
          
          <footer className="px-6 py-4 border-t border-gray-800 bg-[var(--background-secondary)]">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
              <p>&copy; {new Date().getFullYear()} Wallet Watchdog. All rights reserved.</p>
              <div className="flex gap-4">
                <Link to={createPageUrl("TermsOfService")} className="hover:text-[var(--primary)] transition-colors">Terms of Service</Link>
                <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-[var(--primary)] transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </footer>
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  );
}

