"use client";

import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormTextarea from "@/components/form/FormTextarea";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageUploadWidget from "@/components/widgets/ImageUploadWidget";
import { BookInventorySchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Plus, Minus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useBookCreate, useBookUpdate } from "@/store/hooks/InventoryHooks";
import LanguageDialog from "./LanguageDialog";
import CategoryDialog from "./CategoryDialog";
import BookTypeDialog from "./BookTypeDialog";

const InventoryDialog = ({ isOpen, onOpenChange, id, bookData, languages, bookCategories, bookTypes }) => {
  const router = useRouter();
  const isEditMode = !!id;
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isBookTypeDialogOpen, setIsBookTypeDialogOpen] = useState(false);
  const [bookCount, setBookCount] = useState(1);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const { control, handleSubmit, reset, setError, setValue, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(BookInventorySchema),
    mode: "onSubmit",
    defaultValues: {
      image: null,
      isbn: "",
      quantity: 1,
      title: "",
      author: "",
      subject: "",
      language: "",
      description: "",
      bookCategory: "",
      bookType: "",
      publisher: "",
      year: "",
    },
  });

  const { mutateAsync: createBook } = useBookCreate();
  const { mutateAsync: updateBook } = useBookUpdate();
  const { showSuccessToast, setFieldError } = useErrorHandler(setError);

  const handleIncrement = () => {
    setBookCount(bookCount + 1);
    setValue("quantity", bookCount + 1);
  };

  const handleDecrement = () => {
    if (bookCount > 1) {
      setBookCount(bookCount - 1);
      setValue("quantity", bookCount - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setBookCount("");
      setValue("quantity", "");
      return;
    }
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") {
      setBookCount("");
      setValue("quantity", "");
      return;
    }
    const numValue = parseInt(numericValue, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setBookCount(numValue);
      setValue("quantity", numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = typeof bookCount === 'string' ? parseInt(bookCount, 10) : bookCount;
    if (bookCount === "" || isNaN(numValue) || numValue < 1) {
      setBookCount(1);
      setValue("quantity", 1);
    } else {
      // Ensure it's a number
      setBookCount(numValue);
      setValue("quantity", numValue);
    }
  };

  const handleKeyDown = (e) => {
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        (e.keyCode >= 35 && e.keyCode <= 40)) {
      return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      formData.append("bookCategoryId", data.bookCategory || "");
      formData.append("bookId", isEditMode ? (id) : 0);
      const quantityValue = bookCount && bookCount > 0 ? Number(bookCount) : 1;
      formData.append("quantity", quantityValue);
      formData.append("author", data.author || "");
      formData.append("subject", data.subject || "");
      formData.append("isbn", data.isbn || "");
      formData.append("title", data.title || "");
      formData.append("language", data.language || "");
      formData.append("publisher", data.publisher || "");
      formData.append("description", data.description || "");
      formData.append("year", data.year || "");
      formData.append("bookTypeId", data.bookType || "");
      
      if (data.image && data.image instanceof File) {
        formData.append("bookImage", data.image);
      }
      
      const response = isEditMode
        ? await updateBook(formData)
        : await createBook(formData);
      
      showSuccessToast(response.message);
      handleCancel();
      router.refresh();
    } catch (error) {
      setFieldError(error);
    }
  };

  const handleCancel = () => {
    reset();
    setExistingImageUrl(null);
    onOpenChange(false);
  };

  const handleOpenChangeInternal = (open) => {
    onOpenChange(open);
    if (!open) {
      reset();
      setExistingImageUrl(null);
    }
  };

  const handleAddItemSuccess = () => {
    router.refresh();
  };

  const languageOptions = languages?.data?.map((item) => ({
    value: item.language,
    label: item.language,
  })) || [];

  const bookCategoryOptions = bookCategories?.data?.map((item) => ({
    value: String(item.bookCategoryId),
    label: item.category,
  })) || [];

  const bookTypeOptions = bookTypes?.data?.map((item) => ({
    value: String(item.bookTypeId),
    label: item.type,
  })) || [];

  const dialogTitle = id ? "Edit Book Details" : "Add Book Details";
  const dialogDescription = id ? "Edit Book Details" : "Add Book Details";
  useEffect(() => {
    if (isOpen && bookData) {
      const quantityValue = bookData.quantity || bookData.totalCopies || 1;
      setBookCount(quantityValue);

      if (bookData.bookImageUrl || bookData.imageUrl) {
        const imageUrl = bookData.bookImageUrl || bookData.imageUrl;
        const fullImageUrl = `https://libraryapi.corpfield.com/books-image/${imageUrl}`;
        setExistingImageUrl(fullImageUrl);
      } else {
        setExistingImageUrl(null);
      }

      reset({
        image: null, 
        isbn: bookData.isbn || "",
        quantity: quantityValue,
        title: bookData.title || "",
        author: bookData.author || "",
        subject: bookData.subject || "",
        language: bookData.language || "",
        description: bookData.description || "",
        bookCategory: bookData.bookCategoryId ? String(bookData.bookCategoryId) : "",
        bookType: bookData.bookTypeId ? String(bookData.bookTypeId) : "",
        publisher: bookData.publisher || "",
        year: bookData.year || bookData.yearPublished || "",
      });
    } else if (isOpen && !id) {
      setBookCount(1);
      setExistingImageUrl(null);
      reset({
        image: null,
        isbn: "",
        quantity: 1,
        title: "",
        author: "",
        subject: "",
        language: "",
        description: "",
        bookCategory: "",
        bookType: "",
        publisher: "",
        year: "",
      });
    }
  }, [isOpen, id, bookData, languages, reset]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[95vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader className="flex flex-col justify-between border-b pb-0 md:pb-0">
            <DialogTitle className="text-base md:text-lg font-semibold text-gray-900">{dialogTitle}</DialogTitle>
            <DialogDescription className="sr-only">{dialogDescription}</DialogDescription>
          </DialogHeader>

          <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4 md:gap-8">

            <div className="col-span-12 md:col-span-4 space-y-4 md:space-y-3">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-2">Book Cover</h3>
              <div>
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ImageUploadWidget
                      name="book-image"
                      label="Upload Book Image"
                      accept="image/jpg,image/jpeg,image/png,image/svg"
                      onFileChange={onChange}
                      selectedFile={value || existingImageUrl}
                      height="h-48 md:h-64"
                      width="w-full"
                      text="Click to upload or drag and drop"
                      description="Only support .jpg, .png and .svg"
                      error={error?.message}
                    />
                  )}
                />
              </div>
              <div>
                <FormInput
                  control={control}
                  name="isbn"
                  label="ISBN"
                  placeholder="Enter ISBN Number"
                  required
                />
              </div>
              <div>
                <Label className="mb-2 text-sm font-medium text-gray-900">Book Count</Label>
                <div className="flex items-center border border-[#D9D9D9] rounded-sm bg-white h-12 sm:h-[44px]">
                            <button
                                type="button"
                                onClick={handleDecrement}
                                className="flex items-center justify-center w-12 sm:w-12 h-full border-r border-[#D9D9D9] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer rounded-l-sm touch-manipulation"
                            >
                                <Minus className="w-4 h-4 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                            <div className="flex-1 flex items-center justify-center h-full">
                                <input
                                    type="number"
                                    value={bookCount}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    onKeyDown={handleKeyDown}
                                    min="1"
                                    placeholder="Count"
                                    className="w-full text-center bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 text-base sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleIncrement}
                                className="flex items-center justify-center w-12 sm:w-12 h-full border-l border-[#D9D9D9] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer rounded-r-sm touch-manipulation"
                            >
                                <Plus className="w-4 h-4 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                        </div>
                        
              </div>
            </div>

            <div className="col-span-12 md:col-span-8">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-2">Book Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <FormInput control={control} name="title" label="Title" placeholder="Enter Title" required />
                  <FormInput control={control} name="author" label="Author" placeholder="Enter Author" required />
                  <FormInput control={control} name="subject" label="Subject" placeholder="Enter Subject" required />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="language" className="text-sm font-medium text-gray-900">
                        Language
                        <span className="text-red-600 ml-px">*</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => setIsLanguageDialogOpen(true)}
                        className="text-sm text-[#00796B] hover:text-[#00796B]/80 font-medium underline"
                      >
                        Add Language
                      </button>
                    </div>
                    <FormSelect
                      control={control}
                      name="language"
                      placeholder="Select Language"
                      options={languageOptions}
                      required
                    />
                  </div>
                  <FormTextarea
                    control={control}
                    name="description"
                    label="Description"
                    placeholder="Enter Description"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="bookCategory" className="text-sm font-medium text-gray-900">
                        Book Category
                        <span className="text-red-600 ml-px">*</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryDialogOpen(true)}
                        className="text-sm text-[#00796B] hover:text-[#00796B]/80 font-medium underline"
                      >
                        Add Category
                      </button>
                    </div>
                    <FormSelect
                      control={control}
                      name="bookCategory"
                      placeholder="Select Book Category"
                      options={bookCategoryOptions}
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="bookType" className="text-sm font-medium text-gray-900">
                        Book Type
                        <span className="text-red-600 ml-px">*</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => setIsBookTypeDialogOpen(true)}
                        className="text-sm text-[#00796B] hover:text-[#00796B]/80 font-medium underline"
                      >
                        Add Book Type
                      </button>
                    </div>
                    <FormSelect
                      control={control}
                      name="bookType"
                      placeholder="Select Book Type"
                      options={bookTypeOptions}
                      required
                    />
                  </div>
                  <FormInput
                    control={control}
                    name="publisher"
                    label="Publisher"
                    placeholder="Enter Publisher"
                    required
                  />
                  <FormInput control={control} name="year" label="Year" placeholder="Enter Year" required />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            <ButtonWidget
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="w-full sm:w-auto h-10 px-8 md:px-14 border-[#D9D9D9] hover:bg-gray-50 rounded-sm"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full sm:w-auto text-white font-bold h-10 px-8 md:px-14 rounded-sm shadow-md border-0 bg-[#00796B] hover:bg-[#00796B]/90"
            >
              {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update" : "Save")}
            </ButtonWidget>
          </div>
          </FormWrapper>
        </DialogContent>
      </Dialog>
      <LanguageDialog 
        isOpen={isLanguageDialogOpen} 
        onOpenChange={(open) => {
          setIsLanguageDialogOpen(open);
          if (!open) {
            handleAddItemSuccess();
          }
        }} 
      />
      <CategoryDialog 
        isOpen={isCategoryDialogOpen} 
        onOpenChange={(open) => {
          setIsCategoryDialogOpen(open);
          if (!open) {
            handleAddItemSuccess();
          }
        }} 
      />
      <BookTypeDialog 
        isOpen={isBookTypeDialogOpen} 
        onOpenChange={(open) => {
          setIsBookTypeDialogOpen(open);
          if (!open) {
            handleAddItemSuccess();
          }
        }} 
      />
    </>
  );
};

export default InventoryDialog;
