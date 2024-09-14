"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const router = useRouter();

    const Menus = [
        { title: "Dashboard", src: "/" },
        { title: "Book Management", src: "book", gap: true },
        { title: "Member Management", src: "member" },
        { title: "Author Management", src: "author" },
        { title: "Loan Management", src: "loan" },
        { title: "Category Management", src: "category" },
        { title: "Branch Management", src: "branch" },
        { title: "Room Management", src: "room" },
        { title: "Logout", src: "logout", gap: true },
    ];

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

        router.replace('/authentication');
    };

    return (
        <div className="flex">
            <div
                className={`${
                    open ? "w-72" : "w-20"
                } bg-black h-screen p-5 pt-8 relative duration-300`}
            >
                <Image
                    src="/lib/assets/control.png"
                    alt={"control"}
                    width={30}
                    height={30}
                    className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full ${
                        !open && "rotate-180"
                    }`}
                    onClick={() => setOpen(!open)}
                />
                <div className="flex gap-x-4 items-center">
                    <h1
                        className={`text-white origin-left font-medium text-xl duration-200 ${
                            !open && "scale-0"
                        }`}
                    >
                        Admin Panel
                    </h1>
                </div>
                <ul className="pt-6">
                    {Menus.map((Menu, index) => (
                        <li
                            key={index}
                            className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 ${
                                Menu.gap ? "mt-9" : "mt-2"
                            } ${index === 0 && "bg-light-white"}`}
                            onClick={() => {
                                if (Menu.title === "Logout") {
                                    handleLogout();
                                }
                            }}
                        >
                            <img src={`/lib/assets/${Menu.src}.svg`} />
                            <span className={`${!open && "hidden"} origin-left duration-200`}>
                                <Link href={`/dashboard/admin/${Menu.src}`}>{Menu.title}</Link>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
