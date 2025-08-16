import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function ForgetPassword() {

  const navigate = useNavigate();

  const [form, setFrom] = useState({
    email: "",
    password: "",
    otp: ""
  })

  const [showOTP, setShowOTP] = useState(false);

  const [strongPassword, setStrongPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(true)

  const [decibleButton, setDecibleButton] = useState(false)

  const handleChange = (e) => {
    setStrongPassword(false);
    const { name, value } = e.target;
    setFrom((pre) => ({
      ...pre, [name]: value
    }))
  }

  const otpHandler = (e) => {

    const value = e.target.value;
    if (value.length <= 4) {
      setFrom((pre) => ({
        ...pre, otp: value
      }))
    }

  }

  const resendOTP = async () => {
    // console.log(form);
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
      toast.error("Something went wrong");
    } finally {
      setDecibleButton(false);
    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setDecibleButton(true);
    toast.dismiss();
    // console.log(form);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setStrongPassword(true);
      setDecibleButton(false);
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/auth/v1/forget-password`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );
      // console.log(response);

      if (form.otp == "") {
        toast.success("Please verify your email first!");
        setShowOTP(true);
        setDecibleButton(false);
        return;
      }

      toast.success("Password updated successfully! Please login with your new password.");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      // console.log(error.response.data);
      if(error.response.data == "OTP didn't match or expired"){
        toast.error("OTP didn't match or expired");
        setDecibleButton(false);
        return;
      }
      toast.error("Please enter correct email.");
    } finally {
      setDecibleButton(false);
    }
  };

  return (
    <div className='min-h-screen w-full bg-slate-100 lg:px-40  pt-3'>
      <Toaster position="top-right" reverseOrder={false} />
      <p className='text-center font-semibold lg:text-3xl text-xl lg:pb-10 pb-4 align-baseline'>Wealth Care</p>
      <form onSubmit={handleSubmit} className='border rounded-md  border-solid border-black-700 bg-white lg:p-4 p-2'>
        <p className='text-center font-medium py-2'>Welcome to Wealth Care – Forget Password</p>

        <label className='flex pb-2'>Email <p className='text-xl pl-1 text-red-600'>*</p></label>
        <input
          type='email'
          required
          placeholder='Enter email id'
          name='email'
          value={form.email}
          onChange={handleChange}
          disabled={showOTP}
          className='border focus:outline-none rounded p-2 w-full'
        />

        <label className='flex p-2'>Enter New Password <p className='text-xl pl-1 text-red-600'>*</p></label>

        <div className=' relative w-full'>
          <input
            type={showPassword ? "password" : "text"}
            required
            placeholder='Password'
            name='password'
            value={form.password}
            onChange={handleChange}
            disabled={showOTP}
            className='border focus:outline-none rounded p-2 w-full'
          />

          {showPassword ? (
            <IoMdEyeOff
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}



        </div>

        {
          strongPassword && <p className='text-sm font-normal mt-1 text-red-600'>Please enter a stronger password!</p>
        }




        {showOTP && (
          <div>
            <label className="flex items-center mt-3">
              OTP<span className="text-red-600 font-semibold px-1">*</span>
            </label>
            <input
              name="otp"
              value={form.otp}
              type="number"
              placeholder="Enter OTP"
              required
              onChange={otpHandler}
              className="focus:outline-none border p-2 rounded w-full no-arrows"
            />

            <div
              className={`flex justify-center text-sm font-medium hover:underline pb-1 pt-3 text-blue-500 cursor-pointer ${decibleButton ? "pointer-events-none opacity-50" : ""
                }`}
              onClick={!decibleButton ? resendOTP : undefined}
            >
              Resend OTP
            </div>
          </div>)
        }

        <div className="flex justify-center pb-2 pt-5">
          <button
            type="submit"
            disabled={decibleButton}
            className={`bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 transition ${decibleButton
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[var(--legacy-interactive-color-hover)]"
              }`}
          >
            {decibleButton ? "Processing..." : "Reset Password"}
          </button>
        </div>

        <div className=' flex justify-between pt-2'>
          <Link className="hover:underline text-blue-800 hover:text-blue-900 transition-colors px-2" to="/auth/register">
            Register
          </Link>
          <Link className="hover:underline text-blue-800 hover:text-blue-900 transition-colors px-2" to="/">
            login
          </Link>
        </div>

      </form>
    </div>
  )
}
