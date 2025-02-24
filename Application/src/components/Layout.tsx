import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users, BookCopy, Calendar } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { to: '/', icon: BookOpen, label: 'Dashboard' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/books', icon: BookCopy, label: 'Books' },
    { to: '/issuances', icon: Calendar, label: 'Issuances' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 h-screen w-64 bg-card border-r border-border p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-primary">LibraryMS</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </Button>
        </div>
        <div className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}

export default Layout;