import React, { useState, useEffect } from 'react'
import Header from '../bar/Header'
import Footer from '../bar/Footer'
import { useNavigate } from 'react-router-dom'
import AddBankForm from './AddBankForm';
import axios from 'axios';
import BankCart from './BankCart';

const baseURL = process.env.REACT_APP_API_BASE_URL;

export default function Bank() {
  const navigate = useNavigate();
  const [decibleExpensesButton, setDecibleExpensesButton] = useState(false);
  const [disableAddBankButton, setDisableAddBankButton] = useState(false);
  const [allBank, setAllBank] = useState([]);

  const expensesSection = () => {
    navigate("/home");
    setDecibleExpensesButton(true);
  };

  const addBank = () => {
    setDisableAddBankButton(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${baseURL}/api/v1/all-bank`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data);
        setAllBank(response.data);
      } catch (error) {
        // console.error(error);
      }
    };

    fetchData();
  }, [navigate]); // ✅ avoid infinite loop

  useEffect(() => {
    if (disableAddBankButton) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [disableAddBankButton]);

  return (
    <>
      <Header />
      <div className="pt-16">
        <button
          className={` bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 m-4 transition ${decibleExpensesButton
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[var(--legacy-interactive-color-hover)]"
            }`}
          onClick={expensesSection}
          disabled={decibleExpensesButton}
        >
          Expense Details
        </button>
        <button
          className={` bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 m-4 transition ${disableAddBankButton
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[var(--legacy-interactive-color-hover)]"
            }`}
          disabled={disableAddBankButton}
          onClick={addBank}
        >
          Add Bank
        </button>

        {disableAddBankButton && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="relative max-h-[90vh] w-[90%] md:w-[70%] lg:w-[60%] overflow-y-auto bg-white rounded-xl shadow-lg p-4">
              <button
                onClick={() => setDisableAddBankButton(false)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-600 text-xl font-semibold"
              >
                ✕
              </button>
              <AddBankForm setDisableAddBankButton={setDisableAddBankButton} onBankAdded={(newBank)=>setAllBank((pre)=>[...pre,newBank])}/>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Bank list rendering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 m-2">
        {allBank.length > 0 ? (
          allBank.map((bank, index) => (
            <BankCart key={index} bank={bank} 
            onBankDeleted={(id) =>
          setAllBank((prev) => prev.filter((b) => b.id !== id))
        }
        
        />
          ))
        ) : (
          <p className="text-red-600 text-center col-span-full">No Bank Added</p>
        )}
      </div>

      <Footer />
    </>
  );
}
