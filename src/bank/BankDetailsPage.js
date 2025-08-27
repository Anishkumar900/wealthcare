import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../bar/Header";
import Footer from "../bar/Footer";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import BankExpensesShow from "./BankExpensesShow";
import Loader from "../loader/Loader";
// import { motion, AnimatePresence } from "framer-motion";

const baseURL = process.env.REACT_APP_API_BASE_URL;

export default function BankDetailsPage() {
    const { id } = useParams();
    const [bank, setBank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showExpenses, setShowExpenses] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [expenses, setExpenses] = useState({

        bank_id: id,
        date: "",
        amount: "",
        reason: '',
        amountDebit: ""
    });
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${baseURL}/api/v1/id-bank/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // const bankData = response.data.find((b) => b.id === Number(id));
                setBank(response.data);
                // console.log(response)
            } catch (err) {
                toast.error("Failed to fetch bank details");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBankDetails();
    }, [id]);

    const fetchExpenses = async () => {
        toast.dismiss();
        if (!bank.active) {
            toast.error("Bank not active!")
            return
        }
        setShowExpenses(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();
        // console.log("Expense Added:", expenses);
        setDisableSubmitButton(true)
        if (!bank.active) {
            toast.error("Bank not active!")
            setDisableSubmitButton(false);
            return
        }
        const selectedDate = new Date(expenses.date);
        const today = new Date();

        // normalize both to midnight (remove hours, minutes, seconds, ms)
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            toast.error("Please enter a correct date");
            setDisableSubmitButton(false);
            return;
        }
        if (Number(expenses.amount) > Number(bank.amount)) {
            toast.error("Insufficient balance");
            setDisableSubmitButton(false);
            return;
        }

        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(`${baseURL}/api/v1/bank/expenses/add-expenses`, expenses, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            setBank((prev) => ({
                ...prev,
                amount: prev.amount - response.data.amount
            }));
            toast.success("Add bank expenses successful!")

            setTimeout(() => {
                setShowExpenses(false)
                setExpenses({ date: "", amount: "", reason: "", amountDedit: "", bank_id: id });
                setRefreshKey(prev => prev + 1);
            }, 1000)
        }
        catch (error) {
            toast.error("Something went wrong!")
        }
        finally {
            setDisableSubmitButton(false)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenses((prev) => ({ ...prev, [name]: value }));
    };

    const closeForm = () => {
        setExpenses({ date: "", amount: "", reason: "", amountDedit: "", bank_id: id });
        setDisableSubmitButton(false)
        setShowExpenses(false);
    }

    if (loading) return <Loader/>;

    return (
        <div className="flex flex-col min-h-screen">
            <Toaster position="top-right" reverseOrder={false} />
            <Header />

            <main className="flex-1 container mx-auto px-4 py-6 mt-12">
                {bank ? (
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {bank.bankName}
                        </h2>
                        <p className="text-gray-600">
                            <span className="font-medium">Account Holder:</span>{" "}
                            {bank.accountHolderName}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Account Number:</span>{" "}
                            {bank.accountNumber}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Mobile:</span> {bank.mobileNumber}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Balance:</span> ₹
                            {Number(bank.amount).toFixed(2)}
                        </p>

                        {/* Active status */}
                        <p className="mt-2">
                            <span
                                className={`px-2 py-1 text-sm rounded ${bank.active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {bank.active ? "Active" : "Inactive"}
                            </span>
                        </p>

                        {/* UPI Options */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {bank.phonePay && (
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                                    PhonePe
                                </span>
                            )}
                            {bank.googlePay && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                    Google Pay
                                </span>
                            )}
                            {bank.paytm && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                    Paytm
                                </span>
                            )}
                            {bank.bhimUpi && (
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                                    BHIM UPI
                                </span>
                            )}
                        </div>

                        {/* Expense Button */}
                        <div className="mt-6">
                            <button
                                onClick={fetchExpenses}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                💸 Add Expenses
                            </button>
                        </div>

                        {/* Expenses Add form */}
                        {showExpenses && (
                            <div
                                className="transition-all duration-1200 ease-in-out transform 
               opacity-0 translate-y-4 animate-fadeInUp"
                            >
                                <form
                                    onSubmit={handleSubmit}
                                    className="relative max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6"
                                >
                                    {/* Close Button */}
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-600 text-xl font-semibold"
                                    >
                                        ✕
                                    </button>

                                    <p className="text-xl font-semibold text-gray-700 text-center">
                                        ➕ Add Expenses
                                    </p>

                                    {/* Grid wrapper */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Date */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={expenses.date}
                                                onChange={handleChange}
                                                className="mt-1 w-full p-2 border rounded-lg focus:outline-none text-sm sm:text-base no-arrows"
                                                required
                                            />
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Amount</label>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={expenses.amount}
                                                // onChange={handleChange}
                                                onChange={(e) => {
                                                    let value = e.target.value;

                                                    // ✅ allow empty input
                                                    if (value === "") {
                                                        setExpenses({ ...expenses, amount: "" });
                                                        return;
                                                    }

                                                    // ✅ allow only up to 2 decimals
                                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                        setExpenses({ ...expenses, amount: value });
                                                    }
                                                }}

                                                min="0"
                                                step="0.01"
                                                placeholder="Enter amount"
                                                className="mt-1 w-full p-2 border rounded-lg focus:outline-none text-sm sm:text-base no-arrows"
                                                required
                                            />
                                        </div>

                                        {/* Reason */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Reason</label>
                                            <input
                                                type="text"
                                                name="reason"
                                                value={expenses.reason}
                                                onChange={handleChange}
                                                placeholder="Enter reason"
                                                className="mt-1 w-full p-2 border rounded-lg focus:outline-none text-sm sm:text-base no-arrows"
                                                required
                                            />
                                        </div>

                                        {/* Debit / Credit */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">
                                                Transaction Type
                                            </label>
                                            <select
                                                name="amountDebit"
                                                value={expenses.amountDebit}
                                                onChange={handleChange}
                                                className="mt-1 w-full p-2 border rounded-lg focus:outline-none text-sm sm:text-base no-arrows"
                                                required
                                            >
                                                <option value="" disabled>-- Select --</option>
                                                <option value="DEBIT">Debit</option>
                                                <option value="CREDIT">Credit</option>
                                                <option value="ATM">ATM</option>
                                                <option value="CASH">Cash</option>
                                                <option value="GOOGLE_PAY">Google Pay</option>
                                                <option value="PAYTM">Paytm</option>
                                                <option value="BHIM_UPI">BHIM UPI</option>
                                                <option value="PHONEPE">PhonePe</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-center md:justify-end col-span-1 md:col-span-2">
                                        <button
                                            type="submit"
                                            disabled={disableSubmitButton}
                                            className={`bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 transition ${disableSubmitButton
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-[var(--legacy-interactive-color-hover)]"
                                                }`}
                                        >
                                            {disableSubmitButton ? "Submitting..." : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}




                    </div>
                ) : (
                    <p className="text-center text-gray-600">Bank not found.</p>
                )}
            </main>

            <BankExpensesShow bankId={id} bank={bank} setBank={setBank} refreshKey={refreshKey} />

            <Footer />
        </div>
    );
}
