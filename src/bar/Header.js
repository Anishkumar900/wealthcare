import React, { useContext, useState, useEffect } from 'react';
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";
import { UserContext } from '../context/UserProvider';
import { useNavigate } from 'react-router-dom';


export default function Header() {
  const { user } = useContext(UserContext);
  const [showOption, setShowOption] = useState(false);
  const [profile, setProfile] = useState({ name: "", profileImage: "" });
  const navigate = useNavigate();

  const toggleDropdown = () => setShowOption((prev) => !prev);

  const logout=()=>{
    localStorage.removeItem("token");
    navigate("/");
  }

  useEffect(() => {
    if (user?.name) {
      setProfile({
        name: user.name.split(" ")[0],
        profileImage: user.profileImage || ""
      });
    }
  }, [user]);

  return (
    <>
      {/* Top Header */}
      <div className="shadow-md flex justify-between px-1 md:px-5 fixed w-full z-50 bg-white">
        {/* Logo */}
        <img
          src="/image/logo.png"
          alt="Wealth Care logo"
          className="round w-16 h-16 cursor-pointer"
        />

        {/* Profile Section */}
        <div className="flex items-center relative">
          <span className="md:font-semibold px-1 md:px-5 font-serif">
            Hello {profile.name}
          </span>

          {profile.profileImage === "" ? (
            <CgProfile
              size={32}
              className="cursor-pointer"
              onClick={toggleDropdown}
            />
          ) : (
            <button
              onClick={toggleDropdown}
              className="border-2 rounded-full cursor-pointer overflow-hidden"
            >
              <img
                src={profile.profileImage}
                alt="Profile"
                className="rounded-full h-10 w-10 p-1"
              />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {showOption && (
        <div className="fixed right-4 top-20 bg-black text-white rounded-md shadow-lg p-3 w-40">
          <button className="w-full text-left hover:bg-gray-800 px-2 py-1 rounded">
            Profile
          </button>
          <button className="w-full text-left hover:bg-gray-800 px-2 py-1 rounded flex items-center" onClick={logout}>
            Logout
            <TbLogout2 className="ml-2" />
          </button>
        </div>
      )}
    </>
  );
}
