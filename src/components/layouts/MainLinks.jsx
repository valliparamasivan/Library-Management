"use client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";

const MainLinks = ({ items }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const [openItem, setOpenItem] = useState(null);

  const isActive = (url) => {
    if (url === pathname) return true;
    if (url === "/" && pathname === "/") return true;
    if (url !== "/" && pathname.startsWith(url)) return true;
    return false;
  };

  const hasActiveSubItem = (subItems) => {
    return subItems?.some((subItem) => isActive(subItem.url)) || false;
  };

  const handleToggle = (itemTitle) => {
    setOpenItem(openItem === itemTitle ? null : itemTitle);
  };

  const handleParentClick = (item) => {
    if (isMobile) {
      handleToggle(item.title);
    } else {
      if (item.items && item.items.length > 0) {
        router.push(item.items[0].url);
      }
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  useEffect(() => {
    const activeItem = items.find((item) => item.items && hasActiveSubItem(item.items));

    if (activeItem) {
      setOpenItem(activeItem.title);
    } else if (pathname.includes("/assets/asset-details/")) {
      setOpenItem("Assets");
    } else {
      setOpenItem(null);
    }
  }, [pathname, items]);

  return (
    <SidebarGroup>
      <SidebarMenu className="px-3 group-data-[collapsible=icon]:px-0">
        {items.map((item) => {
          if (item.isStandalone) {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                  <Link href={item.url} onClick={handleLinkClick}>
                    {item.icon && <item.icon className={`mr-0.5 ${active ? '!text-white' : 'text-[#00796B]'}`} />}
                    <span className={active ? '!text-white' : 'text-[#807F94]'}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          const hasActiveChild = hasActiveSubItem(item.items);
          return (
            <Collapsible key={item.title} asChild open={openItem === item.title} onOpenChange={() => handleToggle(item.title)} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={hasActiveChild}
                    className="group-data-[state=open]/collapsible:bg-sidebar-accent group-data-[state=open]/collapsible:text-sidebar-accent-foreground"
                    onClick={() => handleParentClick(item)}
                  >
                    {item.icon && <item.icon className={`mr-0.5 ${hasActiveChild ? '!text-white' : 'text-[#00796B]'}`} />}
                    <span className={hasActiveChild ? '!text-white' : 'text-[#807F94]'}>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const subActive = isActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title} isActive={subActive}>
                          <SidebarMenuSubButton asChild isActive={subActive} className="hover:bg-sidebar-accent" tooltip={subItem.title}>
                            <Link href={subItem.url} onClick={handleLinkClick}>
                              <span className="ml-0.5">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
export default MainLinks;
