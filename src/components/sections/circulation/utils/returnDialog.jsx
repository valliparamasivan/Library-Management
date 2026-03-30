"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import FormTextarea from "@/components/form/FormTextarea";
import { Globe, CircleArrowRight, X } from "lucide-react";
import { useForm } from "react-hook-form";
import user from '@/assets/image/user.png';
import book from '@/assets/image/book.png';

const ReturnDialog = ({ isOpen, onOpenChange, bookData, userData }) => {
  const { control, reset, getValues } = useForm({
    defaultValues: {
      remarks: "",
    },
  });

  const handleCancel = () => {
    reset({ remarks: "" });
    onOpenChange(false);
  };

  const handleReturn = () => {
    const formValues = getValues();
    console.log("Returning book with remarks:", formValues.remarks);
    reset({ remarks: "" });
    onOpenChange(false);
  };

  const defaultUserData = userData || {
    name: "Mark Smith",
    email: "marksmith@gmail.com",
    phone: "856 856 8569",
  };

  const defaultBookData = bookData || {
    title: "The Time Traveler",
    author: "Mark Smith",
    year: "2021",
    subtitle: "The Great Gatsby",
    language: "English",
    isbn: "ISBN9876543210987",
    rfid: "AHW2542B00124",
    category: "Science Fiction",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[95vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <DialogTitle className="text-lg font-semibold text-gray-900">Return Book</DialogTitle>

          <DialogDescription className="sr-only">Return Book</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-start gap-3 md:gap-4">
              <ImageWidget
                src={user}
                alt={defaultUserData.name}
                className="h-16 w-16 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-2">{defaultUserData.name}</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Email ID: {defaultUserData.email}</p>
                <p className="text-xs md:text-sm text-gray-600">Phone No: {defaultUserData.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
              <ImageWidget
                src={book}
                alt={defaultBookData.title}
                className="h-20 w-20 md:h-32 md:w-24 rounded-lg flex-shrink-0 object-cover"
              />
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1">{defaultBookData.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">by {defaultBookData.author} - {defaultBookData.year}</p>
                    <p className="text-xs md:text-sm font-medium text-gray-900 mb-2">{defaultBookData.subtitle}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Globe className="w-4 h-4 text-[#00796B]" />
                      <span>{defaultBookData.language}</span>
                    </div>
                  </div>
                  <div className="text-left mt-2 md:mt-0">
                    <p className="text-xs md:text-sm pb-3">
                      <span className="text-gray-500">ISBN </span>
                      <span className="text-gray-900 font-semibold">{defaultBookData.isbn}</span>
                    </p>
                    <p className="text-xs md:text-sm">
                      <span className="text-gray-500">RFID </span>
                      <span className="text-gray-900 font-semibold">{defaultBookData.rfid}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="inline-block bg-[#9CCC6533] text-[#00796B] px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                    {defaultBookData.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <FormTextarea
              control={control}
              name="remarks"
              label="Remarks"
              placeholder="Enter Remarks"
              rows={4}
              className="w-full bg-white border border-[#D9D9D9] rounded-sm px-4 py-2"
            />
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end md:gap-4 pt-4 border-t border-[#E2E8F0] bg-[hsl(210deg_40%_98.04%)] -mx-4 md:-mx-6 px-4 md:px-6">
            <ButtonWidget
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="w-full md:w-auto h-10 px-8 md:px-14 border-[#D9D9D9] hover:bg-gray-50 rounded-sm"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="button"
              onClick={handleReturn}
              className="w-full md:w-auto text-white font-bold h-10 px-8 md:px-14 rounded-sm shadow-md border-0 bg-[#00796B] hover:bg-[#00796B]/90 flex items-center justify-center gap-2"
            >
              <CircleArrowRight className="w-4 h-4" />
              Return Book
            </ButtonWidget>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnDialog;
