import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";


const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function BankExpensesShow({ bankId, bank, setBank,refreshKey  }) {
    const [expenses, setExpenses] = useState([]);

    // ✅ Fetch expenses when component loads
    //   console.log(bankId)
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

                // console.log(res.data);
                setExpenses(res.data);
            } catch (err) {
                // console.error(err);
                toast.error("Failed to load expenses");
            }
        };

        fetchExpenses();
    }, [bankId,refreshKey]);


    // ✅ Handle delete
    const handleDelete = async (expense) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${baseURL}/api/v1/bank/expenses/delete-expenses-bank/${expense.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }); // 🔹 adjust backend endpoint
            setExpenses((prev) => prev.filter((exp) => exp.id !== expense.id));
            setBank((prev) => ({
                ...prev,
                amount: Number(prev.amount) + Number(expense.amount),
            }));
            toast.success("Expense deleted and amount restored!");
        } catch (err) {
            // console.error(err);
            toast.error("Failed to delete expense");
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
                                            onClick={() => handleDelete(exp)}
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
        </div>
    );
}
