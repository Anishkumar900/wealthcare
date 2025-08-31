import axios from 'axios';
import {useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loader from '../loader/Loader';

const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  const [loader,setLoader]=useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(true);



  const [decibleButton, setDecibleButton] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((pre) => ({
      ...pre, [name]: value
    }))

  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(form)
    toast.dismiss();
    setDecibleButton(true);

    try {
      const response = await axios.post(`${baseURL}/api/auth/v1/login`,
        form,
        { headers: { "Content-Type": "application/json" } }
      )

      // console.log(response.data)
      toast.success("Login successful.");
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        navigate("/home");
      }, 1000)
    }
    catch (error) {
      // console.log(error)
      toast.error("Invalid input. Please try again.");
    }
    finally {
      setDecibleButton(false)
    }

  }

  useEffect(() => {
    // console.log(process.env.REACT_APP_API_BASE_URL);
    const fetchData = async () => {
      toast.dismiss();
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/"); // no token → go to login
        return;
      }

      try {
        setLoader(true);
        const jwt = { token };
        const response = await axios.post(
          `${baseURL}/api/auth/v1/jwt-verify`,
          jwt,
          { headers: { "Content-Type": "application/json" } }
        );

        // console.log(response);

        // token valid → go to home page
        if (response.status === 200) {
          // setUser(response.data);
          setLoader(false)
          navigate("/home"); // or your desired route
        }
      } catch (error) {
        // token invalid → clear and go to login
        // console.error("JWT verification failed:", error);
        localStorage.removeItem("token");
        setLoader(false);
        navigate("/");
      }
    };

    fetchData();
  }, [navigate,loader]);

  if(loader) return <Loader/>

  return (
    <div className='min-h-screen w-full bg-slate-100 lg:px-40  pt-3'>
      <Toaster position="top-right" reverseOrder={false} />
      <p className='text-center font-semibold lg:text-3xl text-xl lg:pb-10 pb-4 align-baseline'>Wealth Care</p>
      <form className="bg-white shadow-sm md:p-4 p-2 rounded mt-20 lg:mt-0" onSubmit={handleSubmit}>
        <p className='text-center font-medium py-2'>Welcome to Wealth Care – Please Login</p>

        <label className='flex pb-2'>Email <p className='text-xl pl-1 text-red-600'>*</p></label>
        <input
          type='email'
          required
          placeholder='Enter email id'
          name='email'
          value={form.email}
          onChange={handleChange}
          className='border focus:outline-none rounded p-2 w-full'
        />

        <label className='flex p-2'>Enter Password <p className='text-xl pl-1 text-red-600'>*</p></label>

        <div className=' relative w-full'>
          <input
            type={showPassword ? "password" : "text"}
            required
            placeholder='Password'
            name='password'
            value={form.password}
            onChange={handleChange}
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

        <div className="flex justify-center pb-2 pt-5">
          <button
            type="submit"
            disabled={decibleButton}
            className={`bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 transition ${decibleButton
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[var(--legacy-interactive-color-hover)]"
              }`}
          >
            {decibleButton ? "Processing..." : "Login"}
          </button>
        </div>

        <div className=' flex justify-between pt-2'>
          <Link className="hover:underline text-blue-800 hover:text-blue-900 transition-colors px-2" to="/auth/register">
            Register
          </Link>
          <Link className="hover:underline text-blue-800 hover:text-blue-900 transition-colors px-2" to="/auth/forget-password">
            ForgetPassword
          </Link>
        </div>

      </form>
    </div>

  )
}
