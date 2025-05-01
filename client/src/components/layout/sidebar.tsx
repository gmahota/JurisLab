import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  BookOpenText, 
  FileText, 
  Brain, 
  Bookmark, 
  History,
  Settings,
  ChevronDown
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const [selectedSection, setSelectedSection] = useState<'judicial' | 'contracts'>('judicial');
  
  // Get the current path to determine which nav item is active
  const currentPath = location === '/' ? '/' : `/${location.split('/')[1]}`;
  
  // Categories for Judicial Decisions
  const judicialCategories = [
    "Labor Law",
    "Constitutional Law",
    "Administrative Law",
    "Civil Law",
    "Criminal Law"
  ];
  
  // Categories for Labor Contracts
  const contractCategories = [
    "Employment Contracts",
    "Consultancy Agreements",
    "Termination Agreements",
    "Non-Disclosure Agreements",
    "Collective Agreements"
  ];

  return (
    <aside
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 shadow-lg flex flex-col h-full",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center">
        <div className="w-10 h-10 bg-primary-800 rounded-md flex items-center justify-center text-white mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scale"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">JurisLab</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Legal Intelligence Platform</p>
        </div>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 pt-5 px-4">
        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-2">Main</h2>
          
          <NavLink href="/" icon={<LayoutDashboard className="h-5 w-5" />} currentPath={currentPath}>
            Dashboard
          </NavLink>
          
          <NavLink 
            href="/judicial-decisions" 
            icon={<BookOpenText className="h-5 w-5" />} 
            currentPath={currentPath}
            onClick={() => setSelectedSection('judicial')}
          >
            Judicial Decisions
          </NavLink>
          
          <NavLink 
            href="/labor-contracts" 
            icon={<FileText className="h-5 w-5" />} 
            currentPath={currentPath}
            onClick={() => setSelectedSection('contracts')}
          >
            Labor Contracts
          </NavLink>
          
          <NavLink href="/ai-insights" icon={<Brain className="h-5 w-5" />} currentPath={currentPath}>
            AI Insights
          </NavLink>
          
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2">User</h2>
          
          <NavLink href="/favorites" icon={<Bookmark className="h-5 w-5" />} currentPath={currentPath}>
            Favorites
          </NavLink>
          
          <NavLink href="/recent-activity" icon={<History className="h-5 w-5" />} currentPath={currentPath}>
            Recent Activity
          </NavLink>
          
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2">Categories</h2>
          
          {selectedSection === 'judicial' ? (
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center w-full text-sm text-slate-600 dark:text-slate-400 hover:text-primary-800 dark:hover:text-primary-300 px-3 py-1">
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>Legal Topics</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-1 pl-3 text-sm">
                  {judicialCategories.map((category) => (
                    <a 
                      key={category}
                      href="#"
                      className="block px-3 py-1 text-slate-600 hover:text-primary-800 dark:text-slate-300 dark:hover:text-primary-300"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center w-full text-sm text-slate-600 dark:text-slate-400 hover:text-primary-800 dark:hover:text-primary-300 px-3 py-1">
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>Contract Types</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-1 pl-3 text-sm">
                  {contractCategories.map((category) => (
                    <a 
                      key={category}
                      href="#"
                      className="block px-3 py-1 text-slate-600 hover:text-primary-800 dark:text-slate-300 dark:hover:text-primary-300"
                    >
                      {category}
                    </a>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>
      
      {/* User profile */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Jane Doe</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Legal Analyst</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  currentPath: string;
  onClick?: () => void;
}

function NavLink({ href, icon, children, currentPath, onClick }: NavLinkProps) {
  const isActive = currentPath === href;
  
  return (
    <Link href={href}>
      <a
        onClick={onClick}
        className={cn(
          "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-primary-50 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        )}
      >
        <span className="mr-3">{icon}</span>
        {children}
      </a>
    </Link>
  );
}
