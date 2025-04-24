
import React, { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Briefcase, Users, CheckSquare, LayoutDashboard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNavBar from './BottomNavBar';

interface LayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    to: '/employees',
    icon: Users,
    label: 'Employees',
  },
  {
    to: '/projects',
    icon: Briefcase,
    label: 'Projects',
  },
  {
    to: '/tasks',
    icon: CheckSquare,
    label: 'Tasks',
  },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-slate-100 to-slate-200 w-full relative">
      {/* Sidebar: hidden on mobile */}
      {!isMobile && (
        <aside className="fixed top-0 bottom-0 left-0 w-64 bg-dashboard-blue text-white shadow-xl z-20 flex flex-col">
          <div className="p-6 border-b border-blue-700">
            <Link to="/" className="flex items-center space-x-3">
              <Briefcase size={28} />
              <span className="text-2xl font-bold tracking-wide font-sans">TaskMaster</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto pt-4">
            <ul className="space-y-1">
              {sidebarItems.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 transition-colors rounded-r-full ${
                        isActive
                          ? 'bg-white/10 font-bold border-l-4 border-white'
                          : 'hover:bg-blue-700 hover:border-l-4 hover:border-white'
                      }`
                    }
                  >
                    <Icon className="mr-3" size={20} />
                    <span className="text-base">{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          {/* Optional Footer */}
          <div className="p-4 border-t border-blue-700 text-sm opacity-70">
            &copy; {new Date().getFullYear()} TaskMaster
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-200 ${
          isMobile
            ? "w-full pt-2 pb-16" // pad for bottom nav
            : "ml-64 w-[calc(100%-16rem)] p-8"
        }`}
        style={!isMobile ? { minHeight: "100vh", overflowY: "auto" } : {}}
      >
        {/* Modern header on desktop */}
        {!isMobile && (
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-dashboard-blue tracking-tight font-sans">
              {document.title || 'Dashboard'}
            </h1>
            <div className="rounded-full bg-white/90 px-6 py-3 shadow flex items-center gap-3 font-medium">
              <span className="text-dashboard-blue">👋 Welcome back!</span>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>

      {/* Bottom Nav (mobile only) */}
      {isMobile && <BottomNavBar />}
    </div>
  );
};

export default Layout;
