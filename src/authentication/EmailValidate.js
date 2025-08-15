import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './EmailValidate.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function EmailValidate() {

    const location = useLocation();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        otp: ""
    })
    const [correctOTP, setCorrectOTP] = useState(false);

    const [decibleButton, setDecibleButton] = useState(false);


    const handleSubmit = async(e) => {
        e.preventDefault();
        // console.log(form)
        setDecibleButton(true);
        toast.dismiss();
        if (form.otp.length !== 4) {
            setCorrectOTP(true)
            setDecibleButton(false);
            return;
        }

        try {

            await axios.post(
                `${baseURL}/api/auth/v1/verify-email`,
                form, // plain JSON
                { headers: { "Content-Type": "application/json" } }
            );

            toast.success("Registration successful!");
            setTimeout(()=>{
                navigate("/auth/login")
            },1000)
        } catch (error) {
            // console.error(error); // helpful for debugging
            toast.error("Wrong OTP");
        } finally {
            setDecibleButton(false);
            setCorrectOTP(false)
        }

    }

    const resendOTP = async () => {
        setDecibleButton(true);
        toast.dismiss();
        // console.log(form)
        try {

            await axios.post(
                `${baseURL}/api/auth/v1/send-otp`,
                form, // plain JSON
                { headers: { "Content-Type": "application/json" } }
            );

            toast.success("OTP sent successfully");
        } catch (error) {
            // console.error(error); // helpful for debugging
            toast.error("Something went wrong");
        } finally {
            setDecibleButton(false);
        }
    };



    useEffect(() => {
        // Check if location.state is missing or email is missing
        if (!location.state || !location.state.email) {
            navigate("/auth/register");
        } else {
            // console.log(location.state.email)
            setForm(prev => ({
                ...prev,
                email: location.state.email
            }));
        }
    }, [location.state, navigate]);

    return (
        <div className='min-h-screen w-full bg-slate-100 lg:px-40  pt-3'>
            <Toaster position="top-right" reverseOrder={false} />
            <p className='text-center font-semibold lg:text-3xl text-xl lg:pb-10 pb-4 align-baseline'>Wealth Care</p>

            <form className="bg-white shadow-sm md:p-4 p-2 rounded" onSubmit={handleSubmit}>
                <p className="text-center text-gray-700 pt-4 leading-relaxed md:text-base text-sm">
                    Validate your email. We’ve sent an OTP to
                    <span className="font-semibold text-gray-900 ml-1 underline">{form.email}</span>
                    <span className="text-gray-600"> email ID</span>.
                </p>


                <label className="flex items-center mt-3">
                    OTP<span className="text-red-600 font-semibold px-1">*</span>
                </label>

                <input
                    name="otp"
                    value={form.otp}
                    type="number"
                    placeholder="Enter OTP"
                    required
                    onChange={(e) => {
                        setCorrectOTP(false)
                        const value = e.target.value;
                        if (value.length <= 4) {
                            setForm(pre => ({ ...pre, otp: value }))
                        }
                    }}
                    className="focus:outline-none border p-2 rounded w-full no-arrows"
                />
                {
                    correctOTP && <p className='text-sm font-normal mt-1 text-red-600'>Invalid OTP</p>
                }

                <div
                    className={`flex justify-center text-sm font-medium hover:underline pb-1 pt-3 text-blue-500 cursor-pointer ${decibleButton ? "pointer-events-none opacity-50" : ""
                        }`}
                    onClick={!decibleButton ? resendOTP : undefined}
                >
                    Resend OTP
                </div>


                <div className="flex justify-center py-2">
                    <button
                        type="submit"
                        disabled={decibleButton}
                        className={`bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 transition ${decibleButton
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[var(--legacy-interactive-color-hover)]"
                            }`}
                    >
                        {decibleButton ? "Processing..." : "Verify OTP"}
                    </button>
                </div>


                <div className="flex justify-center pt-3  text-sm font-medium">
                    Already have an account?
                    <Link className="hover:underline text-blue-800 hover:text-blue-900 transition-colors px-2" to="/auth/login">
                        Login
                    </Link>
                </div>
            </form>


        </div>
    )
}
