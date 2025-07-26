import * as React from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Handshake,
  Inbox,
} from "lucide-react";

import { NavUser } from "../nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/store";
import { getUserChatsThunk } from "@/store/chats/user-chats-slice";
import ChatItem from "./chat-item";
import ChatsLoader from "./chats-loader";

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Work",
      url: "#",
      icon: BriefcaseBusiness,
      isActive: true,
    },
    {
      title: "Friends",
      url: "#",
      icon: Handshake,
      isActive: true,
    },
    {
      title: "Events",
      url: "/events",
      icon: CalendarDays,
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useAppDispatch();
  const { setOpen } = useSidebar();

  React.useEffect(() => {
    dispatch(getUserChatsThunk());
  }, [dispatch, setOpen]);

  const { chats, isLoading } = useAppSelector((state) => state.userChats);
  console.log("chats :>> ", chats);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <img src="/connectly-logo.png" alt="Connectly Logo" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      // onClick={() => {
                      //   setActiveItem(item);
                      //   const mail = data.mails.sort(() => Math.random() - 0.5);
                      //   setMails(
                      //     mail.slice(
                      //       0,
                      //       Math.max(5, Math.floor(Math.random() * 10) + 1)
                      //     )
                      //   );
                      //   setOpen(true);
                      // }}
                      // isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">Title</div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unread</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {isLoading ? (
                <ChatsLoader />
              ) : (
                chats.map((chat) => <ChatItem key={chat._id} chat={chat} />)
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
