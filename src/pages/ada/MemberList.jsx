import React, { useState, useMemo, useEffect } from "react";
import { useApplicants } from "../../context/ApplicantContext";

export default function MemberPage() {
  const { applicants, loadFarmers, updateApplicantStatus } = useApplicants();

  useEffect(() => {
    loadFarmers();
  }, []);

  const [search, setSearch] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
  });

  // 🔥 FILTER FROM API
  const filtered = useMemo(() => {
    return applicants
      .filter((a) => a.status !== "deleted")
      .filter((a) =>
        (a.name || "").toLowerCase().includes(search.name.toLowerCase())
      )
      .filter((a) =>
        (a.email || "").toLowerCase().includes(search.email.toLowerCase())
      )
      .filter((a) =>
        (a.mobile || "").includes(search.mobile)
      )
      .filter((a) =>
        search.role === "" || (a.role || "Gramdoot") === search.role
      );
  }, [applicants, search]);

  const handleReset = () => {
    setSearch({ name: "", email: "", mobile: "", role: "" });
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "approved" ? "inactive" : "approved";
    await updateApplicantStatus(id, newStatus); // Update API
    loadFarmers(); // Reload after update
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-xl text-gray-700 mb-6">SEARCH MEMBER</h2>

        {/* SEARCH */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <input
            placeholder="Search by name"
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            placeholder="Search by email"
            value={search.email}
            onChange={(e) => setSearch({ ...search, email: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            placeholder="Search by mobile"
            value={search.mobile}
            onChange={(e) => setSearch({ ...search, mobile: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <select
            value={search.role}
            onChange={(e) => setSearch({ ...search, role: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Roles</option>
            <option>Gramdoot</option>
            <option>AUDIT GD</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
          <button
            onClick={handleReset}
            className="bg-cyan-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        {/* TABLE */}
        <h3 className="text-blue-600 font-semibold mb-2">Member List</h3>
        <div className="overflow-x-auto border">
          <table className="w-full text-sm border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Phone Number</th>
                <th className="border px-3 py-2">Role</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} className="text-center">
                  <td className="border px-3 py-2">{i + 1}</td>
                  <td className="border px-3 py-2">{m.name}</td>
                  <td className="border px-3 py-2">{m.email || "-"}</td>
                  <td className="border px-3 py-2">{m.mobile || "-"}</td>
                  <td className="border px-3 py-2">{m.role || "Gramdoot"}</td>
                  <td className="border px-3 py-2">
                    {m.status === "approved" ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </td>
                  <td className="border px-3 py-2 flex justify-center">
                    {/* Toggle switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={m.status === "approved"}
                        onChange={() => toggleStatus(m.id, m.status)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}