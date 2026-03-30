"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import TooltipWidget from "@/components/widgets/TooltipWidget";

export const BookCard = ({ book}) => {
  const router = useRouter();
  const available = book.available || 3;
  const total = book.total || 5;
  
  const getImageUrl = () => {
    if (!book.image) {
      return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/books-image/${book.image}` : book.image;
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border h-full flex flex-col group">
      <div className="relative aspect-[6/6] overflow-hidden bg-muted">
        <Image
          src={getImageUrl()}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
          <div>
            <span className="inline-block px-3 py-2 bg-[#0B63CE26] text-[#0B63CE] rounded-xl text-xs font-medium">
              {book.category || "Uncategorized"}
            </span>
          </div>
        
        <div className="w-full max-w-[200px] sm:max-w-[260px] mb-0">
          <TooltipWidget content={book.title}>
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#0B63CE] transition-colors truncate">
              {book.title}
            </h3>
          </TooltipWidget>
        </div>
        
        <p className="text-sm text-gray-600">
          by {book.author}{book.year ? ` - ${book.year}` : ''}
        </p>
        
          <div>
            <p className="text-xs text-black pb-1">Subject Name</p>
            <div className="flex items-center gap-2 text-sm text-black">
              <Globe className="w-4 h-4 text-[#1976D2]" />
              <span>{book.language || "-"}</span>
            </div>
          </div>

        <div className="bg-[#00A8841A] border border-[#00A88433] rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-[#00A884] mb-1">
            {available} of {total} Available
          </p>
          <p className="text-xs text-[#00A884]">
            Ready to borrow
          </p>
        </div>
        
          <Button 
            variant="default" 
            className="w-full bg-[#0B63CE] hover:bg-[#1565C0] text-white font-semibold rounded-lg"
            onClick={() => router.push(`/catalog/${book.id}`)}
          >
            View Details
          </Button>
      </div>
    </div>
  );
};
