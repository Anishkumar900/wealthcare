import { useContext, useEffect, useState } from "react";
import Loader from "../loader/Loader";
import { UserContext } from "../context/UserProvider";
import { CgProfile } from "react-icons/cg";
import EditProfileForm from "./EditProfileForm";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import DeleteConfirmation from "../conformation/DeleteConfirmation";

const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function ProfileCart() {
    const { user } = useContext(UserContext);
    const [loader, setLoader] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [disableDeleteButton, setDisableDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setLoader(true);
        if (user) {
            setUserDetails(user);
        }
        setLoader(false);
    }, [user]);

    const editProfile = () => {
        // console.log("edit");
        setShowForm(true)
    }

    const deleteProfile = async () => {
        setDisableDeleteButton(true);
        toast.dismiss();
        // setOpen(true);
        // console.log("test")
        // setOpen(false);
        const token = localStorage.getItem("token");
        await axios.delete(`${baseURL}/api/v1/delete-user/${user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                toast.success("Delete Profile Successful!")
                setTimeout(() => {
                    localStorage.removeItem("token");
                    navigate("/");
                    setDisableDeleteButton(false);
                    setOpen(false);
                }, 1000)
                // console.log(response)
            })
            .catch((error) => {
                toast.error("Something went wrong!")
                setDisableDeleteButton(false);
                setOpen(false);
                // console.log(error)
            })

    }

    // console.log(userDetails);
    // console.log(user,"test")
    useEffect(() => {
        if (showForm) {
            document.body.classList.add("overflow-hidden"); // ❌ disable background scroll
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        // cleanup
        return () => document.body.classList.remove("overflow-hidden");
    }, [showForm]);

    if (loader) return <Loader />;

    return (

        <div className="pt-16">
            <Toaster position="top-right" reverseOrder={false} />
            <div className=" flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-100">
                <div className="bg-white shadow-xl rounded-2xl p-6 w-80 flex flex-col items-center m-4">
                    {userDetails?.profileImage ? (
                        <img
                            src={userDetails.profileImage}
                            alt="Profile"
                            className="rounded-full w-24 h-24 object-cover shadow-md border-2 border-purple-300"
                        />
                    ) : (
                        <CgProfile className="w-24 h-24 text-gray-400 rounded-full bg-gray-100 p-2 shadow-md" />
                    )}

                    <h2 className="mt-4 text-xl font-semibold text-gray-800">
                        {userDetails?.name || "No Name"}
                    </h2>

                    <div className="mt-4 w-full space-y-3">
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span className="font-medium">Mobile</span>
                            <span>{userDetails?.phoneNumber || "----"}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span className="font-medium">Email</span>
                            <span>{userDetails?.email || "----"}</span>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <button
                        onClick={editProfile}
                        className="mt-6 px-6 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition"
                    >
                        Edit Profile
                    </button>

                    <button
                        // onClick={deleteProfile}
                        onClick={() => setOpen(true)}
                        disabled={disableDeleteButton}
                        className={`mt-6 px-6 py-2 text-white rounded-lg shadow-md ${disableDeleteButton ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"} transition`}
                    >
                        {disableDeleteButton ? "Deleting... " : "Delete Profile"}
                    </button>

                </div>
            </div>
            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                isOpen={open}
                itemName="Profile"
                onClose={() => setOpen(false)}
                onConfirm={deleteProfile} // ✅ call final delete function
            />

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
                        {/* Close button */}
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        {/* Form Component */}
                        <EditProfileForm
                            userDetails={userDetails}
                            setUserDetails={setUserDetails}
                            closeForm={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}



        </div>


    )
}
