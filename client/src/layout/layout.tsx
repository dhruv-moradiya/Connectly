import { AppSidebar } from "@/components/chat-sidebar/app-sidebar";
import FriendRequestsDialog from "@/components/friend-requests-dialog";
import GroupChatForm from "@/components/group-chat-form";
import SearchUsers from "@/components/search-users";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { Bell } from "lucide-react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { isConnected } = useAppSelector((state) => state.socket);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b p-4">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Inbox</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2">
            <GroupChatForm />
            <FriendRequestsDialog />
            <SearchUsers />

            <Button variant={"ghost"} size={"icon"} className="size-7">
              <Bell size={16} />
            </Button>

            <div
              className={cn(
                "size-2.5 rounded-full flex items-center justify-center",
                isConnected
                  ? "animate-pulse bg-green-600"
                  : "animate-none bg-red-600"
              )}
            />
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
