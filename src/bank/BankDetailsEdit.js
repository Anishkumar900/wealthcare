import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function BankDetailsEdit({ editedBank, setEditedBank, setBankEditFormShow }) {
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [bankDetails, SetBankDetails] = useState({
        id: null,
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
        const { name, type, value, checked } = e.target;
        SetBankDetails((pre) => ({
            ...pre, [name]: type === "checkbox" ? checked : value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        toast.dismiss();
        setDisableSubmitButton(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(`${baseURL}/api/v1/edit-bank`, bankDetails, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            toast.success("Bank updated successful!")
            setTimeout(() => {
                setEditedBank(bankDetails);
                setBankEditFormShow(false);
            }, [1500])
        }
        catch (error) {
            toast.error("Something went wrong!")
            console.log(error);
        }
        finally {
            
        }
        // console.log(bankDetails);
        // setEditedBank(bankDetails);
        // toast.success("Bank updated successful!")
        // setTimeout(() => {
        //     
        // }, [1500])


    }

    useEffect(() => {
        if (editedBank) {
            SetBankDetails({
                id: editedBank.id,
                accountHolderName: editedBank.accountHolderName,
                bankName: editedBank.bankName,
                accountNumber: editedBank.accountNumber,
                amount: editedBank.amount,
                phonePay: editedBank.phonePay,
                googlePay: editedBank.googlePay,
                paytm: editedBank.paytm,
                bhimUpi: editedBank.bhimUpi,
                mobileNumber: editedBank.mobileNumber,
                isActive: editedBank.isActive
            })
        }
    }, [editedBank])
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
