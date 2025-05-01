import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Bell, 
  Search
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { Notification } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open sidebar</span>
        </Button>
        
        {/* Search box */}
        <div className="flex-1 max-w-2xl mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="search"
              placeholder="Search documents, cases, or templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Theme toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <DropdownMenu open={notificationDropdownOpen} onOpenChange={setNotificationDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {notifications?.length === 0 ? (
                <div className="py-2 px-4 text-sm text-slate-600 dark:text-slate-400">
                  No notifications
                </div>
              ) : (
                notifications?.map((notification) => (
                  <DropdownMenuItem key={notification.id} className={cn(
                    "flex items-start py-2 px-4 cursor-pointer",
                    !notification.read && "bg-primary-50 dark:bg-primary-900/20"
                  )}>
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1"></div>}
                  </DropdownMenuItem>
                ))
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="#" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                  View all notifications
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User menu */}
          <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white text-sm font-medium">
                  JD
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Your Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
