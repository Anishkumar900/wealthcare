import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';


const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function ExpensesEdit(props) {
    const [expenses, setExpenses] = useState({
        id: 0,
        amount: 0,
        bank: "",
        expediterType: "",
        expenseDate: "",
        reason: "",
        requirement: "",
        savedAmount: 0,
        returnName: "",
        returnDate: "",
        returnStatus: "",
    })

    const [decibleButton, setDecibleButton] = useState(false);
    const [correctdate, setCorrectDate] = useState(false);

    const handleChange = (e) => {
        setCorrectDate(false);
        const { name, value } = e.target;
        setExpenses((pre) => ({
            ...pre, [name]: value
        }))

    }

    const submitForm = (e) => {
        e.preventDefault();
        setDecibleButton(true);
        // console.log(expenses);
        if (
            new Date(expenses.expenseDate).setHours(0, 0, 0, 0) >
            new Date().setHours(0, 0, 0, 0)
        ) {
            setCorrectDate(true);
            setDecibleButton(false);
            return;
        }
        const token = localStorage.getItem("token");
        axios.patch(
            `${baseURL}/api/v1/edit-expenses`,  // ✅ Make sure this endpoint supports PATCH
            expenses,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => {
                toast.success("Update successful!")
                
            })
            .catch((error) => {
                toast.error("Something worng!")
            })
            .finally(() => {
                setDecibleButton(false);
                
            });



    }

    useEffect(() => {
        setExpenses({
            id: props.editExpenses.id,
            amount: props.editExpenses.amount,
            bank: props.editExpenses.bank,
            expediterType: props.editExpenses.expediterType,
            expenseDate: props.editExpenses.expenseDate,
            reason: props.editExpenses.reason,
            requirement: props.editExpenses.requirement,
            savedAmount: props.editExpenses.savedAmount,
            returnName: props.editExpenses.returnName,
            returnDate: props.editExpenses.returnDate,
            returnStatus: props.editExpenses.returnStatus,
        })

    }, [props])
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl md:p-6 p-2">
            <Toaster position="top-right" reverseOrder={false} />
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Expenses</h2>

            <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                    <label className="block text-gray-700 mb-1 flex items-center">
                        Expense Date <span className="text-red-600 ml-1">*</span>
                    </label>
                    <input
                        type="date"
                        name="expenseDate"
                        value={expenses.expenseDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none"
                        required
                    />
                    {correctdate && (
                        <p className="text-red-600 text-xs">Expense date is in the future.</p>
                    )}
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-gray-700 mb-1 flex">
                        Reason<span className="text-red-600 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        name="reason"
                        value={expenses.reason}
                        onChange={handleChange}
                        placeholder="Reason"
                        className="w-full p-2 border rounded focus:outline-none"
                        required
                    />
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-gray-700 mb-1 flex">
                        Amount<span className="text-red-600 ml-1">*</span>
                    </label>
                    <input
                        type="number"
                        name="amount"
                        value={expenses.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        className="w-full p-2 border rounded focus:outline-none no-arrows"
                        required
                        min="0"   // 👈 prevents negative input
                    />

                </div>

                {/* Requirement */}
                <div>
                    <label className="block text-gray-700 mb-1 flex">
                        Requirement<span className="text-red-600 ml-1">*</span>
                    </label>
                    <select
                        name="requirement"
                        value={expenses.requirement}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none"
                        required
                    >
                        <option value="" disabled>
                            Select Requirement
                        </option>
                        <option value="Compulsory">Compulsory</option>
                        <option value="Required">Required</option>
                        <option value="Optional">Optional</option>
                    </select>
                </div>

                {/* Saved Amount */}
                <div>
                    <label className="block text-gray-700 mb-1 flex">
                        Saved Amount<span className="text-red-600 ml-1">*</span>
                    </label>
                    <input
                        type="number"
                        name="savedAmount"
                        value={expenses.savedAmount}
                        onChange={handleChange}
                        placeholder="Saved Amount"
                        className="w-full p-2 border rounded focus:outline-none no-arrows"
                        required
                        min="0"
                    />
                </div>

                {/* Bank */}
                <div>
                    <label className="block text-gray-700 mb-1 flex">
                        Bank<span className="text-red-600 ml-1">*</span>
                    </label>
                    <select
                        name="bank"
                        value={expenses.bank}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none"
                        required
                    >
                        <option value="" disabled>
                            Select Bank
                        </option>
                        <option value="SBI">State Bank of India (SBI)</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="Axis">Axis Bank</option>
                        <option value="PNB">Punjab National Bank (PNB)</option>
                        <option value="BOB">Bank of Baroda</option>
                        <option value="Canara">Canara Bank</option>
                        <option value="Kotak">Kotak Mahindra Bank</option>
                        <option value="IDFC">IDFC First Bank</option>
                        <option value="Yes">Yes Bank</option>
                        <option value="IndusInd">IndusInd Bank</option>
                        <option value="Union">Union Bank of India</option>
                        <option value="Central">Central Bank of India</option>
                        <option value="Indian">Indian Bank</option>
                        <option value="UCO">UCO Bank</option>
                        <option value="BankOfIndia">Bank of India</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Expediter Type */}
                <div>
                    <label className="block text-gray-700 mb-1 flex">
                        Expediter Type<span className="text-red-600 ml-1">*</span>
                    </label>
                    <select
                        name="expediterType"
                        value={expenses.expediterType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none"
                        required
                    >
                        <option value="" disabled>
                            Select Type
                        </option>
                        <option value="Personal Use">Personal Use</option>
                        <option value="Friend">Friend</option>
                        <option value="Family">Family</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Return Date */}
                <div>
                    <label className="block text-gray-700 mb-1">Return Date</label>
                    <input
                        type="date"
                        name="returnDate"
                        value={expenses.returnDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none"
                    />
                </div>

                {/* Return Name */}
                <div>
                    <label className="block text-gray-700 mb-1">Return Name</label>
                    <input
                        type="text"
                        name="returnName"
                        value={expenses.returnName}
                        onChange={handleChange}
                        placeholder="Return Name"
                        className="w-full p-2 border rounded focus:outline-none"
                    />
                </div>

                {/* Return Status */}
                <div>
                    <label className="block text-gray-700 mb-1">Return Status</label>
                    <select
                        name="returnStatus"
                        value={expenses.returnStatus}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none"
                    >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end col-span-2">
                    <button
                        type="submit"
                        disabled={decibleButton}
                        className={` bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 m-4 transition ${decibleButton
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[var(--legacy-interactive-color-hover)]"
                            }`}
                    >
                        {decibleButton ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    )
}
