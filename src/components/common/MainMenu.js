import {
  homeItems,
  blogItems,
  listingItems,
  // pageItems, // pages not shown in navbar
} from "@/data/navItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const getListingLeafLinks = (items) => {
  const links = [];
  items.forEach((section) => {
    (section?.submenu || []).forEach((itm) => {
      if (itm?.href && itm?.label) links.push({ href: itm.href, label: itm.label });
    });
  });
  return links;
};

const SimpleMenu = ({
  title,
  items,
  topKey,
  pathname,
  topMenu,
  handleActive,
}) => {
  const isSingle = items.length === 1;
  const activeTitleClass = topMenu === topKey ? "title menuActive" : "title";

  if (isSingle) {
    const only = items[0];
    return (
      <li className="visible_list">
        <Link className={`list-item ${handleActive(only.href) || ""}`} href={only.href}>
          <span className={activeTitleClass}>{title ?? only.label}</span>
        </Link>
      </li>
    );
  }

  return (
    <li className="visible_list dropitem">
      <a className="list-item" href="#">
        <span className={activeTitleClass}>{title}</span>
        <span className="arrow"></span>
      </a>
      <ul className="sub-menu">
        {items.map((item, index) => (
          <li key={index}>
            <Link className={`${handleActive(item.href) || ""}`} href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

const ListingMenu = ({
  title = "Listing",
  items,
  topKey,
  pathname,
  topMenu,
  handleActive,
}) => {
  const leafLinks = getListingLeafLinks(items);
  const isSingle = leafLinks.length === 1;
  const activeTitleClass = topMenu === topKey ? "title menuActive" : "title";

  if (isSingle) {
    const only = leafLinks[0];
    return (
      <li className="visible_list">
        <Link className={`list-item ${handleActive(only.href) || ""}`} href={only.href}>
          <span className={activeTitleClass}>{title}</span>
        </Link>
      </li>
    );
  }

  return (
    <li className="megamenu_style dropitem">
      <a className="list-item" href="#">
        <span className={activeTitleClass}>{title}</span>
        <span className="arrow"></span>
      </a>
      <ul className="row dropdown-megamenu sub-menu">
        {items.map((item, index) => (
          <li className="col mega_menu_list" key={index}>
            {item?.title ? <h4 className="title">{item.title}</h4> : null}
            <ul className="sub-menu">
              {(item?.submenu || []).map((submenuItem, subIndex) => (
                <li key={subIndex}>
                  <Link
                    className={`${handleActive(submenuItem.href) || ""}`}
                    href={submenuItem.href}
                  >
                    {submenuItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </li>
  );
};

const MainMenu = () => {
  const pathname = usePathname();
  const [topMenu, setTopMenu] = useState("");

  useEffect(() => {
    homeItems.forEach((elm) => {
      if (elm.href.split("/")[1] === pathname.split("/")[1]) setTopMenu("home");
    });
    blogItems.forEach((elm) => {
      if (elm.href.split("/")[1] === pathname.split("/")[1]) setTopMenu("blog");
    });
    listingItems.forEach((item) =>
      (item.submenu || []).forEach((elm) => {
        if (elm.href.split("/")[1] === pathname.split("/")[1]) setTopMenu("listing");
      })
    );
  }, [pathname]);

  const handleActive = (link) => {
    return link.split("/")[1] === pathname.split("/")[1] ? "menuActive" : "";
  };

  return (
    <ul className="ace-responsive-menu ms-auto menu-inline">
      <SimpleMenu
        title="Home"
        items={homeItems}
        topKey="home"
        pathname={pathname}
        topMenu={topMenu}
        handleActive={handleActive}
      />

      <li className="visible_list">
        <Link className={`list-item ${handleActive("/about")}`} href="/about">
          <span className={`title ${handleActive("/about")}`}>About us</span>
        </Link>
      </li>

      <ListingMenu
        title="Properties"
        items={listingItems}
        topKey="listing"
        pathname={pathname}
        topMenu={topMenu}
        handleActive={handleActive}
      />

      <SimpleMenu
        title="Blog"
        items={blogItems}
        topKey="blog"
        pathname={pathname}
        topMenu={topMenu}
        handleActive={handleActive}
      />

      <li className="visible_list">
        <Link className={`list-item ${handleActive("/contact")}`} href="/contact">
          <span className={`title ${handleActive("/contact")}`}>Contact us</span>
        </Link>
      </li>
    </ul>
  );
};

export default MainMenu;
