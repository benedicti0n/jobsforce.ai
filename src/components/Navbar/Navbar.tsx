"use client"

import { Menu, Wallet } from "lucide-react";
import Cookies from "js-cookie";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
// import { Button } from "../ui/Button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { logo, menu } from './navbarConfig'; // Importing logo and menu from the new config file

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

const Navbar1 = () => {
  const router = useRouter()

  const handleLogout = () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      Cookies.remove(cookieName);
    });
    window.location.href = "/login";
  };
  return (
    <section className="fixed w-full flex items-center justify-center z-70 ">
      <div className="w-full md:w-2/3 pt-6">
        <nav className="hidden justify-between items-center lg:flex gap-6">
          <div className="w-full flex items-center justify-between">
            <img src={logo.src} className="w-16 cursor-pointer" alt={logo.alt} onClick={() => router.push("/")} />
            <div className="bg-gradient-to-br from-[#FF8C32] via-[#EFBF04]/30 to-transparent rounded-xl p-0.5">
              <div className="flex items-center bg-black rounded-xl p-2">
                <NavigationMenu>
                  <NavigationMenuList className="gap-1">
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="flex justify-between items-center gap-4">
              <Wallet className="text-main w-8 h-8" />
              {!Cookies.get("userName") ? (
                <Button variant={"default"} onClick={() => router.push("/signup")}>
                  Sign Up
                </Button>
              ) : (
                <Button variant={"destructive"} onClick={handleLogout}>
                  Log Out
                </Button>
              )}
            </div>
          </div>

        </nav>


        <div className="flex lg:hidden fixed z-70 px-6 w-full">
          <div className="w-full flex items-center justify-between">
            <img src={logo.src} className="w-12 cursor-pointer" alt={logo.alt} onClick={() => router.push("/")} />
            <Sheet>
              <SheetTrigger>
                <div className="bg-gradient-to-br from-[#FF8C32] via-[#EFBF04]/30 to-transparent rounded-lg p-0.5">
                  <div className="bg-black p-3 rounded-lg">
                    <Menu className="size-4 text-white" />
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <img src={logo.src} className="w-12" alt={logo.alt} />
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  <div className="flex flex-col gap-3">
                    {/* button here */}
                    {!Cookies.get("userName") ? (
                      <Button variant={"default"} onClick={() => router.push("/signup")}>
                        Sign Up
                      </Button>
                    ) : (
                      <Button variant={"destructive"} onClick={handleLogout}>
                        Log Out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <a
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-main"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-bold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-secondary">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar1 };
