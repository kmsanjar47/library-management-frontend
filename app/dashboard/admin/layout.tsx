import Sidebar from "@/components/sidebar";
import React from "react";

export default function Layout({children}: { children:React.ReactNode }) {
    return <div className="flex">
        {/* Sidebar */}
        <Sidebar/>
        {/* Page Content */}
        <div className="flex-1 p-10">
            {children}
        </div>
    </div>

}