import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import PWABadge from './components/PWABadge';
import SplashScreen from './components/common/SplashScreen';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import BeveragesPage from './pages/BeveragesPage';
import LogDrinkPage from './pages/LogDrinkPage';
import ProfileAboutPage from './pages/ProfileAboutPage';
import LogDetail from './components/logs/LogDetail';
import BeverageDetail from './components/beverages/BeverageDetail';
import './App.css';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedBeverage, setSelectedBeverage] = useState(null);

  const handleSelectTab = (tab) => {
    setSelectedLog(null);
    setSelectedBeverage(null);
    setActiveTab(tab);
  };

  const handleSelectLog = (log) => {
    setSelectedBeverage(null);
    setSelectedLog(log);
  };

  const handleSelectBeverage = (bev) => {
    setSelectedLog(null);
    setSelectedBeverage(bev);
  };

  const renderContent = () => {
    if (selectedLog) {
      return (
        <LogDetail
          log={selectedLog}
          onBack={() => setSelectedLog(null)}
          onUpdated={(updated) => setSelectedLog(updated)}
        />
      );
    }

    if (selectedBeverage) {
      return (
        <BeverageDetail
          beverage={selectedBeverage}
          onBack={() => setSelectedBeverage(null)}
          onLogged={() => {
            setSelectedBeverage(null);
            setActiveTab('Dashboard');
          }}
        />
      );
    }

    switch (activeTab) {
      case 'History':
        return <HistoryPage onSelectLog={handleSelectLog} />;
      case 'LogDrink':
        return <LogDrinkPage onSuccess={() => handleSelectTab('Dashboard')} />;
      case 'Beverages':
        return <BeveragesPage onSelectBeverage={handleSelectBeverage} />;
      case 'Profile':
        return <ProfileAboutPage />;
      case 'Dashboard':
      default:
        return (
          <DashboardPage
            onSelectLog={handleSelectLog}
            onNavigate={handleSelectTab}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <Header
        onLogoClick={() => handleSelectTab('Dashboard')}
        onQuickAdd={() => handleSelectTab('LogDrink')}
      />

      <main className="app-main">{renderContent()}</main>

      <PWABadge />

      <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
    </div>
  );
}
