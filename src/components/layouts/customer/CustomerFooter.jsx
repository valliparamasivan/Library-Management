import Link from "next/link";

const CustomerFooter = () => {
  return (
    <footer className="bg-[#0B1723] text-white border-t border-white/20">
      <div className="mx-auto px-4 py-8">
        <div className="text-center">
          <h3 className="text-white font-semibold text-base mb-4">Quick Links</h3>
          <ul className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <Link href="/TermsofService" className="text-white hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <Link href="/catalog" className="text-white hover:text-gray-300 transition-colors">
                Browse Catalog
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <Link href="/privacy-policy" className="text-white hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
