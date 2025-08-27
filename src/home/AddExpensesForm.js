import { useContext, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { UserContext } from '../context/UserProvider';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

export default function AddExpensesForm({ setAddLend, closeForm }) {
  const { user } = useContext(UserContext);
  const [correctdate, setCorrectDate] = useState(false);
  const [lend, setLend] = useState({
    email: "",
    lendDate: "",
    reason: "",
    amount: "",
    requirement: "",
    bank: "",
    returnDate: "",
    returnName: "",
    returnStatus: "",
  });

  const [decibleButton, setDecibleButton] = useState(false);

  const handleChange = (e) => {
    setCorrectDate(false);
    const { name, value } = e.target;
    setLend({ ...lend, [name]: value });
  };

  const submitMoney = async (e) => {
    e.preventDefault();
    setDecibleButton(true);
    toast.dismiss();
    if (
      new Date(lend.lendDate).setHours(0, 0, 0, 0) >
      new Date().setHours(0, 0, 0, 0)
    ) {
      setCorrectDate(true);
      setDecibleButton(false);
      return;
    }

    // console.log(lend);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseURL}/api/v1/add-lend`,
        lend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Lend borrow added successfully!");
      setAddLend(true);
      closeForm();
      setLend((prev) => ({
        ...prev,
        lendDate: "",
        reason: "",
        amount: "",
        requirement: "",
        bank: "",
        returnDate: "",
        returnName: "",
        returnStatus: "",
      }));
      // console.log(response);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setDecibleButton(false);
      setCorrectDate(false);
    }
  };

  useEffect(() => {
    if (user) {
      setLend((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl md:p-6 p-2">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Lend Borrow</h2>

      <form
        onSubmit={submitMoney}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-4"
      >
        {/* Date */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Lend Borrow Date <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="date"
            name="lendDate"
            value={lend.lendDate}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base"
            required
          />
          {correctdate && (
            <p className="text-red-600 text-xs sm:text-sm">
              Expense date is in the future.
            </p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Reason<span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            name="reason"
            value={lend.reason}
            onChange={handleChange}
            placeholder="Reason"
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Amount<span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="number"
            name="amount"
            value={lend.amount}
            // onChange={handleChange}
            onChange={(e) => {
              let value = e.target.value;

              // ✅ allow empty input
              if (value === "") {
                setLend({ ...lend, amount: "" });
                return;
              }

              // ✅ allow only up to 2 decimals
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                setLend({ ...lend, amount: value });
              }
            }}
            placeholder="Amount"
            className="w-full p-2 border rounded focus:outline-none no-arrows text-sm sm:text-base"
            required
            // min="0"
            step="0.01"
          />
        </div>

        {/* Requirement */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Requirement<span className="text-red-600 ml-1">*</span>
          </label>
          <select
            name="requirement"
            value={lend.requirement}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base"
            required
          >
            <option value="" disabled>Select Requirement</option>
            <option value="Compulsory">Compulsory</option>
            <option value="Required">Required</option>
            <option value="Optional">Optional</option>
          </select>
        </div>


        {/* Bank */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Bank<span className="text-red-600 ml-1">*</span>
          </label>
          <select
            name="bank"
            value={lend.bank}
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


        {/* Return Date */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Lend Borrow Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={lend.returnDate}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base"
          />
        </div>

        {/* Return Name */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Lend Borrow Return Name</label>
          <input
            type="text"
            name="returnName"
            value={lend.returnName}
            onChange={handleChange}
            placeholder="Return Name"
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base"
          />
        </div>

        {/* Return Status */}
        <div>
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Lend Borrow Return Status</label>
          <select
            name="returnStatus"
            value={lend.returnStatus}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none text-sm sm:text-base"
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={decibleButton}
            className={`w-full sm:w-auto bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 m-2 transition ${decibleButton
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[var(--legacy-interactive-color-hover)]"
              }`}
          >
            {decibleButton ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>




    </div>
  );
}
