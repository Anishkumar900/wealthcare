import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserProvider";
import axios from "axios";
import LendBorrowEdit from "./LendBorrowEdit";
import { toast, Toaster } from "react-hot-toast";
import DeleteConfirmation from "../conformation/DeleteConfirmation";
import Loader from "../loader/Loader";

const baseURL = process.env.REACT_APP_API_BASE_URL;

export default function ShowLendBorrow({ addedLend, setAddLend }) {
  const [disableDeleteButton,setDisableDeleteButton]=useState(false);
  const [loader,setLoader]=useState(false);
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [selectedLend, setSelectedLend] = useState(null); // ✅ track which row to delete
  const [lend, setLend] = useState([]);
  const [editExpenses, setEditExpenses] = useState({
    id: 0,
    amount: null,
    bank: "",
    lendDate: "",
    reason: "",
    requirement: "",
    returnName: "",
    returnDate: "",
    returnStatus: "",
  });
  const [showEditExpenses, setShowEditExpenses] = useState(false);

  const handleEdit = (id) => {
    const expenseToEdit = lend.find((exp) => exp.id === id);
    if (!expenseToEdit) {
      toast.error("Something went wrong!");
      return;
    }
    setEditExpenses({
      id: expenseToEdit.id,
      amount: expenseToEdit.amount,
      bank: expenseToEdit.bank,
      lendDate: expenseToEdit.lendDate,
      reason: expenseToEdit.reason,
      requirement: expenseToEdit.requirement,
      returnName: expenseToEdit.returnName,
      returnDate: expenseToEdit.returnDate,
      returnStatus: expenseToEdit.returnStatus,
    });
    setShowEditExpenses(true);
  };

  const handleDelete = async () => {
    if (!selectedLend) return;
    const id = selectedLend.id;
    setDisableDeleteButton(true);
    toast.dismiss();

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/api/v1/delete-lend`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id }, // ✅ send only the ID
      });

      // ✅ Update UI
      setDisableDeleteButton(false);
      setLend((prev) => prev.filter((exp) => exp.id !== id));
      toast.success("Record deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete record!");
    } finally {
      setOpen(false);
      setSelectedLend(null);
      setDisableDeleteButton(false)
    }
  };

  const handleUpdateExpense = (updatedExpense) => {
    setLend((prev) => prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp)));
    setShowEditExpenses(false);
  };

  const formatValue = (val) =>
    val === null || val === undefined || (typeof val === "string" && val.trim() === "")
      ? "---"
      : val;

  const fetchExpenses = async () => {
    setLoader(true);
    if (!user) return setLoader(false);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/v1/get-lend`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setLend(response.data);
      setLoader(false);
    } catch {
      // ignore
      setLoader(false);
    }
  };

  useEffect(() => {
    
    fetchExpenses();
  }, [user]);

  useEffect(() => {
    
    if (addedLend) {
      fetchExpenses().then(() => setAddLend(false));
    }
  }, [addedLend, setAddLend,setLoader]);

  if(loader) return <Loader/>;

  return (
    <div className="md:p-4 p-1">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-xl font-semibold mb-4">My Lend Borrow</h2>

      {lend.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Bank</th>
                <th className="border p-2">Lend Date</th>
                <th className="border p-2">Reason</th>
                <th className="border p-2">Requirement</th>
                <th className="border p-2">Return Name</th>
                <th className="border p-2">Return Date</th>
                <th className="border p-2">Return Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lend.map((exp) => (
                <tr key={exp.id} className="text-center">
                  <td className="border p-2">{exp.id}</td>
                  <td className="border p-2">{exp.amount}</td>
                  <td className="border p-2">{formatValue(exp.bank)}</td>
                  <td className="border p-2">{formatValue(exp.lendDate)}</td>
                  <td className="border p-2">{formatValue(exp.reason)}</td>
                  <td className="border p-2">{formatValue(exp.requirement)}</td>
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
                      onClick={() => {
                        setSelectedLend(exp); // ✅ remember which one
                        setOpen(true);
                      }}
                      disabled={disableDeleteButton}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Single modal outside the map */}
          <DeleteConfirmation
            isOpen={open}
            onClose={() => {
              setOpen(false);
              setSelectedLend(null);
            }}
            onConfirm={handleDelete}
            itemName={
              selectedLend
                ? `${selectedLend.reason || "Lend record"} — ₹${Number(selectedLend.amount).toFixed(2)}`
                : "Lend record"
            }
          />
        </div>
      ) : (
        <p className="text-center text-red-600">No Lend Borrow found.</p>
      )}

      {showEditExpenses && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-h-[90vh] w-[90%] md:w-[70%] lg:w-[60%] overflow-y-auto bg-white rounded-xl shadow-lg p-4">
            <button
              onClick={() => setShowEditExpenses(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
            >
              ✕
            </button>
            <LendBorrowEdit
              editExpenses={editExpenses}
              onUpdateExpense={handleUpdateExpense}
            />
          </div>
        </div>
      )}
    </div>
  );
}
