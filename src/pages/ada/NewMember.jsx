import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createAgent } from "../../api/client";
import { useDataDirs } from "../../context/DataDirsContext";

export default function NewMember() {
    const location = useLocation();
    const isAdminMemberPage =
        location.pathname.startsWith("/portal/sno/") ||
        location.pathname.startsWith("/portal/dda/");
    const defaultRole = isAdminMemberPage ? "Dda (admin)" : "Gramdoot";

    const {
        districts,
        blocksByDistrict,
        gpsByBlock,
        loadDistricts,
        loadBlocksByDistrict,
        loadGpsByBlock,
        loading: dataLoading,
        locationLoading,
    } = useDataDirs();

    const [formData, setFormData] = useState({
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        role: defaultRole,
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

    const getAvailableDistricts = () => {
        if (
            formData.role === "Gramdoot" ||
            formData.role === "Audit GD" ||
            formData.role === "Dda (admin)"
        ) {
            return districts;
        }
        return [];
    };

    const getAvailableBlocks = () => {
        return blocksByDistrict(formData.district_id);
    };

    const getAvailableGPs = () => {
        return gpsByBlock(formData.block_id);
    };

    useEffect(() => {
        loadDistricts();
    }, [loadDistricts]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            role: defaultRole,
        }));
    }, [defaultRole]);

    useEffect(() => {
        if (formData.district_id) {
            loadBlocksByDistrict(formData.district_id);
        }
    }, [formData.district_id, loadBlocksByDistrict]);

    useEffect(() => {
        if (formData.block_id) {
            loadGpsByBlock(formData.block_id);
        }
    }, [formData.block_id, loadGpsByBlock]);

    useEffect(() => {
        if (
            formData.role === "Gramdoot" ||
            formData.role === "Audit GD" ||
            formData.role === "Dda (admin)"
        ) {
            setFormData((prev) => ({
                ...prev,
                district_id: "",
                block_id: "",
                gram_panchayat_id: "",
            }));
        }
    }, [formData.role]);

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
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
        const newErrors = {};

        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.mobile) newErrors.mobile = "Mobile is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm your password";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
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
                role: defaultRole,
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
        <main className="grow w-full px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-6">
                    New Member
                </h2>

                <div className="border border-gray-200 p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <Field label="Email *" error={errors.email}>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </Field>

                            <Field label="Mobile *" error={errors.mobile}>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </Field>

                            <Field label="Password *" error={errors.password}>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </Field>

                            <Field label="Confirm Password *" error={errors.confirmPassword}>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <Field label="Role *">
                                {isAdminMemberPage ? (
                                    <input
                                        type="text"
                                        value="Dda (admin)"
                                        readOnly
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-100 text-gray-700"
                                    />
                                ) : (
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                    >
                                        <option value="Gramdoot">Gramdoot</option>
                                        <option value="Audit GD">Audit GD</option>
                                    </select>
                                )}
                            </Field>

                            <Field label="First Name *" error={errors.firstName}>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </Field>

                            <Field label="Last Name *" error={errors.lastName}>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                />
                            </Field>

                            <Field label="Gender *" error={errors.gender}>
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
                            </Field>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <Field label="District *" error={errors.district_id}>
                                <select
                                    name="district_id"
                                    value={formData.district_id}
                                    onChange={handleDistrictChange}
                                    disabled={dataLoading || locationLoading.districts}
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9] disabled:bg-gray-100"
                                >
                                    <option value="">Select District</option>
                                    {getAvailableDistricts().map((district) => (
                                        <option key={district.id} value={district.id}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Block *" error={errors.block_id}>
                                <select
                                    name="block_id"
                                    value={formData.block_id}
                                    onChange={handleBlockChange}
                                    disabled={!formData.district_id || dataLoading || locationLoading.blocks}
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
                            </Field>

                            <Field label="Gram Panchayat *" error={errors.gram_panchayat_id}>
                                <select
                                    name="gram_panchayat_id"
                                    value={formData.gram_panchayat_id}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            gram_panchayat_id: Number(e.target.value) || "",
                                        }));
                                    }}
                                    disabled={!formData.block_id || dataLoading || locationLoading.gramPanchayats}
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
                            </Field>
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
    );
}

function Field({ label, error, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}
