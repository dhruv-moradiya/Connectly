import { AppSidebar } from "@/components/chat-sidebar/app-sidebar";
import FriendRequestsDialog from "@/components/layout/friend-requests-dialog";
import GroupChatForm from "@/components/layout/group-chat-form/group-chat-form";
import SearchUsers from "@/components/layout/search-users";
import SocketConnection from "@/components/layout/socket-connection";
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
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleTheme } from "@/store/theme/theme-slice";
import { Bell, Moon, Sun } from "lucide-react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);
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
        <header className="bg-background sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b p-2">
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

            <Button
              variant={"ghost"}
              size={"icon"}
              className="size-7"
              onClick={() => {
                dispatch(toggleTheme());
              }}
            >
              {theme === "light" ? <Sun /> : <Moon />}
            </Button>

            <SocketConnection />
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
