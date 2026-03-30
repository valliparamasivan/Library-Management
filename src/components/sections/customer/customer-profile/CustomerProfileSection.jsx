"use client";

import FormInput from '@/components/form/FormInput';
import { Button } from '@/components/ui/button';
import BarcodeDisplay from '@/components/sections/inventory/inventory-details/rfid/utils/BarcodeDisplay';
import { Switch } from '@/components/ui/switch';
import { Award, Bell, CheckCircle, Mail, Phone, Save, Target, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCustomerProfileUpdate, useCustomerSetGoal } from '@/store/customerHooks/AuthHooks';

const CustomerProfileSection = ({ profileDetails }) => {
  console.log(profileDetails);
  const profileData = profileDetails?.data?.data || profileDetails?.data || profileDetails || {};
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [activeSection, setActiveSection] = useState('personal-info');
  const [showPolicyDetails, setShowPolicyDetails] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileInitials, setProfileInitials] = useState('PS');

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useCustomerProfileUpdate();
  const { mutate: setGoal, isPending: isSettingGoal } = useCustomerSetGoal();
  const fileInputRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Detect hash changes from URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validSections = ['personal-info', 'notifications', 'policy-info', 'reading-goals'];
      if (hash && validSections.includes(hash)) {
        setActiveSection(hash);
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auto-select section based on scroll position
  useEffect(() => {
    const sections = ['personal-info', 'notifications', 'policy-info', 'reading-goals'];

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      // Don't update if user is manually scrolling via navigation
      if (isScrollingRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sections.includes(sectionId)) {
            setActiveSection(sectionId);
            // Update URL hash without triggering scroll
            window.history.replaceState(null, '', `#${sectionId}`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  // Notification settings configuration
  const notificationChannels = [
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      checked: emailNotifications,
      onChange: setEmailNotifications,
    },
    {
      id: 'sms',
      title: 'SMS Notifications',
      description: 'Receive notifications via text message',
      checked: smsNotifications,
      onChange: setSmsNotifications,
    },
  ];


  // Form setup with react-hook-form
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      name: profileData?.profile?.userName || '',
      id: profileData?.profile?.uuid || '',
      email: profileData?.profile?.email || '',
      phone: profileData?.profile?.phoneNumber || '',
      readingGoal: profileData?.readingProgress?.goalBooks || 0,
    },
  });

  useEffect(() => {
    if (profileData?.profile) {
      if (profileData.profile.userName) setValue('name', profileData.profile.userName);
      if (profileData.profile.uuid) setValue('id', profileData.profile.uuid);
      if (profileData.profile.email) setValue('email', profileData.profile.email);
      if (profileData.profile.phoneNumber) setValue('phone', profileData.profile.phoneNumber);
    }
    if (profileData?.readingProgress?.goalBooks !== undefined) {
      setValue('readingGoal', profileData.readingProgress.goalBooks);
    }
  }, [profileData, setValue]);

  // Reading Goals
  const readingGoal = watch('readingGoal') || 0;
  const booksReadThisMonth = profileData?.readingProgress?.completedBooks || 0;
  const booksCompleted = profileData?.readingProgress?.completedBooks || 0;
  const avgDailyReading = 0;
  const avgReadingTime = 0;

  // Sidebar navigation items
  const navigationItems = [
    { id: 'personal-info', href: '#personal-info', icon: User, label: 'Personal Information' },
    // { id: 'notifications', href: '#notifications', icon: Bell, label: 'Notification Preferences' },
    { id: 'policy-info', href: '#policy-info', icon: Award, label: 'Privacy Information' },
    { id: 'reading-goals', href: '#reading-goals', icon: Target, label: 'Reading Goals' },
  ].map(item => ({
    ...item,
    isActive: activeSection === item.id
  }));

  const pSettings = profileData?.policySettings || {};
  const maxBooks = pSettings.maxBooksAllowed ?? 0;
  const loanPeriod = pSettings.loanPeriodDays ?? 0;
  const renewalLimit = pSettings.maxRenewalPerBook ?? 0;
  const finePerDay = pSettings.finePerDay ?? 0;
  const reservationLimit = pSettings.reservationLimit ?? '-';
  const reservationPeriod = pSettings.reservationHoldPeriodDays ?? '-';

  // Policy benefits cards data
  const policyBenefits = [
    { id: 'maxBooks', label: 'Max Borrow Limit', value: maxBooks, format: (val) => val },
    { id: 'loanPeriod', label: 'Loan Period', value: loanPeriod, format: (val) => val !== 0 ? `${val} days` : '0 days' },
    { id: 'renewalLimit', label: 'Renewal Limit', value: renewalLimit, format: (val) => `${val}x` },
    { id: 'finePerDay', label: 'Fine per day', value: finePerDay, format: (val) => `₹${val}` },
    { id: 'reservationLimit', label: 'Reservation Limit', value: reservationLimit, format: (val) => val },
    { id: 'reservationPeriod', label: 'Reservation Period', value: reservationPeriod, format: (val) => val },
  ];

  // Policy details data
  const policyDetails = [
    { id: 'memberType', heading: 'Member Type:', description: 'Member' },
    { id: 'policy', heading: 'Policy:', description: 'This policy is designed to provide borrowing privileges to all library members.' },
    { id: 'borrowing', heading: 'Borrowing:', description: `You can borrow up to ${maxBooks} items simultaneously for a period of ${loanPeriod} days. If a book is overdue, a fine of ₹${finePerDay} per day will be charged.` },
    { id: 'renewals', heading: 'Renewals:', description: `You can renew up to ${renewalLimit} times if no other user has reserved the item.` },
    { id: 'reservations', heading: 'Reservations:', description: `You can reserve up to ${reservationLimit || 'N/A'} items at a time. You will be notified when the reserved item becomes available.` },
    { id: 'fines', heading: 'Fines:', description: `Fines are levied at ₹${finePerDay} per day for overdue items. Please ensure to return items on time to avoid fines.` },
  ];

  // Reading statistics data (computed dynamically)
  const getReadingStats = () => [
    { id: 'completed', label: 'Books completed', value: booksCompleted },
    { id: 'daily', label: 'Avg. daily reading', value: avgDailyReading },
    { id: 'time', label: 'Avg. reading time', value: avgReadingTime },
  ];

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }
    if (image.startsWith('data:') || image.startsWith('http')) {
      return image;
    }

    const cleanImage = image.replace(/^\/?uploads\/profile\//, '').replace(/^\//, '');

    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/profile-image/${cleanImage}` : image;
  };

  const handleSaveChanges = (data) => {
    const payload = {
      userName: data.name,
      email: data.email,
      phoneNumber: data.phone,
    };
    if (profileImageFile) {
      payload.profileImgUrl = profileImageFile;
    }

    updateProfile(payload, {
      onSuccess: (data) => {
        toast.success(data?.message);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || 'Failed to update profile');
      }
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      return toast.error('Invalid file type. Please upload JPG, PNG or GIF.');
    }

    if (file.size > maxSize) {
      return toast.error('File size exceeds 2MB. Please choose a smaller file.');
    }

    setProfileImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      toast.success('Photo loaded successfully');
    };
    reader.onerror = () => toast.error('Error reading file. Please try again.');
    reader.readAsDataURL(file);
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveGoal = () => {
    const payload = {
      goal: readingGoal,
    };

    setGoal(payload, {
      onSuccess: (data) => {
        toast.success(data?.message);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || 'Failed to update reading goal');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <main id="main-content" className="mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, personalize your preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-border overflow-hidden sticky top-24">
              <nav aria-label="Profile navigation">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isLast = index === navigationItems.length - 1;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        isScrollingRef.current = true;
                        setActiveSection(item.id);
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Reset flag after scroll completes
                        setTimeout(() => {
                          isScrollingRef.current = false;
                        }, 1000);
                      }}
                      className={`flex items-center gap-3 px-6 py-4 ${!isLast ? 'border-b border-border' : ''} ${item.isActive ? 'bg-[#0B63CE]/10 text-[#0B63CE] font-medium' : 'hover:bg-muted transition-colors'}`}
                    >
                      <Icon size={20} className={item.isActive ? 'text-[#0B63CE]' : ''} />
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <section id="personal-info" className="bg-white rounded-lg border border-border p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form onSubmit={handleSubmit(handleSaveChanges)} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-[#0B63CE] rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
                      {getImageUrl(profileImage || profileData?.profile?.profileImgUrl) ? (
                        <img src={getImageUrl(profileImage || profileData?.profile?.profileImgUrl)} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        profileInitials
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        className="border-gray-300"
                        onClick={handleChangePhotoClick}
                      >
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground pt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <FormInput
                    name="name"
                    control={control}
                    label="Name"
                    type="text"
                    className="w-full bg-[#F6F7F9] border-none rounded-xl min-h-[44px] px-4"
                  />

                  <FormInput
                    name="email"
                    control={control}
                    label="Email Address"
                    type="email"
                    prefix={<Mail size={18} className="text-muted-foreground" />}
                    className="w-full bg-[#F6F7F9] border-none rounded-xl min-h-[44px] px-4"
                  />

                  <FormInput
                    name="phone"
                    control={control}
                    label="Phone Number"
                    type="tel"
                    prefix={<Phone size={18} className="text-muted-foreground" />}
                    className="w-full bg-[#F6F7F9] border-none rounded-xl min-h-[44px] px-4"
                  />

                  <div className="flex gap-3 justify-end pt-4">
                    <Button variant="outline" type="button" className="rounded-xl" onClick={() => reset()}>
                      Cancel
                    </Button>
                    <Button variant="default" type="submit" disabled={isUpdatingProfile} className="bg-[#0B63CE] hover:bg-[#0B63CE]/90 rounded-xl">
                      <Save size={18} />
                      {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>

                {/* LIBRARY CARD */}
                <div >
                  {/* Header */}
                  <div className="bg-gradient-to-br from-[#0B63CE] to-[#00A884] rounded-xl p-5 text-white flex flex-col">
                    <div className="text-xs font-medium uppercase tracking-wider mb-4 opacity-90">
                      LIBRARY CARD
                    </div>

                    {/* User Details */}
                    <div className="flex-1 space-y-3 mb-4">
                      <div className="text-2xl font-bold leading-tight">
                        {watch('name') || '-'}
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={16} className="opacity-90" />
                        <span className="opacity-95">{watch('email') || '-'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={16} className="opacity-90" />
                        <span className="opacity-95">{watch('phone') || '-'}</span>
                      </div>
                    </div>

                    {/* Barcode Section */}
                    <div className="bg-white rounded-lg p-4 flex flex-col items-center">
                      <div className="text-xs text-black font-semibold mb-3 uppercase tracking-wide">User ID</div>
                      <div className="w-full flex justify-center">
                        <BarcodeDisplay value={watch('id') || '-'} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Notifications */}
            {/* <section id="notifications" className="bg-white rounded-lg border border-border p-6 md:p-8">
              <h2 className="text-xl font-semibold pb-2">Notification Preferences</h2>
              <p className="text-muted-foreground pb-6">
                Control how you receive notifications.
              </p>

              <div className="space-y-4">
                {notificationChannels.map((channel) => (
                  <label key={channel.id} className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <div className="font-medium group-hover:text-[#0B63CE] transition-colors">
                        {channel.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {channel.description}
                      </div>
                    </div>
                    <Switch
                      className="data-[state=checked]:bg-[#0B63CE]"
                      checked={channel.checked}
                      onCheckedChange={channel.onChange}
                    />
                  </label>
                ))}
              </div>
            </section> */}

            {/* Policy Information */}
            <section id="policy-info" className="bg-white rounded-lg border border-border p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Policy Information</h2>

              {/* Policy Name Card */}
              <div className="mb-6 p-5 bg-[#0B63CE0D] rounded-xl border border-[#0B63CE33]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Policy Name</div>
                    <div className="text-xl font-bold text-[#0B63CE] mb-3">
                      Library Policy
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0B63CE]/10 text-[#0B63CE] rounded-full font-semibold text-sm">
                      <Award size={16} />
                      Member
                    </div>
                  </div>
                  <Award size={24} className="text-[#0B63CE]" />
                </div>
              </div>

              {/* Policy Rules & Benefits */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Policy Rules & Benefits</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {policyBenefits.map((benefit) => (
                    <div key={benefit.id} className="p-4 bg-[#F6F7F9] rounded-lg">
                      <div className="text-muted-foreground text-sm mb-1">{benefit.label}</div>
                      <div className="text-xl font-bold text-[#0B63CE]">
                        {benefit.format(benefit.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Details (Expandable) */}
              {showPolicyDetails && (
                <div className="p-5 bg-white rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <CheckCircle size={18} className="text-[#0B63CE]" />
                    Policy Details
                  </h3>
                  <div className="text-sm text-foreground space-y-3">
                    {policyDetails
                      .filter(detail => detail.condition !== false)
                      .map((detail) => (
                        <div key={detail.id}>
                          <div className="font-semibold mb-1">{detail.heading}</div>
                          <div className="text-muted-foreground">{detail.description}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </section>

            {/* Reading Goals */}
            <section id="reading-goals" className="bg-white rounded-lg border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle size={24} className="text-[#0B63CE]" />
                <h2 className="text-xl font-semibold mb-0">Reading Goals</h2>
              </div>

              <p className="text-muted-foreground mb-6">
                Set your personal reading goals and track your progress.
              </p>

              {/* Current Progress */}
              <div className="mb-8 p-6 bg-gradient-to-br from-[#0B63CE]/5 to-accent/5 rounded-xl border border-[#0B63CE]/20">
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Total reading in April: {booksReadThisMonth} / {readingGoal} books</div>
                  <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner mb-3">
                    <div
                      className="bg-gradient-to-r from-[#0B63CE] to-accent h-full transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min((booksReadThisMonth / readingGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You're {Math.round(((readingGoal - booksReadThisMonth) / readingGoal) * 100)}% away from your goal. Keep reading!
                </p>
              </div>

              {/* Adjust Reading Goal */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Adjust Reading Goal</h3>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 max-w-xs">
                    <FormInput
                      name="readingGoal"
                      control={control}
                      type="number"
                      className="w-full bg-[#F6F7F9] border-none rounded-xl min-h-[44px] px-4"
                    />
                  </div>
                  <Button
                    variant="default"
                    onClick={handleSaveGoal}
                    disabled={isSettingGoal}
                    className="bg-[#0B63CE] hover:bg-[#0B63CE]/90 rounded-xl"
                  >
                    <Save size={18} />
                    {isSettingGoal ? 'Saving...' : 'Save Goal'}
                  </Button>
                </div>
              </div>

              {/* Reading Statistics */}
              {/* <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4">Reading Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getReadingStats().map((stat) => (
                    <div key={stat.id} className="p-4 bg-[#F6F7F9] rounded-lg">
                      <div className="text-muted-foreground text-sm mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-[#0B63CE]">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div> */}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfileSection;
