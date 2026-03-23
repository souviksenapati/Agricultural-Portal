import React, { useState } from "react";
import { useApplicants } from "../../context/ApplicantContext";

export default function NewMember() {
    const { addApplicant } = useApplicants();

    const [formData, setFormData] = useState({
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        role: "Gramdoot",
        firstName: "",
        lastName: "",
        gender: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Mock current user (replace with AuthContext later)
    const currentUser = {
        id: 1,
        working_zone: { district_id: 10, block_id: 5 },
    };

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Validation
    const validate = () => {
        let newErrors = {};

        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.mobile) newErrors.mobile = "Mobile is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirmPassword)
            newErrors.confirmPassword = "Confirm your password";

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.gender) newErrors.gender = "Gender is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            const name = `${formData.firstName} ${formData.lastName}`.trim();

            // ✅ FIXED PAYLOAD (MATCHES BACKEND)
            await addApplicant(
                {
                    name,
                    aadhar_no: Date.now().toString(), // ✅ dummy unique aadhaar
                    mobile_no: formData.mobile, // ✅ correct key
                },
                currentUser
            );

            alert("Member registered successfully!");

            // Reset form
            setFormData({
                email: "",
                mobile: "",
                password: "",
                confirmPassword: "",
                role: "Gramdoot",
                firstName: "",
                lastName: "",
                gender: "",
            });

            setErrors({});
        } catch (err) {
            console.error("FULL ERROR:", err);
            alert("Failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full px-4 md:px-6 lg:px-8 py-10 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-md shadow-sm">
                <h1 className="text-2xl font-semibold text-gray-700 mb-8">
                    NEW MEMBER
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs">{errors.email}</p>
                            )}
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Mobile *
                            </label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            />
                            {errors.mobile && (
                                <p className="text-red-500 text-xs">{errors.mobile}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Password *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Role *
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            >
                                <option value="Gramdoot">Gramdoot</option>
                                <option value="ADA">ADA</option>
                            </select>
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-xs">{errors.firstName}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-xs">{errors.lastName}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Gender *
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-xs">{errors.gender}</p>
                            )}
                        </div>

                    </div>

                    {/* Submit */}
                    <div className="flex justify-center mt-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}