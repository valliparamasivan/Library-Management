import ImageWidget from "@/components/widgets/ImageWidget";
import { Globe, CalendarDays, CircleArrowRight, X, RefreshCw } from "lucide-react";
import ButtonWidget from "@/components/widgets/ButtonWidget";

const BookCard = ({ 
    book, 
    status, 
    issuedDate, 
    dueDate, 
    fineAmount, 
    onRenew, 
    onReturn, 
    onCancelReserve,
    buttonLayout = "default" 
  }) => {
    const commonBookData = {
      title: book.title || "The Time Traveler",
      author: book.author || "Mark Smith",
      year: book.year || "2021",
      subtitle: book.subtitle || "The Great Gatsby",
      language: book.language || "English",
      isbn: book.isbn || "ISBN9876543210987",
      rfid: book.rfid || "AHW2542B00124",
      category: book.category || "Science Fiction",
    };
  
    return (
      <div className="bg-white rounded-xl p-3 md:p-5 shadow-sm border border-gray-200 relative">
        <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
          <ImageWidget
            src={book?.image || book}
            alt={commonBookData.title}
            className="h-20 w-20 md:h-28 md:w-28 rounded-lg flex-shrink-0"
          />
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h4 className={`${book.titleSize || "text-sm md:text-base"} font-semibold ${book.titleColor || "text-[#1A1A1A]"}`}>
                {commonBookData.title}
              </h4>
              <span className="inline-block bg-[#00796B26] text-[#00796B] px-2 md:px-3 py-1 rounded-full text-xs font-medium w-fit">
                {commonBookData.category}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#67667A] mb-1">by {commonBookData.author} - {commonBookData.year}</p>
            <p className="text-sm md:text-base font-medium text-[#1A1A1A] mb-2">{commonBookData.subtitle}</p>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <Globe className="w-3 h-3 md:w-4 md:h-4 text-[#00796B]" />
              <span>{commonBookData.language}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-[#00796B]" />
              <div className="text-xs md:text-sm">
                <span className="text-gray-600">Issued - </span>
                <span className="text-gray-900 font-semibold">{issuedDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-[#00796B]" />
              <div className="text-xs md:text-sm">
                <span className="text-gray-600">Due Date - </span>
                <span className="text-gray-900 font-semibold">{dueDate}</span>
              </div>
            </div>
            {fineAmount && (
              <div className="flex items-center gap-2">
                <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                <div className="text-xs md:text-sm text-red-600">
                  <span className="text-gray-600">Fine Amount - </span>
                  <span className="font-semibold">{fineAmount}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 md:gap-3">
            <div className="text-xs md:text-sm">
              <span className="text-[#758195]">ISBN:</span>
              <span className="text-[#1A1A1A] font-semibold ml-1 break-words">{commonBookData.isbn}</span>
            </div>
            <div className="text-xs md:text-sm">
              <span className="text-[#758195]">RFID:</span>
              <span className="text-[#1A1A1A] font-semibold ml-1 break-words">{commonBookData.rfid}</span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 md:gap-4">
            <div className={`px-3 md:px-4 py-2 rounded-lg w-fit ${status.className}`}>
              <span className="text-xs md:text-sm font-medium">{status.text}</span>
            </div>
  
            {buttonLayout === "column" ? (
              <div className="flex flex-col items-stretch md:items-end gap-2 w-full md:w-auto">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <ButtonWidget 
                    onClick={onRenew}
                    className="px-3 md:px-4 py-2 bg-[#FFFFFF] border border-[#00796B] text-[#00796B] hover:bg-green-200 rounded-sm text-xs md:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                    Renew
                  </ButtonWidget>
                  <ButtonWidget
                    onClick={onReturn}
                    className="px-3 md:px-4 py-2 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-sm text-xs md:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <CircleArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    Return
                  </ButtonWidget>
                </div>
              </div>
            ) : buttonLayout === "reserved" ? (
              <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                <ButtonWidget 
                  onClick={onCancelReserve}
                  className="px-3 md:px-4 py-2 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-lg text-xs md:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4" />
                  Cancel Reserve
                </ButtonWidget>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <ButtonWidget 
                  onClick={onRenew}
                  className="px-3 md:px-4 py-2 bg-[#FFFFFF] border border-[#00796B] text-[#00796B] hover:bg-green-200 rounded-sm text-xs md:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                  Renew
                </ButtonWidget>
                <ButtonWidget
                  onClick={onReturn}
                  className="px-3 md:px-4 py-2 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-sm text-xs md:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <CircleArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  Return
                </ButtonWidget>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default BookCard;