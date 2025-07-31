"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  UserIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "홈", href: "/", icon: HomeIcon },
    { name: "게시판", href: "/board", icon: ClipboardIcon },
    { name: "채팅", href: "/messages", icon: ChatBubbleLeftIcon },
    { name: "시간표", href: "/schedule", icon: CalendarIcon },
    { name: "나의틴", href: "/profile", icon: UserIcon },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white border-t rounded-t-[30px] max-w-lg w-full">
      <div className="flex justify-around items-center h-16 m-2 mb-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <item.icon className="w-7 h-7" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
