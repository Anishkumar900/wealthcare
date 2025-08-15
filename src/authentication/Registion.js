import React, { useState } from 'react'
import './Registion.css';
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function Registion() {
  const [from, setFrom] = useState({
    name: "",
    email: "",
    deathOfBirth: "",
    password: "",
    profileImage: null
  })

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const [strongPassword, setStrongPassword] = useState(false);
  const [profileImageSize, setProfileImageSize] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(false)
  const [decibleButton, setDecibleButton] = useState(false);


  const handleChange = (e) => {
    setStrongPassword(false)
    setDateOfBirth(false)
    setDecibleButton(false);
    const { name, value } = e.target;
    setFrom((pre) => ({
      ...pre, [name]: value
    }));

  }

  const handleFileChange = (e) => {
    setDecibleButton(false);
    setProfileImageSize(false)
    setFrom((pre) => ({
      ...pre, profileImage: e.target.files[0]
    }));

  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(from)
    setDecibleButton(true);
    toast.dismiss();

    try {

      if (from.profileImage && from.profileImage.size > 1024 * 1024) {
        setProfileImageSize(true)
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
      if (!passwordRegex.test(from.password)) {
        setStrongPassword(true)
        return;
      }

      const deathOfBirth = new Date(from.deathOfBirth);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (deathOfBirth >= yesterday) {
        setDateOfBirth(true)
        return;
      }


      const formData = new FormData();

      // Append JSON object for user
      const userObj = {
        name: from.name,
        email: from.email,
        deathOfBirth: from.deathOfBirth,
        password: from.password
      };
      formData.append("user", new Blob([JSON.stringify(userObj)], { type: "application/json" }));

      // Append file if present
      if (from.profileImage) {
        formData.append("profileImage", from.profileImage);
      }

      const response = await axios.post(
        `${baseURL}/api/auth/v1/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // console.log("✅ Server Response:", response.data);
      // console.log(response);
      toast.success("Please verify your email.");
      // Registration successful!
      setDecibleButton(false);
      setTimeout(() => {
        navigate("/auth/email-validate", { state: { email: response.data.email } });
      }, 1000);
    } catch (error) {
      // console.error("❌ Error submitting form:", error);
      setDecibleButton(false);
      if (error.response.status === 409) {
        toast.error("User already exists!");
      } else {
        toast.error("Error submitting form. Please try again.");
      }
    }


  }



  return (
    <div className='min-h-screen w-full bg-slate-100 lg:px-40  pt-3'>
      <Toaster position="top-right" reverseOrder={false} />
      <p className='text-center font-semibold lg:text-3xl text-xl lg:pb-10 pb-4 align-baseline'>Wealth Care</p>
      <form onSubmit={handleSubmit} className='border rounded-md  border-solid border-black-700 bg-white lg:p-4 p-2'>
        <p className="text-center pb-8 text-lg lg:text-xl font-bold tracking-wide underline underline-offset-8 decoration-4 decoration-cyan-400 drop-shadow-md bg-gradient-to-r from-teal-500 to-cyan-500 text-transparent bg-clip-text">
          Sign up for <span className="from-cyan-600 to-teal-600 bg-gradient-to-r text-transparent bg-clip-text">Start Your Money Journey</span>
        </p>



        <div className="space-y-4">
          {/* Full Name */}
          <div className="items-center gap-4 space-y-3">
            <label className="w-40 font-medium flex">
              Enter Full Name
              <p className="text-red-600 font-bold pl-1">*</p>
            </label>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              type="text"
              value={from.name}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="items-center gap-4 space-y-3">
            <label className="w-40 font-medium flex">
              Enter Email
              <p className="text-red-600 font-bold pl-1">*</p>
            </label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="Email"
              required
              value={from.email}
              className="w-full border rounded px-3 py-2 focus:outline-none"
            />
          </div>


          <div className="space-y-3">
            <label className="w-40 font-medium flex">
              Enter Password
              <p className="text-red-600 font-bold pl-1">*</p>
            </label>

            <div className="relative w-full">
              <input
                name="password"
                type={showPassword ? "password" : "text"}
                onChange={handleChange}
                placeholder="Password"
                required
                value={from.password}
                className="w-full border rounded px-3 py-2 pr-10 focus:outline-none"
              />

              {
                strongPassword && <p className='text-sm font-normal mt-1 text-red-600'>Please enter a stronger password!</p>
              }



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
          </div>


          {/* deathOfBirth */}
          <div className="items-center gap-4 space-y-3">
            <label className="w-40 font-medium flex">
              Date of Birth
              <p className="text-red-600 font-bold pl-1">*</p>
            </label>
            <input
              name="deathOfBirth"
              type="date"
              onChange={handleChange}
              required
              value={from.deathOfBirth}
              className="w-full border rounded px-3 py-2 focus:outline-none"
            />
            {
              dateOfBirth && <p className='text-sm font-normal mt-1 text-red-600'>Please enter a correct DOB!</p>
            }
          </div>

          {/* Profile Image - Full width & no flex */}
          <div className="space-y-3">
            <label className="w-40 font-medium">Profile Image</label>
            <input
              name="profileImage"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border rounded px-3 py-1 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />

            {profileImageSize && (
              <p className="mt-1 text-sm font-normal text-red-600">
                Please upload a file smaller than 1 MB!
              </p>
            )}

          </div>

          {/* Submit Button */}
          <div className="flex justify-center py-2">
            <button
              type="submit"
              disabled={decibleButton}
              className={`bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 transition ${decibleButton
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[var(--legacy-interactive-color-hover)]"
                }`}
            >
              {decibleButton ? "Processing..." : "Register"}
            </button>
          </div>
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
