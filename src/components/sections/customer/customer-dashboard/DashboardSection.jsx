"use client";

import { BookmarkCheck, BookOpen, Calendar, Clock, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import BorrowedBooksTab from './tabs/BorrowedBooksTab';
import FavoritesTab from './tabs/FavoritesTab';
import HistoryTab from './tabs/HistoryTab';
import OverviewTab from './tabs/OverviewTab';
import ReservedBooksTab from './tabs/ReservedBooksTab';
import { readingHistory } from './utils/dashboardData';
import DashboardNavigation from './utils/DashboardNavigation';
import { useCustomerProfileDetails } from '@/store/customerHooks/AuthHooks';

const CustomerDashboard = ({ currentPage = 'overview', response, overviewList, borrowedList, reservedList, historyList, favoritesList }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: profileDetails } = useCustomerProfileDetails();
  const profileData = profileDetails?.data?.data || profileDetails?.data || profileDetails || {};
  const userName = profileData?.profile?.userName || 'User';

  const responseData = response?.data || response || {};
  const [favorites, setFavorites] = useState(new Set(['1', '3', '5']));

  const reservedCountForStats = responseData?.reserved || 0;
  const favoritesCountForStats = responseData?.favorites || 0;
  const historyListCountForStats = responseData?.history || 0;

  const stats = [
    { label: 'Currently Borrowed', value: responseData?.currentlyBorrowed || 0, icon: BookOpen, color: 'text-[#0B63CE]', bgColor: 'bg-[#0B63CE]/10' },
    { label: 'Due This Week', value: responseData?.dueThisWeek || 0, icon: Clock, color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]/10' },
    { label: 'Overdue', value: responseData?.overdue || 0, icon: Calendar, color: 'text-[#D2483B]', bgColor: 'bg-[#D2483B]/10' },
    { label: 'Books Reserved', value: reservedCountForStats, icon: BookmarkCheck, color: 'text-[#00A884]', bgColor: 'bg-[#00A884]/10' },
    { label: 'Favorites', value: favoritesCountForStats, icon: Heart, color: 'text-[#D2483B]', bgColor: 'bg-[#D2483B]/10' },
  ];

  const toggleFavorite = (bookId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <main id="main-content" className="mx-auto px-4 md:px-6 lg:px-15 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            Welcome back{mounted ? (userName !== 'User' ? `, ${userName}` : '') : ''}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your library account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 md:mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg border border-border p-5 hover:border-foreground/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-md ${stat.bgColor} ${stat.color}`}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{stat.value}</div>
                <div className="text-[13px] text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <DashboardNavigation
          currentPage={currentPage}
          borrowedCount={responseData?.currentlyBorrowed || 0}
          reservedCount={reservedCountForStats}
          historyCount={historyListCountForStats}
          favoritesCount={favoritesCountForStats}
        />

        {/* Content based on currentPage */}
        {currentPage === 'overview' && (
          <OverviewTab favorites={favorites} toggleFavorite={toggleFavorite} overviewList={overviewList} />
        )}

        {currentPage === 'borrowed-books' && (
          <BorrowedBooksTab favorites={favorites} toggleFavorite={toggleFavorite} borrowedList={borrowedList} />
        )}

        {currentPage === 'reserved-books' && (
          <ReservedBooksTab favorites={favorites} toggleFavorite={toggleFavorite} reservedList={reservedList} />
        )}

        {currentPage === 'history' && (
          <HistoryTab favorites={favorites} toggleFavorite={toggleFavorite} historyList={historyList} />
        )}

        {currentPage === 'favorites' && (
          <FavoritesTab favorites={favorites} favoritesList={favoritesList} />
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
