"use client";

import {
  UsersIcon,
  FlagIcon,
  CalendarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronUpDownIcon,
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
  LifebuoyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { Avatar } from "@gbakws/ui";
import { Link } from "@gbakws/ui";
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@gbakws/ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarRail,
  SidebarSection,
  SidebarSectionGroup,
} from "@gbakws/ui";

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>,
) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link
          href="/docs/components/layouts/sidebar"
          className="flex items-center gap-x-2"
        >
          <Avatar
            isSquare
            size="sm"
            className="outline-hidden"
            src="https://design.intentui.com/logo?color=155DFC"
          />
          <SidebarLabel className="font-medium">
            Intent <span className="text-muted-fg">UI</span>
          </SidebarLabel>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSectionGroup>
          <SidebarSection label="Menu">
            <SidebarItem tooltip="Dashboard" href="/">
              <HomeIcon />
              <SidebarLabel>Dashboard</SidebarLabel>
            </SidebarItem>

            <SidebarItem tooltip="Members" href="/members">
              <UsersIcon />
              <SidebarLabel>Members</SidebarLabel>
            </SidebarItem>

            <SidebarItem tooltip="Causes" href="/causes">
              <FlagIcon />
              <SidebarLabel>Causes</SidebarLabel>
            </SidebarItem>

            <SidebarItem tooltip="Events" href="/events">
              <CalendarIcon />
              <SidebarLabel>Events</SidebarLabel>
            </SidebarItem>

            <SidebarItem tooltip="Testimonials" href="/testimonials">
              <StarIcon />
              <SidebarLabel>Testimonials</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarSectionGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-row justify-between gap-4 group-data-[state=collapsed]:flex-col">
        <Menu>
          <MenuTrigger
            className="flex w-full items-center justify-between"
            aria-label="Profile"
          >
            <div className="flex items-center gap-x-2">
              <Avatar
                className="size-8 *:size-8 group-data-[state=collapsed]:size-6 group-data-[state=collapsed]:*:size-6"
                isSquare
                src="https://intentui.com/images/avatar/cobain.jpg"
              />
              <div className="in-data-[collapsible=dock]:hidden text-sm">
                <SidebarLabel>Kurt Cobain</SidebarLabel>
                <span className="-mt-0.5 block text-muted-fg">
                  kurt@domain.com
                </span>
              </div>
            </div>
            <ChevronUpDownIcon data-slot="chevron" />
          </MenuTrigger>
          <MenuContent
            className="in-data-[sidebar-collapsible=collapsed]:min-w-56 min-w-(--trigger-width)"
            placement="bottom right"
          >
            <MenuSection>
              <MenuHeader separator>
                <span className="block">Kurt Cobain</span>
                <span className="font-normal text-muted-fg">@cobain</span>
              </MenuHeader>
            </MenuSection>

            <MenuItem href="#dashboard">
              <HomeIcon />
              Dashboard
            </MenuItem>
            <MenuItem href="#settings">
              <Cog6ToothIcon />
              Settings
            </MenuItem>
            <MenuItem href="#security">
              <ShieldCheckIcon />
              Security
            </MenuItem>
            <MenuSeparator />
            <MenuItem href="#contact">
              <LifebuoyIcon />
              Customer Support
            </MenuItem>
            <MenuSeparator />
            <MenuItem href="#logout">
              <ArrowRightStartOnRectangleIcon />
              Log out
            </MenuItem>
          </MenuContent>
        </Menu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
