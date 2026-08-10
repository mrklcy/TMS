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

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const { viewMode } = useTask();
  const [currentTab, setCurrentTab] = useState(isAuthenticated ? 'dashboard' : 'landing');

  React.useEffect(() => {
    if (isAuthenticated) {
      setCurrentTab('dashboard');
    }
  }, [isAuthenticated]);

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <div className="app-layout-wrapper">
          {/* Vertical Sidebar Navigation */}
          <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

          {/* Main Dashboard Workspace Content */}
          <main className="main-workspace-content">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Task Management Workspace</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Track tasks, organize subtasks, and monitor completion metrics.
                </p>
              </div>
            </div>

            {/* Dashboard Analytics Bar */}
            <DashboardStats />

            {/* Filters & Control Bar */}
            <FilterBar />

            {/* View Mode Component (Kanban vs List) */}
            {viewMode === 'kanban' ? <KanbanBoard /> : <TaskList />}
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
