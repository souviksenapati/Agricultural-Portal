import React, { useState, useEffect } from "react";
import { createAgent } from "../../api/client"; // ✅ Correct API
import { useDataDirs } from "../../context/DataDirsContext";

export default function NewMember() {
    const { districts, blocks, gramPanchayats, loading: dataLoading } = useDataDirs();

    const [formData, setFormData] = useState({
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        role: "Gramdoot",
        firstName: "",
        lastName: "",
        gender: "",
        district_id: "",
        block_id: "",
        gram_panchayat_id: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const currentUser = {
        id: 1,
        working_zone: { district_id: 10, block_id: 5 },
    };

    // Get available districts based on role
    const getAvailableDistricts = () => {
        if (formData.role === "ADA") {
            return districts.filter((d) => d.id === currentUser.working_zone.district_id);
        } else if (formData.role === "Gramdoot") {
            return districts;
        }
        return [];
    };

    // Get available blocks based on selected district
    const getAvailableBlocks = () => {
        if (formData.district_id) {
            return blocks.filter((b) => b.district_id === Number(formData.district_id));
        }
        return [];
    };

    // Get available GPs based on selected block
    const getAvailableGPs = () => {
        if (formData.block_id) {
            return gramPanchayats.filter((g) => g.block_id === Number(formData.block_id));
        }
        return [];
    };

    // Handle role change - auto-select ADA district if ADA role
    useEffect(() => {
        if (formData.role === "ADA" && districts.length > 0) {
            const adaDistrict = districts.find((d) => d.id === currentUser.working_zone.district_id);
            if (adaDistrict) {
                setFormData((prev) => ({
                    ...prev,
                    district_id: adaDistrict.id,
                    block_id: "",
                    gram_panchayat_id: "",
                }));
            }
        } else if (formData.role === "Gramdoot") {
            setFormData((prev) => ({
                ...prev,
                district_id: "",
                block_id: "",
                gram_panchayat_id: "",
            }));
        }
    }, [formData.role, districts.length]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "role") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                district_id: "",
                block_id: "",
                gram_panchayat_id: "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleDistrictChange = (e) => {
        const district_id = Number(e.target.value) || "";
        setFormData((prev) => ({
            ...prev,
            district_id,
            block_id: "",
            gram_panchayat_id: "",
        }));
    };

    const handleBlockChange = (e) => {
        const block_id = Number(e.target.value) || "";
        setFormData((prev) => ({
            ...prev,
            block_id,
            gram_panchayat_id: "",
        }));
    };

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
        if (!formData.district_id) newErrors.district_id = "District is required";
        if (!formData.block_id) newErrors.block_id = "Block is required";
        if (!formData.gram_panchayat_id) newErrors.gram_panchayat_id = "Gram Panchayat is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            const result = await createAgent({
                email: formData.email,
                password: formData.password,
                mobile: formData.mobile,

                role_id: formData.role === "Gramdoot" ? 8 : 7,

                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,

                // ✅ REQUIRED EXTRA FIELDS (from your cURL)
                fatherName: "NA",
                dob: "1990-01-01",

                address: "Default Address",
                district_id: formData.district_id || currentUser.working_zone.district_id,
                block_id: formData.block_id || currentUser.working_zone.block_id,
                village_id: 1,
                pincode: "700001",
                gram_panchayat_id: formData.gram_panchayat_id || 1,

                account_number: "1234567890",
                account_holder_name: formData.firstName,
                bank_name: "SBI",
                ifsc_code: "SBIN0000001",
                branch_name: "Default Branch",
                account_type: "Savings",

                wz_district_id: currentUser.working_zone.district_id,
                wz_block_id: currentUser.working_zone.block_id,
            });

            console.log("SUCCESS:", result);
            alert("Member registered successfully!");

            setFormData({
                email: "",
                mobile: "",
                password: "",
                confirmPassword: "",
                role: "Gramdoot",
                firstName: "",
                lastName: "",
                gender: "",
                district_id: "",
                block_id: "",
                gram_panchayat_id: "",
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
        <>
            <main className="grow w-full px-4 py-8">
                <div className="max-w-6xl mx-auto">

                    <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-6">
                        New Member
                    </h2>

                    <div className="border border-gray-200 p-6">

                        <form onSubmit={handleSubmit}>
                            {/* ROW 1: Email, Mobile, Password, Confirm Password */}
                            <div className="grid grid-cols-4 gap-4 mb-6">

                                {/* Email */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs">{errors.email}</p>
                                    )}
                                </div>

                                {/* Mobile */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">Mobile *</label>
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.mobile && (
                                        <p className="text-red-500 text-xs">{errors.mobile}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">Password *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">Confirm Password *</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* ROW 2: Role, First Name, Last Name, Gender */}
                            <div className="grid grid-cols-4 gap-4 mb-6">

                                {/* Role */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">Role *</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    >
                                        <option value="Gramdoot">Gramdoot</option>
                                        <option value="ADA">ADA</option>
                                    </select>
                                </div>

                                {/* First Name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs">{errors.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs">{errors.lastName}</p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">Gender *</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
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

                            {/* ROW 3: District, Block, Gram Panchayat */}
                            <div className="grid grid-cols-3 gap-4 mb-6">

                                {/* District */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">District *</label>
                                    <select
                                        name="district_id"
                                        value={formData.district_id}
                                        onChange={handleDistrictChange}
                                        disabled={dataLoading}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9] disabled:bg-gray-100"
                                    >
                                        <option value="">Select District</option>
                                        {getAvailableDistricts().map((district) => (
                                            <option key={district.id} value={district.id}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.district_id && (
                                        <p className="text-red-500 text-xs">{errors.district_id}</p>
                                    )}
                                </div>

                                {/* Block */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">Block *</label>
                                    <select
                                        name="block_id"
                                        value={formData.block_id}
                                        onChange={handleBlockChange}
                                        disabled={!formData.district_id || dataLoading}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9] disabled:bg-gray-100"
                                    >
                                        <option value="">Select Block</option>
                                        {getAvailableBlocks().length > 0 ? (
                                            getAvailableBlocks().map((block) => (
                                                <option key={block.id} value={block.id}>
                                                    {block.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No blocks available</option>
                                        )}
                                    </select>
                                    {errors.block_id && (
                                        <p className="text-red-500 text-xs">{errors.block_id}</p>
                                    )}
                                </div>

                                {/* Gram Panchayat */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-600">Gram Panchayat *</label>
                                    <select
                                        name="gram_panchayat_id"
                                        value={formData.gram_panchayat_id}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                gram_panchayat_id: Number(e.target.value) || "",
                                            }));
                                        }}
                                        disabled={!formData.block_id || dataLoading}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9] disabled:bg-gray-100"
                                    >
                                        <option value="">Select GP</option>
                                        {getAvailableGPs().length > 0 ? (
                                            getAvailableGPs().map((gp) => (
                                                <option key={gp.id} value={gp.id}>
                                                    {gp.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No GPs available</option>
                                        )}
                                    </select>
                                    {errors.gram_panchayat_id && (
                                        <p className="text-red-500 text-xs">{errors.gram_panchayat_id}</p>
                                    )}
                                </div>

                            </div>

                            <div className="flex justify-center mt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-6 py-2 rounded disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </main>
        </>
    );
}