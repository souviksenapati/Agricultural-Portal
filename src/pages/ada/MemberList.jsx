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
    await updateApplicantStatus(id, newStatus);
    loadFarmers();
  };

  return (
    <>
      <main className="grow w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Page heading */}
          <h2 className="text-base font-bold text-gray-700 tracking-widest uppercase mb-4">
            Search Member
          </h2>

          {/* Search form */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 items-end">

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Name</label>
                <input
                  placeholder="Search by name"
                  value={search.name}
                  onChange={(e) => setSearch({ ...search, name: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-[#3eb0c9]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Email</label>
                <input
                  placeholder="Search by email"
                  value={search.email}
                  onChange={(e) => setSearch({ ...search, email: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-52 focus:outline-none focus:border-[#3eb0c9]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Mobile No</label>
                <input
                  placeholder="Search by mobile"
                  value={search.mobile}
                  onChange={(e) => setSearch({ ...search, mobile: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#3eb0c9]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Role</label>
                <select
                  value={search.role}
                  onChange={(e) => setSearch({ ...search, role: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[#3eb0c9]"
                >
                  <option value="">All Roles</option>
                  <option>Gramdoot</option>
                  <option>AUDIT GD</option>
                </select>
              </div>

              <div className="flex gap-2 pb-0.5">
                <button className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded">
                  Search
                </button>
                <button
                  onClick={handleReset}
                  className="bg-[#3eb0c9] hover:bg-[#2a9ab0] text-white text-sm font-medium px-5 py-1.5 rounded"
                >
                  Reset
                </button>
              </div>

            </div>
          </div>

          {/* List heading */}
          <p className="text-[#0891b2] font-bold text-sm mb-2">
            Member List
          </p>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-xs font-semibold border-b border-gray-200">
                  <th className="px-3 py-2.5 text-center border-r border-gray-200 w-10">#</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Name</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Email</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Phone Number</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Role</th>
                  <th className="px-3 py-2.5 text-center border-r border-gray-200">Status</th>
                  <th className="px-3 py-2.5 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((m, i) => (
                    <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">

                      <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100 text-xs">
                        {i + 1}
                      </td>

                      <td className="px-3 py-2 text-center text-gray-700 text-xs border-r border-gray-100">
                        {m.name}
                      </td>

                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                        {m.email || "-"}
                      </td>

                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                        {m.mobile || "-"}
                      </td>

                      <td className="px-3 py-2 text-center text-xs text-gray-600 border-r border-gray-100">
                        {m.role || "Gramdoot"}
                      </td>

                      <td className="px-3 py-2 text-center border-r border-gray-100">
                        {m.status === "approved" ? (
                          <span className="text-green-600 font-semibold text-xs">Active</span>
                        ) : (
                          <span className="text-red-600 font-semibold text-xs">Inactive</span>
                        )}
                      </td>

                      <td className="px-3 py-2 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={m.status === "approved"}
                            onChange={() => toggleStatus(m.id, m.status)}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </>
  );
}