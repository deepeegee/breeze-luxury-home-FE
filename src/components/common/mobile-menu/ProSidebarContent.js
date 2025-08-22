"use client";

import mobileMenuItems from "@/data/mobileMenuItems";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

const ProSidebarContent = () => {
  const path = usePathname();

  return (
    <Sidebar width="100%" backgroundColor="#fff" className="my-custom-class">
      <Menu>
        {mobileMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            className={item.path === path ? "active" : ""}
            component={
              <Link
                href={item.path}
                aria-current={item.path === path ? "page" : undefined}
                className={item.path === path ? "active" : ""}
              />
            }
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default ProSidebarContent;
