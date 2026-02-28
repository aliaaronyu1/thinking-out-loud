import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { BookOpen, PenLine, Inbox, Newspaper } from "lucide-react";
import { Button } from "./ui/button";

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/10">
        <AppSidebar currentPath={location} />
        <div className="flex-1 flex flex-col w-full h-screen overflow-hidden">
          <header className="flex items-center h-14 px-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10 shrink-0 md:hidden">
            <SidebarTrigger />
            <span className="ml-4 font-serif font-medium text-sm">Thinking Out Loud</span>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar({ currentPath }: { currentPath: string }) {
  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="px-6 py-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-xl font-semibold tracking-tight">Thinking Out Loud</h2>
          <p className="text-xs text-muted-foreground font-medium">Personal Knowledge Blog</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-4 mb-6">
              <Button asChild className="w-full justify-start gap-2 shadow-none rounded-xl" variant="default">
                <Link href="/new">
                  <PenLine className="h-4 w-4" />
                  Write Something
                </Link>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs tracking-wider uppercase text-muted-foreground px-6 font-semibold">
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="px-3 gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={currentPath === "/"} className="rounded-xl px-3 py-5 transition-all">
                  <Link href="/">
                    <BookOpen className="h-4 w-4 opacity-70" />
                    <span className="font-medium">All Entries</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={currentPath === "/drafts"} className="rounded-xl px-3 py-5 transition-all">
                  <Link href="/drafts">
                    <Inbox className="h-4 w-4 opacity-70" />
                    <span className="font-medium">Drafts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={currentPath === "/news"} className="rounded-xl px-3 py-5 transition-all">
                  <Link href="/news">
                    <Newspaper className="h-4 w-4 opacity-70" />
                    <span className="font-medium">Free News</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
