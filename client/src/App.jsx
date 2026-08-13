import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTask } from './context/TaskContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingHero } from './components/LandingHero';
import { LandingFeatures } from './components/LandingFeatures';
import { LandingWorkflow } from './components/LandingWorkflow';
import { LandingCTA } from './components/LandingCTA';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { DashboardStats } from './components/DashboardStats';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { ConfirmModal } from './components/ConfirmModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { AnalyticsView } from './components/AnalyticsView';
import { RecentActivityView } from './components/RecentActivityView';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { CalendarView } from './components/CalendarView';
import { ProjectsView } from './components/ProjectsView';
import { TeamView } from './components/TeamView';
import { FocusTimerView } from './components/FocusTimerView';
import { AICopilotModal } from './components/AICopilotModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { DashboardView } from './components/DashboardView';
import { exportTasksToCSV } from './utils/exportUtils';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const { viewMode, tasks } = useTask();
  const [currentTab, setCurrentTab] = useState(isAuthenticated ? 'dashboard' : 'landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      setCurrentTab('dashboard');
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const renderWorkspaceView = () => {
    switch (activeNav) {
      case 'calendar':
        return <CalendarView onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />;
      case 'projects':
        return <ProjectsView onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />;
      case 'team':
        return <TeamView onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />;
      case 'focustimer':
        return <FocusTimerView onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />;
      case 'analytics':
        return <AnalyticsView onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />;
      case 'recent':
        return <RecentActivityView onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />;
      case 'notifications':
        return <NotificationsView onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />;
      case 'settings':
        return <SettingsView onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />;
      case 'kanban':
      case 'list':
      case 'overview':
      default:
        return <DashboardView onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />;
    }
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <div className="app-layout-wrapper">
          {/* Vertical Sidebar Navigation */}
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            onOpenAICopilot={() => setIsCopilotOpen(true)}
            onOpenCmdPalette={() => setIsCmdPaletteOpen(true)}
          />

          {/* Main Dashboard Workspace Content */}
          <main
            className={`main-workspace-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
          >
            {renderWorkspaceView()}
          </main>
        </div>
      ) : (
        <>
          <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <main className="main-content">
            <LandingHero onExplore={() => setCurrentTab('dashboard')} />
            <LandingFeatures />
            <LandingWorkflow />
            <LandingCTA onExplore={() => setCurrentTab('dashboard')} />
          </main>
          <Footer />
        </>
      )}

      {/* Global Modals */}
      <AuthModal />
      <TaskModal />
      <ConfirmModal />
      <LogoutConfirmModal />
      <AICopilotModal isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
      <CommandPaletteModal
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        onSelectNav={(navId) => { setActiveNav(navId); setCurrentTab('dashboard'); }}
        onOpenAICopilot={() => setIsCopilotOpen(true)}
        onOpenFocusTimer={() => { setActiveNav('focustimer'); setCurrentTab('dashboard'); }}
        onOpenExport={() => exportTasksToCSV(tasks)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
}
