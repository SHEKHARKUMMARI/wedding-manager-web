"use client";
import React, { Fragment, useEffect, useRef } from "react";
import Logo from "../../components/logos/app-logo";
import NavItem from "./nav-item/page";

import dynamic from "next/dynamic";
import { useGlobalStore } from "@/stores/global";
import NavItemMobile from "./nav-item-mobile/page";
import { isLogedIn } from "@/utils/run-time";
import webSocket from "@/utils/websocket";
const UserProfile = dynamic(() => import("./profile/page"), { ssr: false });
const UserProfileMobile = dynamic(() => import("./profile-mobile/page"), {
  ssr: false,
});

const NavigationBar = () => {
  const { isNavbarMenuOpen: isMenuOpen, setIsNavbarMenuOpen: setIsMenuOpen } =
    useGlobalStore();
  const isUserLogedIn = isLogedIn();
  const webSocketRef = useRef<any>();
  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    // Establish WebSocket connection when component mounts
    const ws: any = isUserLogedIn
      ? webSocket({
          query: {},
          url: "/ws/user/status",
        })
      : {};
    webSocketRef.current = ws;
    ws.onopen = () => {
      console.log("you are connected");
    };

    ws.onmessage = (event: { data: string }) => {
      console.log(JSON.parse(event.data));
    };

    ws.onclose = () => {
      console.log("we are disconnection");
    };

    return () => {
      if (ws) {
        ws.close?.();
      }
    };
  }, []);

  return (
    <Fragment>
      <nav className="fixed top-0 w-[100%] bg-fuchsia-600 px-4 py-4 flex justify-between items-center z-[9999]">
        <Logo />
        <div className="lg:hidden">
          <button
            className="navbar-burger flex items-center text-white p-3"
            onClick={toggleMenu}
          >
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto  lg:items-center lg:w-auto lg:space-x-6">
          <li className="text-gray-300">
            <NavItem href={"/weddings/my-weddings"} label={"Manage weddings"} />
          </li>
          <li className="text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 current-fill"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li className="text-gray-300 ">
            <NavItem
              href={"/weddings/create"}
              label={"+ Create Wedding"}
              className="rounded border py-2 px-6"
            />
          </li>
          <li className="text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 current-fill"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li>
            <NavItem href={"/invitations/dashboard"} label={"Invitations"} />
          </li>
        </ul>

        <UserProfile />
      </nav>
      <div
        className={` navbar-menu relative z-50 ${isMenuOpen ? "" : "hidden"}`}
      >
        <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
        <nav className=" fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-fuchsia-600 border-r overflow-y-auto">
          <div className="flex items-center mb-8 justify-between ">
            <Logo />
            <button
              className="navbar-close"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div>
            <ul>
              <li className="mb-1">
                <NavItemMobile
                  href={"/weddings/my-weddings"}
                  label={"Manage weddings"}
                />
              </li>
              <li className="mb-1">
                <NavItemMobile
                  href={"/weddings/create"}
                  label={"Create Wedding"}
                />
              </li>
              <li className="mb-1">
                <NavItemMobile href={"#"} label={"Invitations"} />
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <div className="pt-6">
              <UserProfileMobile />
            </div>
          </div>
        </nav>
      </div>
    </Fragment>
  );
};

export default NavigationBar;
