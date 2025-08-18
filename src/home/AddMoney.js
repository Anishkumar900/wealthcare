import React, { useState, useEffect } from 'react'
import AddMoneyForm from './AddMoneyForm';

export default function AddMoney() {
  const [showForm, setShowForm] = useState(false);
  const [decibleButton, setDecibleButton] = useState(false);

  const showAddmoneyForm = () => {
    setDecibleButton(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setDecibleButton(false);
    setShowForm(false);
  };

  // 👉 Prevent background scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForm]);

  return (
    <div>
      <button
        className={` bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 m-4 transition ${decibleButton
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-[var(--legacy-interactive-color-hover)]"
          }`}
        onClick={showAddmoneyForm}
        disabled={decibleButton}
      >
        Add Money
      </button>

      {/* Modal with blurred background */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeForm} // close if clicked outside
        >
          <div
            className="relative bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={closeForm}
            >
              ✖
            </button>

            {/* The actual form */}
            <AddMoneyForm />
          </div>
        </div>
      )}
    </div>
  );
}
