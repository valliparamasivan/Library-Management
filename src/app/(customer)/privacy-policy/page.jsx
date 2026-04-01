const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>
            We collect personal information necessary for library operations, including your name, email address,
            phone number, and borrowing history. This data is used solely for managing your library membership.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <p>
            Your information is used to manage book checkouts, returns, renewals, reservations, and to send
            notifications about due dates, overdue items, and account activity.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. Access to user data
            is restricted to authorized library staff based on their assigned roles and permissions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Data Retention</h2>
          <p>
            Your personal information and borrowing history are retained for the duration of your membership.
            Transaction records may be kept for reporting and audit purposes as required by library policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Your Rights</h2>
          <p>
            You may view and update your profile information through the system. For account deletion requests
            or data-related inquiries, please contact the library administration.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Changes to This Policy</h2>
          <p>
            This privacy policy may be updated periodically. Any changes will be reflected on this page.
            Continued use of the system constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
