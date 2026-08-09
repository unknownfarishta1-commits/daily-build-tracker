"use client";

import * as React from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Home,
  FileText,
  Calendar,
  BarChart2,
  Trophy,
  Medal,
  User,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAppState, deriveStudent } from "@/lib/challenge-state";
import { toast } from "sonner";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
}

const navItems = (currentDay: number, handleNavAction: (label: string) => void): NavItem[] => [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Today's Build", icon: FileText, href: `/day/${currentDay}` },
  { label: "My Calendar", icon: Calendar, href: "/dashboard#calendar" },
  { label: "My Progress", icon: BarChart2, href: "/dashboard#progress" },
  { label: "Achievements", icon: Trophy, href: "/dashboard#achievements" },
  { label: "Leaderboard", icon: Medal, href: "/dashboard#leaderboard" },
  { label: "Profile", icon: User, href: "/profile" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state, hydrated, logout } = useAppState();
  const student = deriveStudent(state);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && !state.isLoggedIn) {
      navigate({ to: "/login" });
    }
  }, [hydrated, state.isLoggedIn, navigate]);

  const handleNavAction = (label: string) => {
    toast.info(`${label}`, {
      description: "This section is under construction. Check back soon!",
    });
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const handleBellClick = () => {
    toast("🔔 No new notifications", {
      description: "You're all caught up! Your streak is still going strong.",
    });
  };

  if (!hydrated || !state.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const items = navItems(student.currentDay, handleNavAction);

  const sidebarContent = (
    <div className="flex h-full flex-col gap-4 py-6">
      <div className="px-6 mb-4 flex items-center gap-3">
        <Link to="/dashboard" className="bg-primary/20 p-2 rounded-xl border border-primary/20 hover:bg-primary/30 transition-colors">
          <Logo className="h-5" />
        </Link>
        <span className="font-display font-bold text-lg tracking-tight">Tracker</span>
      </div>
      <nav className="flex-1 space-y-1.5 px-3">
        {items.map((item) => {
          const currentPath = location.pathname + location.hash;
          const isActive =
            (item.href &&
              (currentPath === item.href ||
                (item.label === "Dashboard" && location.pathname === "/dashboard" && !location.hash))) ||
            (item.label === "Today's Build" && location.pathname.startsWith("/day/"));
          const baseClass = cn(
            "group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-left cursor-pointer",
            isActive
              ? "bg-primary/15 text-primary shadow-sm shadow-primary/10"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-[0.98]"
          );
          const iconClass = cn(
            "mr-3 h-5 w-5",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          );

          if (item.href) {
            return (
              <Link key={item.label} to={item.href as any} className={baseClass}>
                <item.icon className={iconClass} />
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={baseClass}
            >
              <item.icon className={iconClass} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto px-3">
        <Button
          variant="ghost"
          type="button"
          className="w-full justify-start rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive active:scale-[0.98]"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0a0b] text-foreground font-sans antialiased selection:bg-primary/30">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-border/40 bg-[#0d0d0f]/80 backdrop-blur-xl lg:block sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-[#0d0d0f]/80 px-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" type="button" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-[#0d0d0f] border-r-border/40">
                {sidebarContent}
              </SheetContent>
            </Sheet>
            <Link to="/dashboard">
              <Logo className="h-5" />
            </Link>
          </div>

          <div className="hidden flex-1 max-w-md lg:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search anything..."
                className="pl-10 bg-secondary/50 border-border/40 focus:bg-secondary focus:border-primary/50 transition-all rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl hover:bg-secondary transition-colors"
              onClick={handleBellClick}
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-[#0d0d0f]" />
            </Button>
            
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/40">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-foreground leading-tight">{student.displayName}</p>
                <p className="text-xs text-muted-foreground leading-tight">{student.track || "Student"}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer rounded-xl">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{student.initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#0d0d0f] border-border/40 rounded-xl">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate({ to: "/profile" })}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border/40">
          <div className="container mx-auto p-4 lg:p-8 max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
