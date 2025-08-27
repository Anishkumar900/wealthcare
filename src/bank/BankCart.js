import { useEffect, useState } from "react";
import BankDetailsEdit from "./BankDetailsEdit";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const baseURL = process.env.REACT_APP_API_BASE_URL;

export default function BankCart({ bank, onRequestDelete }) {

  const [bankEditFormShow, setBankEditFormShow] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [disableCreditButton, setDisableCreditButton] = useState(false);
  const [disableDebitButton, setDisableDebitButton] = useState(false);
  const navigate = useNavigate();

  const [editedBank, setEditedBank] = useState({
    id: null,
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    phonePay: false,
    amount: "",
    googlePay: false,
    paytm: false,
    bhimUpi: false,
    mobileNumber: "",
    isActive: false,
  });

  const onEdit = (id) => {
    setBankEditFormShow(true);
  };


  useEffect(() => {
    if (bank) {
      setEditedBank({
        id: bank.id,
        accountHolderName: bank.accountHolderName,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        amount: bank.amount,
        phonePay: bank.phonePay,
        googlePay: bank.googlePay,
        paytm: bank.paytm,
        bhimUpi: bank.bhimUpi,
        mobileNumber: bank.mobileNumber,
        isActive: bank.active,
      });
    }
  }, [bank]);

  const handleDebit = async (id) => {
    toast.dismiss();
    setDisableDebitButton(true);
    if (!transactionAmount || isNaN(transactionAmount)) {
      toast.error("Enter valid amount");
      setDisableDebitButton(false);
      return;
    }
    if (!editedBank.isActive) {
      toast.error("Please activate your account");
      setDisableDebitButton(false);
      return;
    }
    if (Number(editedBank.amount) < Number(transactionAmount)) {
      toast.error("Insufficient fund");
      setDisableDebitButton(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${baseURL}/api/v1/debit-amount/${id}/debit?amount=${transactionAmount}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditedBank((prev) => ({ ...prev, amount: response.data }));
      toast.success("Amount debited!");
      setTransactionAmount("");
      setDisableDebitButton(false);
    } catch (error) {
      toast.error("Failed to debit amount");
      setDisableDebitButton(false);
    }
  };

  const handleCredit = async (id) => {
    toast.dismiss();
    setDisableCreditButton(true);
    if (!transactionAmount || isNaN(transactionAmount)) {
      toast.error("Enter valid amount");
      setDisableCreditButton(false);
      return;
    }
    if (!editedBank.isActive) {
      toast.error("Please activate your account");
      setDisableCreditButton(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${baseURL}/api/v1/credit-amount/${id}/credit?amount=${transactionAmount}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditedBank((prev) => ({ ...prev, amount: response.data }));
      toast.success("Amount credited!");
      setTransactionAmount("");
      setDisableCreditButton(false);
    } catch (error) {
      toast.error("Failed to credit amount");
      setDisableCreditButton(false);
    }
  };

  const goToDetails = () => {
    navigate(`/bank/${editedBank.id}`);
  };

  if (!bank) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-xl hover:scale-105 transition-transform duration-700 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {editedBank.bankName}
          </h2>
          <span
            className={`flex items-center text-xs font-medium ${editedBank.isActive ? "text-green-600" : "text-red-600"
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1 ${editedBank.isActive ? "bg-green-500" : "bg-red-500"
                }`}
            ></span>
            {editedBank.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Bank details */}
        <p className="text-sm text-gray-600">
          <span className="font-medium">Account Holder:</span>{" "}
          {editedBank.accountHolderName}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Account Number:</span>{" "}
          {editedBank.accountNumber}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Amount:</span> ₹
          {Number(editedBank.amount).toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Mobile:</span>{" "}
          {editedBank.mobileNumber}
        </p>

        {/* Payment options */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {editedBank.phonePay && (
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
              PhonePe
            </span>
          )}
          {editedBank.googlePay && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
              Google Pay
            </span>
          )}
          {editedBank.paytm && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
              Paytm
            </span>
          )}
          {editedBank.bhimUpi && (
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
              BHIM UPI
            </span>
          )}
        </div>

        {/* Transaction Input */}
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={transactionAmount}
            onChange={(e) => {
              let value = e.target.value;
              if (value === "") {
                setTransactionAmount("");
                return;
              }
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                setTransactionAmount(value);
              }
            }}
            min="0"
            step="0.01"
            placeholder="Enter amount"
            className="border rounded-lg px-2 py-1 text-sm w-28 focus:outline-none no-arrows"
          />
          <button
            onClick={() => handleCredit(editedBank.id)}
            className={`px-3 py-1 text-sm rounded-lg transition
    ${disableCreditButton
                ? "bg-green-100 text-green-700 opacity-50 cursor-not-allowed"
                : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            disabled={disableCreditButton}
          >
            + Credit
          </button>
          <button
            onClick={() => handleDebit(editedBank.id)}
            className={`px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg transition ${disableDebitButton ? "opacity-50 cursor-not-allowed" : "hover:bg-red-200"}`}
            disabled={disableDebitButton}
          >
            - Debit
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={goToDetails}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
          >
            📄 Details
          </button>
          <button
            onClick={() => onEdit(editedBank.id)}
            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
          >
            ✏️ Edit
          </button>
          <button
            // onClick={() => setOpen(true)}
            // onClick={()=>onDelete(editedBank.id)}
            onClick={() => onRequestDelete(bank.id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            🗑️ Delete
          </button>

        </div>
      </div>

      {/* Edit Modal */}
      {bankEditFormShow && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative max-h-[90vh] w-[90%] md:w-[70%] lg:w-[60%] overflow-y-auto bg-white rounded-xl shadow-lg p-4">
            <button
              onClick={() => setBankEditFormShow(false)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-600 text-xl font-semibold"
            >
              ✕
            </button>
            <BankDetailsEdit
              setBankEditFormShow={setBankEditFormShow}
              editedBank={editedBank}
              setEditedBank={setEditedBank}
            />
          </div>
        </div>
      )}
    </>
  );
}
