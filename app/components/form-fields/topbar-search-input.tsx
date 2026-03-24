"use client";

import { useState } from "react";
import { redirect } from "next/navigation";

export default function TopbarSearchInput() {
    const [searchValue, setSearchValue] = useState("");

    //function for on enter press in input field
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            console.log("Search value submitted:", searchValue);
            // You can add any logic to handle the search submission here
            redirect(`/search?query=${encodeURIComponent(searchValue)}`);
        }
    };

    return (
        <div className="flex items-center gap-4 w-full">
            <div className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onKeyDown={handleKeyDown}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-8 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#0f82ca] focus:ring focus:ring-[#0f82ca]/50"

            />
        </div>

    );
}
