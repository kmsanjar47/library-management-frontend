"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    FaBook,
    FaUser,
    FaHome,
    FaSignOutAlt,
    FaCog,
    FaListAlt,
    FaBuilding,
    FaDoorOpen,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const router = useRouter();
    const currentPath = usePathname(); // Get the current route path

    const Menus = [
        { title: "Dashboard", src: "/", icon: <FaHome /> },
        { title: "Book Management", src: "book", icon: <FaBook />, gap: true },
        { title: "Member Management", src: "member", icon: <FaUser /> },
        { title: "Author Management", src: "author", icon: <FaListAlt /> },
        { title: "Loan Management", src: "loan", icon: <FaCog /> },
        { title: "Category Management", src: "category", icon: <FaListAlt /> },
        { title: "Branch Management", src: "branch", icon: <FaBuilding /> },
        { title: "Room Management", src: "room", icon: <FaDoorOpen /> },
        { title: "Logout", src: "logout", icon: <FaSignOutAlt />, gap: true },
    ];

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("authToken");
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            router.replace("/authentication");
        }
    };

    return (
        <div className="flex">
            <div
                className={`${
                    open ? "w-72" : "w-20"
                } bg-gradient-to-br from-gray-900 to-black h-screen p-5 pt-8 relative duration-300 transition-all ease-in-out`}
            >
                {/* Control Button with Arrow */}
                <div
                    className={`absolute cursor-pointer -right-3 top-9 w-7 h-7 border-2 border-dark-purple rounded-full bg-white p-1 flex items-center justify-center transition-transform duration-300 ${
                        open ? "" : "rotate-180"
                    }`}
                    onClick={() => setOpen(!open)}
                >
                    {open ? (
                        <FaChevronLeft className="text-black transition-transform duration-300" />
                    ) : (
                        <FaChevronRight className="text-black transition-transform duration-300" />
                    )}
                </div>

                {/* Sidebar Header */}
                <div className="flex gap-x-4 items-center">
                    <h1
                        className={`text-white origin-left font-medium text-2xl duration-300 transform ${
                            !open && "scale-0"
                        }`}
                    >
                        Admin Panel
                    </h1>
                </div>

                {/* Menu Items */}
                <ul className="pt-6">
                    {Menus.map((Menu, index) => {
                        const isActive = currentPath === `/dashboard/admin/${Menu.src}` || (currentPath === '/dashboard/admin' && Menu.src === '/'); // Check if the menu item is active

                        return (
                            <li
                                key={index}
                                className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-800 text-gray-300 text-sm items-center gap-x-4 transition-all duration-200 ease-in-out ${
                                    Menu.gap ? "mt-9" : "mt-2"
                                } ${isActive && "bg-gray-800"}`} // Apply background color dynamically if active
                                onClick={() => {
                                    if (Menu.title === "Logout") {
                                        handleLogout();
                                    }
                                }}
                            >
                                <div className="text-white text-lg">{Menu.icon}</div>
                                <span
                                    className={`${
                                        !open && "hidden"
                                    } origin-left duration-300 transform transition-all ease-in-out`}
                                >
                                    <Link href={`/dashboard/admin/${Menu.src}`}>
                                        {Menu.title}
                                    </Link>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
