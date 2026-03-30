"use client";

import { LoginModal } from '@/components/sections/customer/utils/LoginModal';
import { NotificationDropdown } from '@/components/sections/customer/notification/utils/NotificationDropdown';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BookOpen, Home, LayoutGrid, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useCustomerProfileDetails } from '@/store/customerHooks/AuthHooks';

const CustomerHeader = ({ variant = 'logged-out' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && session?.user?.role === "User";
  const isChangePasswordPage = pathname === '/change-password';

  const { data: profileResponse } = useCustomerProfileDetails({
    enabled: !!isAuthenticated,
  });
  const profileDetails = profileResponse?.data?.data || profileResponse?.data || profileResponse || {};
  const userName = profileDetails?.profile?.userName || '';
  const email = profileDetails?.profile?.email || '';
  const initial = userName.charAt(0).toUpperCase() || 'P';
  const profileImgUrl = profileDetails?.profile?.profileImgUrl;

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('data:') || image.startsWith('http')) return image;
    const cleanImage = image.replace(/^\/?uploads\/profile\//, '').replace(/^\//, '');
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/profile-image/${cleanImage}` : image;
  };

  const finalImage = getImageUrl(profileImgUrl);

  const currentPage = pathname === '/home' ? 'home' :
    (pathname === '/catalog' || pathname.startsWith('/catalog/')) ? 'catalog' :
      (pathname === '/customer-catalog' || pathname.startsWith('/customer-catalog/')) ? 'catalog' :
        (pathname === '/dashboard' || pathname === '/customer-dashboard' || pathname.startsWith('/customer-dashboard/')) ? 'dashboard' :
          pathname === '/customer-profile' ? 'customer-profile' :
            pathname === '/notification' ? 'notification' : 'home';

  const handleNavigation = (page) => {
    const routes = {
      'home': '/home',
      'catalog': isAuthenticated ? '/customer-catalog' : '/catalog',
      'dashboard': '/customer-dashboard',
      'customer-profile': '/customer-profile',
      'login': '/sign-in',
      'notification': '/notification',
    };

    if (routes[page]) {
      router.push(routes[page]);
    }
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleProfileNavigation = (page) => {
    handleNavigation(page);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/home",
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-[var(--shadow-sm)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
            <button
              onClick={() => handleNavigation(isAuthenticated ? 'dashboard' : 'home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#0B63CE] rounded-full flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                <span className="text-white font-bold text-base sm:text-lg md:text-xl">L</span>
              </div>
              <span className="font-bold text-base sm:text-lg md:text-xl text-foreground hidden sm:block">Library</span>
            </button>
          </div>

          {!isChangePasswordPage && (
            <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigation('dashboard')}
                    className={`flex items-center gap-2 transition-colors font-medium cursor-pointer ${currentPage === 'dashboard'
                        ? 'text-[#0B63CE]'
                        : 'text-foreground hover:text-[#0B63CE]'
                      }`}
                  >
                    <LayoutGrid size={18} className={currentPage === 'dashboard' ? 'text-[#0B63CE]' : 'text-foreground'} />
                    My Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigation('catalog')}
                    className={`flex items-center gap-2 transition-colors font-medium cursor-pointer ${currentPage === 'catalog'
                        ? 'text-[#0B63CE]'
                        : 'text-foreground hover:text-[#0B63CE]'
                      }`}
                  >
                    <BookOpen size={18} className={currentPage === 'catalog' ? 'text-[#0B63CE]' : 'text-foreground'} />
                    Catalog
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('home')}
                    className={`flex items-center gap-2 transition-colors font-medium cursor-pointer ${currentPage === 'home'
                        ? 'text-[#0B63CE] border-b-2 border-[#0B63CE] pb-1'
                        : 'text-foreground hover:text-[#0B63CE]'
                      }`}
                  >
                    <Home size={18} className={currentPage === 'home' ? 'text-[#0B63CE]' : 'text-foreground'} />
                    Home
                  </button>
                  <button
                    onClick={() => handleNavigation('catalog')}
                    className={`flex items-center gap-2 transition-colors font-medium cursor-pointer ${currentPage === 'catalog'
                        ? 'text-[#0B63CE] border-b-2 border-[#0B63CE] pb-1'
                        : 'text-foreground hover:text-[#0B63CE]'
                      }`}
                  >
                    <BookOpen size={18} className={currentPage === 'catalog' ? 'text-[#0B63CE]' : 'text-foreground'} />
                    Catalog
                  </button>
                </>
              )}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {!isAuthenticated ? (
              <>
                {!isChangePasswordPage && (
                  <Button
                    variant="default"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-[#0B63CE] hover:bg-[#1565C0] text-white font-normal rounded-lg px-4 py-2 text-sm sm:text-sm min-w-[80px] sm:min-w-[120px]"
                  >
                    Login
                  </Button>
                )}
              </>
            ) : (
              <>
                <NotificationDropdown />

                <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                      aria-label="User menu"
                    >
                      <div className="w-8 h-8 bg-[#0B63CE] rounded-full flex items-center justify-center overflow-hidden">
                        {finalImage ? (
                          <img src={finalImage} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-sm font-semibold">{initial}</span>
                        )}
                      </div>
                      <span className="hidden md:block text-sm font-medium text-foreground">{userName}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-64 p-0 rounded-lg"
                    align="end"
                    sideOffset={8}
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold truncate">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => handleProfileNavigation('customer-profile')}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
                      >
                        Profile
                      </button>
                    </div>
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}

            {!isChangePasswordPage && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && !isChangePasswordPage && (
        <nav className="md:hidden border-t border-border bg-white shadow-[var(--shadow-sm)]" aria-label="Mobile navigation">
          <div className="px-4 py-4 space-y-1">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigation('dashboard')}
                  className={`flex w-full items-center gap-2 py-2.5 px-3 hover:bg-muted rounded-lg transition-colors font-medium cursor-pointer ${currentPage === 'dashboard'
                      ? 'text-[#0B63CE]'
                      : 'text-foreground hover:text-[#0B63CE]'
                    }`}
                >
                  <LayoutGrid size={18} className={currentPage === 'dashboard' ? 'text-[#0B63CE]' : 'text-foreground'} />
                  My Dashboard
                </button>
                <button
                  onClick={() => handleNavigation('catalog')}
                  className={`flex w-full items-center gap-2 py-2.5 px-3 hover:bg-muted rounded-lg transition-colors font-medium cursor-pointer ${currentPage === 'catalog'
                      ? 'text-[#0B63CE]'
                      : 'text-foreground hover:text-[#0B63CE]'
                    }`}
                >
                  <BookOpen size={18} className={currentPage === 'catalog' ? 'text-[#0B63CE]' : 'text-foreground'} />
                  Catalog
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('home')}
                  className={`flex w-full items-center gap-2 py-2.5 px-3 hover:bg-muted rounded-lg transition-colors font-medium cursor-pointer ${currentPage === 'home'
                      ? 'text-[#0B63CE]'
                      : 'text-foreground hover:text-[#0B63CE]'
                    }`}
                >
                  <Home size={18} className={currentPage === 'home' ? 'text-[#0B63CE]' : 'text-foreground'} />
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('catalog')}
                  className={`flex w-full items-center gap-2 py-2.5 px-3 hover:bg-muted rounded-lg transition-colors font-medium cursor-pointer ${currentPage === 'catalog'
                      ? 'text-[#0B63CE]'
                      : 'text-foreground hover:text-[#0B63CE]'
                    }`}
                >
                  <BookOpen size={18} className={currentPage === 'catalog' ? 'text-[#0B63CE]' : 'text-foreground'} />
                  Catalog
                </button>
              </>
            )}
          </div>
        </nav>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};

export default CustomerHeader;
