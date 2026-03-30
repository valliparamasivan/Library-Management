"use client";

import { useRouter } from 'nextjs-toploader/app';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { borrowedBooks } from '../utils/dashboardData';

const OverviewTab = ({ overviewList }) => {
  console.log(overviewList,"overviewList");
  const router = useRouter();

  const overdueBooks = borrowedBooks.filter(book => book.isOverdue);
  const dueBooks = borrowedBooks.filter(book => !book.isOverdue && book.daysUntilDue && book.daysUntilDue > 0 && book.daysUntilDue <= 7);

  return (
    <div className="space-y-4 md:space-y-6 mt-6">
      {/* Due Soon */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-semibold">Due Soon</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/customer-dashboard/borrowed-books')}
              className="text-xs md:text-sm"
            >
              View All
              <ArrowRight size={14} className="md:w-4 md:h-4 ml-1" />
            </Button>
          </div>
        </div>
        <div className="divide-y divide-border">
          {dueBooks.length > 0 ? (
            dueBooks.map((book) => (
              <div key={book.id} className="p-3 md:p-5">
                <div className="flex gap-3 md:gap-4">
                  <div className="relative w-12 h-16 md:w-14 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 48px, 56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg md:text-lg mb-2 truncate">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 truncate">{book.author}</p>
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 py-0.5 md:py-1 text-[#F59E0B] text-sm font-medium">
                        <Clock size={10} className="md:w-3 md:h-3" />
                        <span className="whitespace-nowrap">Due in {book.daysUntilDue} {book.daysUntilDue === 1 ? 'day' : 'days'}</span>
                      </span>
                      {book.renewalsLeft && book.renewalsLeft > 0 && (
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {book.renewalsLeft} renewals left
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/customer-catalog')}
                      className="w-full sm:w-auto py-4 font-semibold rounded-xl text-xs md:text-sm"
                    >
                      View Book Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-muted/50 rounded-full mb-3">
                <Clock size={20} className="md:w-6 md:h-6 text-muted-foreground" />
              </div>
              <p className="text-sm md:text-base text-muted-foreground">No books due this week</p>
            </div>
          )}
        </div>
      </div>

      {/* Overdue Books */}
      {overdueBooks.length > 0 ? (
        <div className="rounded-xl border-2 border-[#D2483B] bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-3">

          {/* HEADER */}
          <div className="px-4 md:px-6 py-5 md:py-5 bg-[#D2483B1A] border-b border-[#D2483B] col-span-full">
            <h2 className="font-semibold text-sm md:text-base text-[#D2483B] flex items-center gap-2">
              <AlertCircle size={18} />
              <span>Overdue Books - Action Required</span>
            </h2>
          </div>

          {/* LEFT CONTENT */}
          <div className="divide-y divide-[#D2483B33] lg:col-span-2">
            {overdueBooks.map((book) => (
              <div key={book.id} className="p-3 md:p-5 bg-white">
                <div className="flex gap-3 md:gap-4">
                  <div className="relative w-12 h-16 md:w-14 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground pb-2 truncate">
                      {book.author}
                    </p>

                    <div className="inline-flex items-center w-full gap-1.5 px-2.5 py-2 bg-[#D2483B1A] border border-[#D2483B33] rounded-xl mb-2">
                      <AlertCircle size={14} className="text-[#D2483B]" />
                      <span className="text-sm font-medium text-[#D2483B]">
                        Fine: ₹{book.fine} • Please return at library counter
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Visit the library during operating hours (Mon–Sat: 9:00 AM – 8:00 PM)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      ) : (
        /* no overdue books */
        <div className="p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-muted/50 rounded-full mb-3">
            <AlertCircle size={20} className="md:w-6 md:h-6 text-muted-foreground" />
          </div>
          <p className="text-sm md:text-base text-muted-foreground">No overdue books</p>
        </div>
      )}

    </div>
  );
};

export default OverviewTab;
