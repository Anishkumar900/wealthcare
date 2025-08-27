import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserProvider'
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';


const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function AddBankForm({ setDisableAddBankButton, onBankAdded }) {
  const { user } = useContext(UserContext);
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const [bankDetails, SetBankDetails] = useState({
    email: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    amount: "",
    phonePay: false,
    googlePay: false,
    paytm: false,
    bhimUpi: false,
    mobileNumber: "",
    isActive: false
  })

  const handleChange = (e) => {
    // toast.success("Bank add successful!");
    const { name, type, value, checked } = e.target;
    SetBankDetails((pre) => ({
      ...pre, [name]: type === "checkbox" ? checked : value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setDisableSubmitButton(true);
    // console.log("Submitting...", bankDetails);
    const payload = {
      ...bankDetails,
      amount: bankDetails.amount === "" ? null : bankDetails.amount,
      mobileNumber: bankDetails.mobileNumber === "" ? null : bankDetails.mobileNumber,
    };

    if (bankDetails.mobileNumber.length != 10) {
      toast.error("Please enter a valid mobile number!");
      setDisableSubmitButton(false);
      return;
    }


    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}/api/v1/add-bank`,  // ✅ Make sure this endpoint supports PATCH
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success("Bank add successful!");
      if (onBankAdded) {
        onBankAdded(response.data);  // assuming API returns created bank object
      }
      setTimeout(() => {
        setDisableAddBankButton(false);
      }, 500);
      // console.log(response.data)
    }
    catch (error) {
      // console.log(error.response.data.status);
      if (error.response.data.status === 409) {
        toast.error("Please enter a valid account number!");
      }
      else {
        toast.error("Failed to add bank. Please try again.");
      }
    }
    finally {
      setDisableSubmitButton(false);
      // setDisableAddBankButton(false);
    }

  }
  useEffect(() => {
    // toast.success("Bank add successful!");
    if (user) {
      // console.log(user.email);
      SetBankDetails((pre) => ({
        ...pre, email: user.email
      }))
    }

  }, [user])
  return (
    <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-xl md:p-6 p-2'>

      <p className='text-center text-xl font-bold'>ADD BANK</p>
      <Toaster position="top-right" reverseOrder={false} />
      <form className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-1 p-1 border-slate-700 " onSubmit={submitHandler}>
        {/* Account Holder Name */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Account Holder Name<span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            name="accountHolderName"
            value={bankDetails.accountHolderName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base"
            required
          />
        </div>

        {/* Bank Name */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Bank Name<span className="text-red-600 ml-1">*</span>
          </label>
          <select
            name="bankName"
            value={bankDetails.bankName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base"
            required
          >
            <option value="" disabled>Select Bank</option>
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

        {/* Account Number */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Account Number<span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            name="accountNumber"
            value={bankDetails.accountNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Amount</label>
          <input
            type="number"
            name="amount"
            value={bankDetails.amount}
            // onChange={handleChange}
            onChange={(e) => {
              let value = e.target.value;

              // ✅ Allow empty input
              if (value === "") {
                SetBankDetails((prev) => ({ ...prev, amount: "" }));
                return;
              }

              // ✅ Allow only numbers with up to 2 decimal places
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                SetBankDetails((prev) => ({ ...prev, amount: value }));
              }
            }}
            min="0"
            step="0.01"
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base no-arrows"
          />
        </div>

        {/* Phone Pay */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Phone Pay</label>
          <input
            type="checkbox"
            name="phonePay"
            checked={bankDetails.phonePay}
            onChange={handleChange}
            className="h-4 w-4"
          />
        </div>

        {/* Google Pay */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Google Pay</label>
          <input
            type="checkbox"
            name="googlePay"
            checked={bankDetails.googlePay}
            onChange={handleChange}
            className="h-4 w-4"
          />
        </div>

        {/* Paytm */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Paytm</label>
          <input
            type="checkbox"
            name="paytm"
            checked={bankDetails.paytm}
            onChange={handleChange}
            className="h-4 w-4"
          />
        </div>

        {/* Bhim UPI */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Bhim UPI</label>
          <input
            type="checkbox"
            name="bhimUpi"
            checked={bankDetails.bhimUpi}
            onChange={handleChange}
            className="h-4 w-4"
          />
        </div>

        {/* isActive */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Active Bank</label>
          <input
            type="checkbox"
            name="isActive"
            checked={bankDetails.isActive}
            onChange={handleChange}
            className="h-4 w-4"
          />
        </div>

        {/* Mobile Number */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Mobile Number<span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="number"
            name="mobileNumber"
            value={bankDetails.mobileNumber}
            onChange={(e) => {

              if (e.target.value.length <= 10) {
                handleChange(e);
              }
            }}
            min="0"
            className="md:w-2/4 w-full p-2 border rounded focus:outline-none text-sm sm:text-base no-arrows"
            required
          />

        </div>

        {/* Submit Button */}
        <div className=" flex justify-center md:justify-end col-span-1 md:col-span-2">
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
  )
}
