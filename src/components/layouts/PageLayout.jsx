import HeaderProfile from "@/components/layouts/HeaderProfile";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import NotificationIconWidget from "@/components/widgets/NotificationIconWidget";

const PageLayout = ({ breadcrumbs = [], children, showBreadcrumbs = true, noPadding = false }) => {
  return (
    <SidebarInset className="flex flex-col overflow-hidden">
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 transition-[width] ease-linear border-b bg-white">
        <div className="flex items-center gap-2 px-2">
          <SidebarTrigger className="md:hidden" />
          {showBreadcrumbs && (
            <Breadcrumb >
              <BreadcrumbList className="text-black">
                {breadcrumbs.map((crumb, index) => (
                  <div key={`${crumb.label}-${crumb.href || "page"}`} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href} className="ml-2 text-lg font-semibold text-black">
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="ml-2 text-lg font-semibold text-black">{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="px-4 flex items-center gap-3">
          <div className="flex items-center gap-3">
            {/* <NotificationIconWidget unreadCount={1} /> */}
            <HeaderProfile />
          </div>
        </div>
      </header>
      <div className={`flex-1 overflow-y-auto ${noPadding ? '' : 'px-4'}`}>{children}</div>
    </SidebarInset>
  );
};

export default PageLayout;
