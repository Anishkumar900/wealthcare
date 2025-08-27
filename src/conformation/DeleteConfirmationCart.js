import React, { useEffect } from "react";

export default function DeleteConfirmationCart({ isOpen, onClose, onConfirm, itemName }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // lock scroll
    } else {
      document.body.style.overflow = "auto"; // restore scroll
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white w-full max-w-lg mx-4 sm:mx-auto p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
          ⚠️ Confirm Delete
        </h2>
        <p className="text-center text-gray-700 mb-8">
          Are you sure you want to delete <span className="font-semibold">{itemName}</span>?  
          This action cannot be undone.
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
