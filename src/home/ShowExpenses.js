import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserProvider";
import axios from "axios";
import ExpensesEdit from "./ExpensesEdit";
import { toast, Toaster } from "react-hot-toast";

const baseURL = process.env.REACT_APP_API_BASE_URL;

export default function ShowExpenses({ addedExpenses, setAddedExpenses }) {
    const { user } = useContext(UserContext);
    const [expenses, setExpenses] = useState([]);
    const [editExpenses, setEditExpenses] = useState({
        id: 0,
        amount: "",
        bank: "",
        expediterType: "",
        expenseDate: "",
        reason: "",
        requirement: "",
        savedAmount: "",
        returnName: "",
        returnDate: "",
        returnStatus: "",
    })
    const [showEditExpenses, setShowEditExpenses] = useState(false);



    const handleEdit = (id) => {
        // console.log("Edit clicked for ID:", id);

        // 🔍 Find the expense by ID
        const expenseToEdit = expenses.find((exp) => exp.id === id);

        if (!expenseToEdit) {
            console.error("Expense not found with ID:", id);
            return;
        }
        setEditExpenses({
            id: expenseToEdit.id,
            amount: expenseToEdit.amount,
            bank: expenseToEdit.bank,
            expediterType: expenseToEdit.expediterType,
            expenseDate: expenseToEdit.expenseDate,
            reason: expenseToEdit.reason,
            requirement: expenseToEdit.requirement,
            savedAmount: expenseToEdit.savedAmount,
            returnName: expenseToEdit.returnName,
            returnDate: expenseToEdit.returnDate,
            returnStatus: expenseToEdit.returnStatus,
        })

        setShowEditExpenses(true);

    };


    const handleDelete = async (id) => {

        const token = localStorage.getItem("token");

        try {
            await axios.delete(`${baseURL}/api/v1/delete-expenses`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                data: { id }, // ✅ Send only ID inside `data`
            });
            // ✅ Update UI after delete
            setExpenses((prev) => prev.filter((exp) => exp.id !== id));
            toast.success("Expense deleted successfully!");
            // console.log("Expense deleted successfully");
        } catch (error) {
            toast.error("Failed to delete expense!");
            // console.error("Error deleting expense:", error);
        }
    };

    const handleUpdateExpense = (updatedExpense) => {
        setExpenses((prev) =>
            prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
        );
        setShowEditExpenses(false); // Close modal after update
    };

    const formatValue = (val) => (val && val.trim() !== "" ? val : "---");


    const fetchExpenses = async () => {
        if (user) {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${baseURL}/api/v1/get-expenses`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                setExpenses(response.data);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [user]);

    useEffect(() => {
        if (addedExpenses) {
            fetchExpenses().then(() => setAddedExpenses(false));
        }
    }, [addedExpenses, setAddedExpenses]);


    return (
        <div className="md:p-4 p-1">
            <Toaster position="top-right" reverseOrder={false} />
            <h2 className="text-xl font-semibold mb-4">My Expenses</h2>
            {expenses.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Amount</th>
                                <th className="border p-2">Bank</th>
                                <th className="border p-2">Type</th>
                                <th className="border p-2">Expense Date</th>
                                <th className="border p-2">Reason</th>
                                <th className="border p-2">Requirement</th>
                                <th className="border p-2">Saved Amount</th>
                                <th className="border p-2">Return Name</th>
                                <th className="border p-2">Return Date</th>
                                <th className="border p-2">Return Status</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp) => (
                                <tr key={exp.id} className="text-center">
                                    <td className="border p-2">{exp.id}</td>
                                    <td className="border p-2">{exp.amount}</td>
                                    <td className="border p-2">{formatValue(exp.bank)}</td>
                                    <td className="border p-2">{formatValue(exp.expediterType)}</td>
                                    <td className="border p-2">{formatValue(exp.expenseDate)}</td>
                                    <td className="border p-2">{formatValue(exp.reason)}</td>
                                    <td className="border p-2">{formatValue(exp.requirement)}</td>
                                    <td className="border p-2">{exp.savedAmount}</td>
                                    <td className="border p-2">{formatValue(exp.returnName)}</td>
                                    <td className="border p-2">{formatValue(exp.returnDate)}</td>
                                    <td className="border p-2">{formatValue(exp.returnStatus)}</td>
                                    <td className="border p-2 flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEdit(exp.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-red-600">No expenses found.</p>
            )}
            {showEditExpenses && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative max-h-[90vh] w-[90%] md:w-[70%] lg:w-[60%] overflow-y-auto bg-white rounded-xl shadow-lg p-4">

                        {/* Close Button */}
                        <button
                            onClick={() => setShowEditExpenses(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
                        >
                            ✕
                        </button>

                        <ExpensesEdit
                            editExpenses={editExpenses}
                            onUpdateExpense={handleUpdateExpense}
                        />

                    </div>
                </div>
            )}

        </div>
    );
}
