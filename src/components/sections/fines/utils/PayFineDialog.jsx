"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormTextarea from "@/components/form/FormTextarea";
import FormWrapper from "@/components/form/FormWrapper";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { usePayFine } from "@/store/hooks/FineHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const PayFineSchema = z.object({
  paidAmount: z.string().min(1, "Amount is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  remarks: z.string().optional(),
});

const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
  { value: "UPI", label: "UPI" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Other", label: "Other" },
];

const PayFineDialog = ({ isOpen, onOpenChange, fineData }) => {
  const router = useRouter();
  const { mutateAsync: payFineApi } = usePayFine();
  const { control, handleSubmit, reset, setError, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(PayFineSchema),
    mode: "onSubmit",
    defaultValues: {
      paidAmount: fineData?.fineAmount?.toString() || "",
      paymentMethod: "",
      remarks: "",
    },
  });
  const { showSuccessToast, setFieldError } = useErrorHandler(setError);

  const onSubmit = async (data) => {
    try {
      const response = await payFineApi({
        fineId: fineData.fineId,
        paidAmount: parseFloat(data.paidAmount),
        paymentMethod: data.paymentMethod,
        remarks: data.remarks || null,
      });
      showSuccessToast(response.message);
      reset();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      setFieldError(error);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); else onOpenChange(open); }}>
      <DialogContent className="max-w-[95vw] md:max-w-md p-4 md:p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-semibold text-gray-900">Collect Fine</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fine of <span className="font-semibold text-gray-700">{fineData?.fineAmount?.toFixed(2)}</span> for <span className="font-medium">{fineData?.bookTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-2">
            <FormInput
              control={control}
              name="paidAmount"
              label="Amount Collected"
              placeholder="Enter amount"
              type="number"
              required
            />
            <FormSelect
              control={control}
              name="paymentMethod"
              label="Payment Method"
              placeholder="Select method"
              options={PAYMENT_METHODS}
              required
            />
            <FormTextarea
              control={control}
              name="remarks"
              label="Remarks"
              placeholder="Optional remarks"
              rows={2}
            />
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <ButtonWidget
              type="button"
              onClick={handleClose}
              variant="outline"
              className="h-10 px-8 border-[#D9D9D9] hover:bg-gray-50 rounded-sm"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="text-white font-bold h-10 px-8 rounded-sm shadow-md border-0 bg-[#00796B] hover:bg-[#00796B]/90"
            >
              {isSubmitting ? "Processing..." : "Collect Payment"}
            </ButtonWidget>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default PayFineDialog;
