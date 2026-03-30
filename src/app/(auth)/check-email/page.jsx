import { Suspense } from "react";
import CheckEmailSection from "@/components/sections/auth/CheckEmailSection";

const CheckEmail = () => {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
            <CheckEmailSection />
        </Suspense>
    );
};

export default CheckEmail;
