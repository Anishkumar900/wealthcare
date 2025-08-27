import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import DeleteConfirmation from "../conformation/DeleteConfirmation";

const baseURL = process.env.REACT_APP_API_BASE_URL;

export default function BankExpensesShow({ bankId, bank, setBank, refreshKey }) {
    const [expenses, setExpenses] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    // ✅ Fetch expenses when component loads
    useEffect(() => {
        toast.dismiss();

        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${baseURL}/api/v1/bank/expenses/id/${bankId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setExpenses(res.data);
            } catch (err) {
                toast.error("Failed to load expenses");
            }
        };

        fetchExpenses();
    }, [bankId, refreshKey]);

    // ✅ Handle delete
    const handleDelete = async () => {
        if (!selectedExpense) return;

        // console.log("Deleting expense ID:", selectedExpense.id);
        // setOpen(false);

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${baseURL}/api/v1/bank/expenses/delete-expenses-bank/${selectedExpense.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // ✅ Remove from local state
            setExpenses((prev) => prev.filter((exp) => exp.id !== selectedExpense.id));

            // ✅ Update bank amount
            setBank((prev) => ({
                ...prev,
                amount: Number(prev.amount) + Number(selectedExpense.amount),
            }));

            toast.success("Expense deleted and amount restored!");
        } catch (err) {
            toast.error("Failed to delete expense");
        } finally {
            setOpen(false);
            setSelectedExpense(null);
        }
    };

    return (
        <div className="mt-6">
            <Toaster position="top-right" reverseOrder={false} />
            <h2 className="text-lg font-semibold text-gray-700 mb-4">💰 Bank Expenses</h2>

            {expenses.length === 0 ? (
                <p className="text-gray-500 text-sm">No expenses found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Reason</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Amount</th>
                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp) => (
                                <tr key={exp.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm">{exp.date}</td>
                                    <td className="px-4 py-2 text-sm">{exp.reason}</td>
                                    <td className="px-4 py-2 text-sm">{exp.amountDebit}</td>
                                    <td className="px-4 py-2 text-sm font-semibold text-green-600">₹{exp.amount}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => {
                                                setSelectedExpense(exp); // ✅ store clicked expense
                                                setOpen(true);
                                            }}
                                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                                        >
                                            🗑 Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ✅ Only ONE modal for all rows */}
            <DeleteConfirmation
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
                itemName={selectedExpense?.reason || "Expense"}
            />
        </div>
    );
}
