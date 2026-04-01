const TermsOfServicePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Terms of Service</h1>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Bespoke Library Management System, you agree to comply with and be bound by
            these Terms of Service. If you do not agree with any part of these terms, please do not use the system.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Library Membership</h2>
          <p>
            Users must have a valid library membership to borrow books. Membership details including borrowing limits,
            loan periods, and renewal policies are governed by the policy assigned to your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Borrowing and Returns</h2>
          <p>
            Books must be returned by the due date. Late returns may incur fines as defined by the applicable library
            policy. Renewal of books is subject to availability and renewal limits set by your assigned policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Fines and Fees</h2>
          <p>
            Outstanding fines must be cleared before new books can be checked out. Fine amounts are calculated based
            on the number of overdue days and the fine-per-day rate defined in your policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Account Responsibility</h2>
          <p>
            You are responsible for all activity under your account. Please keep your login credentials secure and
            notify the library immediately if you suspect unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Changes to Terms</h2>
          <p>
            The library reserves the right to update these terms at any time. Continued use of the system after
            changes constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
