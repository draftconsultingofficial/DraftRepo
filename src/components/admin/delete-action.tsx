"use client";

import { useState } from "react";

type SafeDeleteProps = {
  formAction: (formData: FormData) => void;
  payloadKey: string;
  payloadValue: string;
  itemName?: string;
  buttonClass?: string;
};

export function SafeDelete({ 
  formAction, 
  payloadKey, 
  payloadValue, 
  itemName = "this item",
  buttonClass = "rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
}: SafeDeleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const isMatched = confirmText.toLowerCase() === "delete";

  if (!isOpen) {
    return (
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        className={buttonClass}
      >
        Delete
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-3 shadow-sm min-w-[220px]">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-bold text-red-800">
          Delete {itemName}?
        </label>
        <button 
          type="button" 
          onClick={() => { setIsOpen(false); setConfirmText(""); }}
          className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-2 py-0.5 rounded transition"
        >
          Cancel
        </button>
      </div>
      <p className="text-xs text-red-600 mb-1">
        Type <span className="font-mono font-bold text-black border border-gray-300 bg-white px-1">delete</span> to confirm.
      </p>
      <input type="hidden" name={payloadKey} value={payloadValue} />
      <input 
        type="text" 
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        className="block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-xs py-1.5 px-2"
        placeholder="Type delete..."
        required
      />
      <button 
        type="submit" 
        disabled={!isMatched}
        className={`mt-1 rounded-md px-3 py-1.5 text-xs font-medium text-white transition ${isMatched ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"}`}
      >
        Confirm Delete
      </button>
    </form>
  );
}
