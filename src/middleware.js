import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthenticated = !!token;
    const userRole = token?.role;
    const { pathname } = req.nextUrl;

    const publicCustomerRoutes = ["/home", "/TermsofService", "/privacy-policy"];
    const isPublicCustomerRoute = publicCustomerRoutes.some((route) =>
      pathname.startsWith(route),
    );

    const isCatalogListPage = pathname === "/catalog";
    const isCatalogDetailPage = pathname.startsWith("/catalog/") && pathname !== "/catalog";
    const isCatalogPage = isCatalogListPage || isCatalogDetailPage;

    const isChangePasswordPage = pathname === "/change-password" || pathname.startsWith("/change-password");

    const authPublicRoutes = ["/forgot-password", "/set-password"];
    const isAuthPublicRoute = authPublicRoutes.some((route) =>
      pathname.startsWith(route),
    );

    const isSignInRoute = pathname === "/sign-in" || pathname.startsWith("/sign-in");

    const isRootRoute = pathname === "/";

    const publicApiRoutes = ["/api/auth"];
    const isPublicApiRoute = publicApiRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (isSignInRoute) {
      return NextResponse.next();
    }

    if (isRootRoute) {
      return NextResponse.next();
    }

    if (isPublicApiRoute) {
      return NextResponse.next();
    }

    const isHomePage = pathname === "/home" || pathname === "/home/";
    if (isAuthenticated && isHomePage && userRole === "User") {
      return NextResponse.redirect(new URL("/customer-dashboard", req.url));
    }

    if (isAuthenticated && isHomePage && userRole !== "User") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (isPublicCustomerRoute) {
      return NextResponse.next();
    }

    if (isCatalogPage) {
      return NextResponse.next();
    }

    if (isChangePasswordPage) {
      return NextResponse.next();
    }

    if (isAuthenticated && isAuthPublicRoute) {
      if (userRole !== "User") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/customer-dashboard", req.url));
      }
    }

    if (!isAuthenticated && isPublicCustomerRoute) {
      return NextResponse.next();
    }

    if (!isAuthenticated && isAuthPublicRoute) {
      return NextResponse.next();
    }

    const adminRoutes = [
      "/dashboard",
      "/inventory",
      "/circulation",
      "/loans",
      "/fines",
      "/book-reviews",
      "/reserved-books",
      "/reports",
      "/settings",
      "/users",
      "/activitylog",
      "/profile",
    ];
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

    if (isAdminRoute) {
      if (!isAuthenticated) {
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
      }
      if (userRole === "User") {
        return NextResponse.redirect(new URL("/customer-dashboard", req.url));
      }
    }

    const customerProtectedRoutes = [
      "/customer-dashboard",
      "/customer-profile",
      "/notification",
    ];
    const isCustomerProtectedRoute = customerProtectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (isCustomerProtectedRoute && !isChangePasswordPage) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      if (userRole !== "User") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        const publicCustomerRoutes = ["/home", "/TermsofService", "/privacy-policy"];
        const isPublicCustomerRoute = publicCustomerRoutes.some((route) =>
          pathname.startsWith(route),
        );

        const isCatalogListPage = pathname === "/catalog";
        const isCatalogDetailPage = pathname.startsWith("/catalog/") && pathname !== "/catalog";
        const isCatalogPage = isCatalogListPage || isCatalogDetailPage;

        const isChangePasswordPage = pathname === "/change-password" || pathname.startsWith("/change-password");

        const authPublicRoutes = ["/sign-in", "/forgot-password", "/set-password"];
        const isAuthPublicRoute = authPublicRoutes.some((route) =>
          pathname.startsWith(route),
        );

        const isRootRoute = pathname === "/";

        const publicApiRoutes = ["/api/auth"];
        const isPublicApiRoute = publicApiRoutes.some((route) =>
          pathname.startsWith(route),
        );

        if (
          isPublicCustomerRoute ||
          isCatalogPage ||
          isChangePasswordPage ||
          isAuthPublicRoute ||
          isRootRoute ||
          isPublicApiRoute
        ) {
          return true;
        }

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
