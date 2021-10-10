import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "../stores/useUserStore";
import axios from "axios";
import { logOutEndpoint } from "../apis";

const navigation = [
  // { name: 'Dashboard', href: '#', current: true },
  // { name: 'Team', href: '#', current: false },
  // { name: 'Projects', href: '#', current: false },
  // { name: 'Calendar', href: '#', current: false },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const currentUser = useUserStore((e) => e.user);
  const logoutUser = useUserStore((e) => e.logoutUser);

  console.log(currentUser);

  console.log(currentUser === null);
  return (
    <Disclosure as="nav" className="bg-white-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="flex items-center">
                  <a className="home-link">
                    <Link href={`/`}>
                      <Image
                        className="block lg:hidden h-10 w-auto"
                        src="/images/ezydine-logo.png"
                        alt="Ezydine Logo"
                        width="40"
                        height="40"
                      />
                    </Link>
                  </a>
                </div>
              </div>
              {currentUser === null ? (
                <div className="absolute inset-y-0 right-0 flex gap-4 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <a
                    href={"/auth/signin/"}
                    className={classNames(
                      "bg-gray-900 text-white",
                      "px-3 py-2 rounded-md text-sm font-medium"
                    )}
                    aria-current={"page"}
                  >
                    Manager Signin
                  </a>
                </div>
              ) : (
                <div className="absolute inset-y-0 right-0 flex gap-4 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Link href={"/add_menu_item"}>
                    <div
                      className={classNames(
                        "bg-gray-900 text-white",
                        "px-3 py-2 rounded-md text-sm font-medium",
                        "cursor-pointer"
                      )}
                      aria-current={"page"}
                    >
                      Manage Spots
                    </div>
                  </Link>
                  <div
                    onClick={logoutUser}
                    className={classNames(
                      "bg-purple-200 text-gray-900",
                      "px-3 py-2 rounded-md text-sm font-medium",
                      "cursor-pointer"
                    )}
                    aria-current={"page"}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
