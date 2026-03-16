import { useState } from 'react';
import { searchFarmer, normalizeFarmer } from '../api/client';

const FarmerSearch = () => {
    const [searchTerm, setSearchTerm]   = useState('');
    const [results, setResults]         = useState(null);   // null = not searched yet
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        const q = searchTerm.trim();
        if (!q) return;

        setLoading(true);
        setError('');
        setResults(null);
        try {
            const data = await searchFarmer(q);
            const arr  = Array.isArray(data) ? data : (data?.farmers || data?.data || []);
            setResults(arr.map(normalizeFarmer));
        } catch (err) {
            setError(err.message || 'Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const statusLabel = (s) => ({
        pending:      'Pending',
        approved:     'Approved',
        rejected:     'Rejected',
        sent_to_bank: 'Sent to Bank',
        processed:    'Processed',
    }[s] || s);

    const statusColor = (s) => ({
        approved:     'text-green-700  bg-green-50  border-green-300',
        rejected:     'text-red-700    bg-red-50    border-red-300',
        sent_to_bank: 'text-blue-700   bg-blue-50   border-blue-300',
        processed:    'text-purple-700 bg-purple-50 border-purple-300',
    }[s] || 'text-yellow-700 bg-yellow-50 border-yellow-300');

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-8 md:p-12">
            <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-lg p-6 md:p-10">

                <header className="mb-6 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#333] tracking-tight uppercase">
                        Farmer Search
                    </h1>
                </header>

                <form onSubmit={handleSearch} className="flex flex-col gap-4">
                    <div className="w-full">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Acknowledgement No / Aadhaar / Mobile"
                            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 font-light"
                        />
                    </div>

                    <div className="flex justify-start">
                        <button
                            type="submit"
                            disabled={loading || !searchTerm.trim()}
                            className="w-full sm:w-auto px-8 py-2.5 bg-[#337ab7] hover:bg-[#286090] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded shadow-sm transition-colors duration-200 text-sm sm:text-base"
                        >
                            {loading ? 'Searching…' : 'Search'}
                        </button>
                    </div>
                </form>

                {/* Error */}
                {error && (
                    <div className="mt-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                {/* No results */}
                {results !== null && results.length === 0 && !error && (
                    <div className="mt-6 text-center text-gray-500 text-sm py-8">
                        No records found for <span className="font-medium">"{searchTerm}"</span>.
                    </div>
                )}

                {/* Results table */}
                {results && results.length > 0 && (
                    <div className="mt-8 overflow-x-auto border border-gray-200 rounded">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wide">
                                    <th className="px-4 py-2.5 text-left">#</th>
                                    <th className="px-4 py-2.5 text-left">Ack ID</th>
                                    <th className="px-4 py-2.5 text-left">Name</th>
                                    <th className="px-4 py-2.5 text-left">Aadhaar</th>
                                    <th className="px-4 py-2.5 text-left">Mobile</th>
                                    <th className="px-4 py-2.5 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r, i) => (
                                    <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                                        <td className="px-4 py-2 font-mono text-xs text-[#0891b2]">{r.ackId || '—'}</td>
                                        <td className="px-4 py-2 text-gray-800">{r.name || '—'}</td>
                                        <td className="px-4 py-2 font-mono text-xs text-gray-600">{r.aadhaar || '—'}</td>
                                        <td className="px-4 py-2 font-mono text-xs text-gray-600">{r.mobile || '—'}</td>
                                        <td className="px-4 py-2">
                                            <span className={`text-xs px-2 py-0.5 border rounded-full font-medium ${statusColor(r.status)}`}>
                                                {statusLabel(r.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
};

export default FarmerSearch;
