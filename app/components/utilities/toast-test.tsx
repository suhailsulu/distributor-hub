"use client";
import { useState } from "react";
import { Toast } from "./Toast";

export default function ToastTest() {
    const [toastMessage, setToastMessage] = useState<string>("");
    return (
        <div className="p-4">
            <button
                onClick={() => setToastMessage("This is a toast message!")}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
                Show Toast
            </button>
            {toastMessage ? <Toast message={toastMessage} onClose={() => setToastMessage('')} durationMs={3000} /> : null}
        </div>
    );

}