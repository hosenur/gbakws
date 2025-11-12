"use client";

import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Avatar } from "@gbakws/ui";
import { Breadcrumbs, BreadcrumbsItem } from "@gbakws/ui";
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuLabel,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@gbakws/ui";
import { SidebarNav, SidebarTrigger } from "@gbakws/ui";

export default function AppSidebarNav() {
  return (
    <SidebarNav>
      <span className="flex items-center gap-x-4">
        <SidebarTrigger />
        <Breadcrumbs className="hidden md:flex">
          <BreadcrumbsItem href="/blocks/sidebar/sidebar-01">
            Dashboard
          </BreadcrumbsItem>
          <BreadcrumbsItem>Newsletter</BreadcrumbsItem>
        </Breadcrumbs>
      </span>
      <UserMenu />
    </SidebarNav>
  );
}

function UserMenu() {
  return (
    <Menu>
      <MenuTrigger className="ml-auto md:hidden" aria-label="Open Menu">
        <Avatar
          isSquare
          alt="kurt cobain"
          src="https://intentui.com/images/avatar/cobain.jpg"
        />
      </MenuTrigger>
      <MenuContent popover={{ placement: "bottom end" }} className="min-w-64">
        <MenuSection>
          <MenuHeader separator>
            <span className="block">Kurt Cobain</span>
            <span className="font-normal text-muted-fg">@cobain</span>
          </MenuHeader>
        </MenuSection>
        <MenuItem href="#dashboard">
          <Squares2X2Icon />
          <MenuLabel>Dashboard</MenuLabel>
        </MenuItem>
        <MenuItem href="#settings">
          <Cog6ToothIcon />
          <MenuLabel>Settings</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem>
          <CommandLineIcon />
          <MenuLabel>Command Menu</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem href="#contact-s">
          <MenuLabel>Contact Support</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem href="#logout">
          <ArrowRightOnRectangleIcon />
          <MenuLabel>Log out</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
