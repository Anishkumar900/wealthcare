import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from 'react-hot-toast';

const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function EditProfileForm({ userDetails, setUserDetails, closeForm }) {
    const [disableButton, setDisableButton] = useState(false);
    const [form, setForm] = useState({
        email: "",
        name: "",
        phoneNumber: "",
        deathOfBirth: "",   // ✅ not dateOfBirth
        profileImage: "",
        newProfileImage: ""
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "newProfileImage" && files?.length > 0) {
            setForm({ ...form, newProfileImage: e.target.files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();
        setDisableButton(true);
        // console.log("Form Data:", form);
        const token = localStorage.getItem("token");
        try {
            if (form.newProfileImage && form.newProfileImage.size > 1024 * 1024) {
                setDisableButton(false);
                toast.error("Please upload less than 1 MB")
                return;
            }
            const deathOfBirth = new Date(form.deathOfBirth);
            const previousDob = new Date(userDetails.deathOfBirth);

            if (deathOfBirth > previousDob) {
                setDisableButton(false);
                toast.error("DOB must be earlier than the previous one!");
                return;
            }


            if (form.phoneNumber.length !== 10) {
                setDisableButton(false);
                toast.error("Invalid mobile number!");
                return;
            }

            const formData = new FormData();

            const obj = {
                email: form.email,
                name: form.name,
                phoneNumber: form.phoneNumber,
                deathOfBirth: form.deathOfBirth,
                profileImage: form.profileImage,
            };

            // ✅ Append JSON as `updateProfile`
            formData.append(
                "updateProfile",
                new Blob([JSON.stringify(obj)], { type: "application/json" })
            );

            // ✅ Append file if selected
            if (form.newProfileImage) {
                formData.append("newProfileImage", form.newProfileImage);
            }
            console.log(form.newProfileImage);
            await axios.patch(`${baseURL}/api/v1/update-profile`,
                formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" 
                },
            }
            )
            setUserDetails((prev) => ({
                ...prev,
                ...form,
            }));

            // ✅ Toast first, then close form
            toast.success("Profile updated!");
            setTimeout(() => {
                closeForm();
            }, 1000);
        }
        catch (error) {
            toast.error("Something went wrong!");
        }
        finally {
            setDisableButton(false);
        }



        // update parent user details
        // setUserDetails((prev) => ({
        //     ...prev,
        //     ...form,
        // }));

        // alert("Profile updated successfully!");
        // closeForm();
    };

    // Populate form with existing user details
    useEffect(() => {
        if (userDetails) {
            setForm({
                email: userDetails.email,
                name: userDetails.name || "",
                phoneNumber: userDetails.phoneNumber || "",
                deathOfBirth: userDetails.deathOfBirth || "", // ✅ correct mapping
                profileImage: userDetails.profileImage || "",
            });
        }
    }, [userDetails]);


    // console.log(form.deathOfBirth)
    // console.log(form.name);
    // console.log(userDetails.deathOfBirth);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-100 p-6">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Edit Profile
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Profile Image Preview */}
                    {form.profileImage && (
                        <div className="flex justify-center">
                            <img
                                src={form.profileImage}
                                alt="Profile Preview"
                                className="w-20 h-20 rounded-full object-cover shadow-md"
                            />
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Phone Number<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="phoneNumber"
                            value={form.phoneNumber || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                // ✅ Allow only numbers & max 10 digits
                                if (/^\d{0,10}$/.test(value)) {
                                    handleChange(e);
                                }
                            }}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none no-arrows"
                            placeholder="Enter phone number"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Date of Birth<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="deathOfBirth"
                            value={form.deathOfBirth || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                            required
                        />
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            name="newProfileImage"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full px-2 py-1 border rounded-lg focus:outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={disableButton} // ✅ disable button
                        className={`w-full py-2 rounded-lg font-medium shadow-md transition 
                          ${disableButton ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 text-white hover:bg-purple-600"}`}
                    >
                        {disableButton ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}