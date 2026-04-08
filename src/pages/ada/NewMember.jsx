import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createAgent, fetchMemberSubRoles } from "../../api/client";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

export default function NewMember() {
    const { notifySuccess, notifyError } = useNotification();
    const location = useLocation();

    // ── Sub-roles API data ────────────────────────────────────────────
    const [availableRoles, setAvailableRoles] = useState([]);
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [availableBlocks, setAvailableBlocks] = useState([]);
    const [availableGPs, setAvailableGPs] = useState([]);
    const [subRolesLoading, setSubRolesLoading] = useState(true);

    // ── Form state ────────────────────────────────────────────────────
    const [formData, setFormData] = useState({
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        role_id: "",
        firstName: "",
        lastName: "",
        gender: "",
        district_id: "",
        block_id: "",
        gram_panchayat_id: "",
    });

    const { user } = useAuth();
    const isSNOPage = user?.role === 'sno';
    const showBlockSection = !isSNOPage;

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // ── Load sub_roles API on mount ───────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        async function load() {
            setSubRolesLoading(true);
            try {
                const result = await fetchMemberSubRoles();
                if (cancelled) return;

                setAvailableRoles(result.roles);
                setAvailableDistricts(result.districts);
                setAvailableBlocks(result.blocks);
                setAvailableGPs(result.gram_panchayats);

                // Auto-select first role if available
                if (result.roles.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        role_id: result.roles[0].id,
                    }));
                }
            } catch (err) {
                console.error("[NewMember] Failed to load sub_roles:", err);
                if (!cancelled) {
                    notifyError("Failed to load form options");
                }
            } finally {
                if (!cancelled) setSubRolesLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    // ── Filtered location helpers ─────────────────────────────────────
    const getFilteredBlocks = () => {
        if (!formData.district_id) return [];
        // If blocks have district_id field, filter by it; otherwise show all
        const hasDistrictId = availableBlocks.some((b) => b.district_id != null);
        if (hasDistrictId) {
            return availableBlocks.filter(
                (b) => Number(b.district_id) === Number(formData.district_id)
            );
        }
        return availableBlocks;
    };

    const getFilteredGPs = () => {
        if (!formData.block_id) return [];
        const hasBlockId = availableGPs.some((g) => g.block_id != null);
        if (hasBlockId) {
            return availableGPs.filter(
                (g) => Number(g.block_id) === Number(formData.block_id)
            );
        }
        return availableGPs;
    };

    // ── Handlers ──────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "role_id") {
            setFormData((prev) => ({
                ...prev,
                role_id: Number(value) || "",
                district_id: "",
                block_id: showBlockSection ? "" : prev.block_id,
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
        if (!formData.role_id) newErrors.role_id = "Role is required";
        if (!formData.district_id) newErrors.district_id = "District is required";
        if (showBlockSection && !formData.block_id) newErrors.block_id = "Block is required";

        // Only require GP if GPs are available from the API
        if (showBlockSection && availableGPs.length > 0 && !formData.gram_panchayat_id) {
            newErrors.gram_panchayat_id = "Gram Panchayat is required";
        }

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
                role_id: formData.role_id,
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                fatherName: "NA",
                dob: "1990-01-01",
                address: "Default Address",
                district_id: formData.district_id,
                block_id: formData.block_id,
                village_id: 1,
                pincode: "700001",
                gram_panchayat_id: formData.gram_panchayat_id || 1,
                account_number: "1234567890",
                account_holder_name: formData.firstName,
                bank_name: "SBI",
                ifsc_code: "SBIN0000001",
                branch_name: "Default Branch",
                account_type: "Savings",
                wz_district_id: formData.district_id,
                wz_block_id: formData.block_id,
            });

            console.log("SUCCESS:", result);
            notifySuccess("Member created successfully");

            setFormData({
                email: "",
                mobile: "",
                password: "",
                confirmPassword: "",
                role_id: availableRoles.length > 0 ? availableRoles[0].id : "",
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
            notifyError(err.message || "Member creation failed");
        } finally {
            setLoading(false);
        }
    };

    const selectedRoleName = availableRoles.find((r) => r.id === formData.role_id)?.name || "";
    const filteredBlocks = getFilteredBlocks();
    const filteredGPs = getFilteredGPs();

    return (
        <main className="grow w-full px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-6">
                    New Member
                </h2>

                {subRolesLoading ? (
                    <div className="border border-gray-200 p-6 text-center text-gray-500">
                        Loading form options...
                    </div>
                ) : (
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
                                <Field label="Role *" error={errors.role_id}>
                                    {availableRoles.length <= 1 ? (
                                        <input
                                            type="text"
                                            value={selectedRoleName}
                                            readOnly
                                            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-100 text-gray-700"
                                        />
                                    ) : (
                                        <select
                                            name="role_id"
                                            value={formData.role_id}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9]"
                                        >
                                            {availableRoles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
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

                            <div className={`grid grid-cols-${showBlockSection ? (availableGPs.length > 0 ? 3 : 2) : 1} gap-4 mb-6`}>
                                <Field label="District *" error={errors.district_id}>
                                    <select
                                        name="district_id"
                                        value={formData.district_id}
                                        onChange={handleDistrictChange}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9] disabled:bg-gray-100"
                                    >
                                        <option value="">Select District</option>
                                        {availableDistricts.map((district) => (
                                            <option key={district.id} value={district.id}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                {showBlockSection && (
                                    <Field label="Block *" error={errors.block_id}>
                                        <select
                                            name="block_id"
                                            value={formData.block_id}
                                            onChange={handleBlockChange}
                                            disabled={!formData.district_id}
                                            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9] disabled:bg-gray-100"
                                        >
                                            <option value="">Select Block</option>
                                            {filteredBlocks.length > 0 ? (
                                                filteredBlocks.map((block) => (
                                                    <option key={block.id} value={block.id}>
                                                        {block.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No blocks available</option>
                                            )}
                                        </select>
                                    </Field>
                                )}

                                {showBlockSection && availableGPs.length > 0 && (
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
                                            disabled={!formData.block_id}
                                            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#3eb0c9] disabled:bg-gray-100"
                                        >
                                            <option value="">Select GP</option>
                                            {filteredGPs.length > 0 ? (
                                                filteredGPs.map((gp) => (
                                                    <option key={gp.id} value={gp.id}>
                                                        {gp.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No GPs available</option>
                                            )}
                                        </select>
                                    </Field>
                                )}
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
                )}
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
