// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const ROLE_HOME = {
//   gramdoot: '/portal/dashboard',
//   ada: '/portal/ada/dashboard',
//   sno: '/portal/sno/dashboard',
//   bank: '/portal/bank/dashboard',
// };

// const ROLE_LABELS = {
//   gramdoot: 'Gramdoot',
//   ada: 'ADA',
//   sno: 'SNO',
//   bank: 'Bank',
// };

// export default function Header() {
//   const { user } = useAuth();
//   const location = useLocation();

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [quickRegOpen, setQuickRegOpen] = useState(false);
//   const [adaMenuOpen, setAdaMenuOpen] = useState(false);

//   const navRef = useRef(null);

//   const dashboardPath = ROLE_HOME[user?.role] || '/';
//   const isActive = (path) => location.pathname === path;

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handler = (e) => {
//       if (navRef.current && !navRef.current.contains(e.target)) {
//         setQuickRegOpen(false);
//         setAdaMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   // Auto close mobile menu on route change
//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location.pathname]);

//   // ==============================
//   // 🔵 PORTAL HEADER (Logged In)
//   // ==============================
//   if (user) {
//     return (
//       <>
//         <header className="bg-white border-b border-gray-200 shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">

//             {/* Logo */}
//             <Link to={dashboardPath}>
//               <img
//                 src="/image/logo_bsb.png"
//                 alt="WB Govt"
//                 className="h-14 w-auto object-contain"
//               />
//             </Link>

//             {/* Desktop Nav */}
//             <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">

//               <Link
//                 to={dashboardPath}
//                 className={`hover:text-[#0891b2] transition ${isActive(dashboardPath)
//                   ? 'text-[#0891b2] font-semibold'
//                   : ''
//                   }`}
//               >
//                 Dashboard
//               </Link>

//               {/* Gramdoot */}
//               {user.role === 'gramdoot' && (
//                 <div className="relative" ref={navRef}>
//                   <button
//                     onClick={() => setQuickRegOpen(!quickRegOpen)}
//                     className={`flex items-center gap-1 hover:text-[#0891b2] ${location.pathname.startsWith('/portal/quick-registration')
//                       ? 'text-[#0891b2] font-semibold'
//                       : ''
//                       }`}
//                   >
//                     Quick Registration
//                     <svg
//                       className="w-3.5 h-3.5"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>

//                   {quickRegOpen && (
//                     <div className="absolute left-0 mt-2 w-52 bg-white border rounded shadow-lg z-50">
//                       <Link
//                         to="/portal/quick-registration/new"
//                         className="block px-4 py-2 hover:bg-gray-50"
//                       >
//                         Registration Form
//                       </Link>
//                       <Link
//                         to="/portal/quick-registration/list"
//                         className="block px-4 py-2 border-t hover:bg-gray-50"
//                       >
//                         Registered Applicant List
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* ADA */}
//               {user.role === 'ada' && (
//                 <div className="relative" ref={navRef}>
//                   <button
//                     onClick={() => setAdaMenuOpen(!adaMenuOpen)}
//                     className={`flex items-center gap-1 hover:text-[#0891b2] ${location.pathname.startsWith('/portal/ada')
//                       ? 'text-[#0891b2] font-semibold'
//                       : ''
//                       }`}
//                   >
//                     Registered Applicant List
//                     <svg
//                       className="w-3.5 h-3.5"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>

//                   {adaMenuOpen && (
//                     <div className="absolute left-0 mt-2 w-52 bg-white border rounded shadow-lg z-50">
//                       <Link
//                         to="/portal/ada/applications"
//                         className="block px-4 py-2 hover:bg-gray-50"
//                       >
//                         Registered Applicant List
//                       </Link>
//                       <Link
//                         to="/portal/ada/pending"
//                         className="block px-4 py-2 border-t hover:bg-gray-50"
//                       >
//                         Pending List
//                       </Link>
//                       <Link
//                         to="/portal/ada/pending"
//                         className="block px-4 py-2 border-t hover:bg-gray-50"
//                       >
//                         Applicant List
//                       </Link>
//                       <Link
//                         to="/portal/ada/pending"
//                         className="block px-4 py-2 border-t hover:bg-gray-50"
//                       >
//                         Approved List
//                       </Link>
//                       <Link
//                         to="/portal/ada/pending"
//                         className="block px-4 py-2 border-t hover:bg-gray-50"
//                       >
//                         Send to bank List
//                       </Link>
//                       <Link
//                         to="/portal/ada/pending"
//                         className="block px-4 py-2 border-t hover:bg-gray-50"
//                       >
//                         Rejected List
//                       </Link>
//                       <Link
//                         to="/portal/ada/pending"
//                         className="block px-4 py-2 border-t hover:bg-gray-50"
//                       >
//                         Reverted List
//                       </Link>
//                       <Link
//                         to="/portal/ada/pending"
//                         className="block px-4 py-2 border-t hover:bg-gray-50"
//                       >
//                         Deleted List
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               )}



//               {/* SNO */}
//               {user.role === 'sno' && (
//                 <Link
//                   to="/portal/sno/dashboard"
//                   className={`hover:text-[#0891b2] ${location.pathname.startsWith('/portal/sno')
//                     ? 'text-[#0891b2] font-semibold'
//                     : ''
//                     }`}
//                 >
//                   Applications
//                 </Link>
//               )}

//               {/* Bank */}
//               {user.role === 'bank' && (
//                 <Link
//                   to="/portal/bank/dashboard"
//                   className={`hover:text-[#0891b2] ${location.pathname.startsWith('/portal/bank')
//                     ? 'text-[#0891b2] font-semibold'
//                     : ''
//                     }`}
//                 >
//                   DBT Applications
//                 </Link>
//               )}

//               <a href="#" className="hover:text-[#0891b2]">
//                 Download App
//               </a>
//             </nav>

//             {/* Mobile Hamburger */}
//             <div className="sm:hidden">
//               <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
//                 {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Mobile Role Menu */}
//         {isMenuOpen && (
//           <div className="sm:hidden bg-white border-t px-4 py-4 flex flex-col gap-3 text-sm font-medium text-gray-700 shadow-md">

//             <Link to={dashboardPath}>Dashboard</Link>

//             {user.role === 'gramdoot' && (
//               <>
//                 <Link to="/portal/quick-registration/new">
//                   Registration Form
//                 </Link>
//                 <Link to="/portal/quick-registration/list">
//                   Registered Applicant List
//                 </Link>
//               </>
//             )}

//             {user.role === 'ada' && (
//               <>
//                 <Link to="/portal/ada/applications">
//                   Registered Applicant List
//                 </Link>
//                 <Link to="/portal/ada/pending">
//                   Pending List
//                 </Link>
//               </>
//             )}

//             {user.role === 'sno' && (
//               <Link to="/portal/sno/dashboard">Applications</Link>
//             )}

//             {user.role === 'bank' && (
//               <Link to="/portal/bank/dashboard">
//                 DBT Applications
//               </Link>
//             )}

//             <a href="#">Download App</a>
//           </div>
//         )}

//         {/* Blue Announcement Bar */}
//         <div className="bg-[#1565c0] h-11 flex items-center justify-center">
//           <p className="text-white font-semibold text-sm tracking-wide">
//             Welcome to {ROLE_LABELS[user.role]} Portal Agricultural Labour Scheme
//           </p>
//         </div>
//       </>
//     );
//   }

//   // ==============================
//   // 🟢 PUBLIC HEADER
//   // ==============================
//   return (
//     <>
//       <header className="bg-white border-b shadow-sm">
//         <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 py-3">
//           <Link to="/">
//             <img
//               src="/image/logo_bsb.png"
//               alt="Govt Logo"
//               className="h-16 w-auto"
//             />
//           </Link>

//           <div className="hidden sm:flex gap-2">
//             <Link
//               to="/status"
//               className="bg-[#00ACED] text-white px-4 py-2 rounded"
//             >
//               Check Application
//             </Link>
//             <button className="bg-[#00ACED] text-white px-4 py-2 rounded">
//               New Application Form
//             </button>
//             <button className="bg-[#00ACED] text-white px-4 py-2 rounded">
//               Faq
//             </button>
//           </div>

//           <div className="sm:hidden">
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>

//         {isMenuOpen && (
//           <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t">
//             <Link
//               to="/status"
//               className="bg-[#00ACED] text-center text-white px-4 py-2 rounded"
//             >
//               Check Application
//             </Link>
//             <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">
//               New Application Form
//             </button>
//             <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">
//               Faq
//             </button>
//           </div>
//         )}
//       </header>

//       <div className="bg-[#0648b3] text-white py-2 text-center font-medium">
//         Welcome to Agricultural Labour Portal
//       </div>
//     </>
//   );
// }



// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const ROLE_HOME = {
//   gramdoot: '/portal/dashboard',
//   ada: '/portal/ada/dashboard',
//   sno: '/portal/sno/dashboard',
//   bank: '/portal/bank/dashboard',
// };

// const ROLE_LABELS = {
//   gramdoot: 'Gramdoot',
//   ada: 'ADA',
//   sno: 'SNO',
//   bank: 'Bank',
// };

// export default function Header() {
//   const { user } = useAuth();
//   const location = useLocation();

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [quickRegOpen, setQuickRegOpen] = useState(false);
//   const [adaMenuOpen, setAdaMenuOpen] = useState(false);
//   const [misMenuOpen, setMisMenuOpen] = useState(false);
//   const [memberMenuOpen, setMemberMenuOpen] = useState(false);

//   // ✅ FIX: Separate refs
//   const quickRef = useRef(null);
//   const adaRef = useRef(null);
//   const misRef = useRef(null);
//   const memberRef = useRef(null);

//   const dashboardPath = ROLE_HOME[user?.role] || '/';
//   const isActive = (path) => location.pathname === path;

//   // ✅ FIX: Proper outside click handling
//   useEffect(() => {
//     const handler = (e) => {
//       if (
//         !quickRef.current?.contains(e.target) &&
//         !adaRef.current?.contains(e.target) &&
//         !misRef.current?.contains(e.target) &&
//         !memberRef.current?.contains(e.target)
//       ) {
//         setQuickRegOpen(false);
//         setAdaMenuOpen(false);
//         setMisMenuOpen(false);
//         setMemberMenuOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location.pathname]);

//   if (user) {
//     return (
//       <>
//         <header className="bg-white border-b border-gray-200 shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">

//             <Link to={dashboardPath}>
//               <img src="/image/logo_bsb.png" alt="WB Govt" className="h-14" />
//             </Link>

//             <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">

//               <Link
//                 to={dashboardPath}
//                 className={`hover:text-[#0891b2] ${isActive(dashboardPath) ? 'text-[#0891b2] font-semibold' : ''}`}
//               >
//                 Dashboard
//               </Link>

//               {/* Gramdoot */}
//               {user.role === 'gramdoot' && (
//                 <div className="relative" ref={quickRef}>
//                   <button onClick={() => setQuickRegOpen(!quickRegOpen)} className="flex gap-1">
//                     Quick Registration
//                   </button>

//                   {quickRegOpen && (
//                     <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
//                       <Link to="/portal/quick-registration/new" className="block px-4 py-2">Registration Form</Link>
//                       <Link to="/portal/quick-registration/list" className="block px-4 py-2">Registered Applicant List</Link>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* ADA */}
//               {user.role === 'ada' && (
//                 <div className="relative" ref={adaRef}>
//                   <button
//                     onClick={() => setAdaMenuOpen(!adaMenuOpen)}
//                     className="flex items-center gap-1 hover:text-[#0891b2]"
//                   >
//                     Applicant List
//                     <svg
//                       className="w-3.5 h-3.5 ml-1"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>

//                   {adaMenuOpen && (
//                     <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
//                       <Link to="/portal/ada/applications" className="block px-4 py-2">Applicant List</Link>
//                       <Link to="/portal/ada/pending" className="block px-4 py-2">Pending List</Link>
//                       <Link to="/portal/ada/approved" className="block px-4 py-2">Approved List</Link>
//                       <Link to="/portal/ada/send_to_bank" className="block px-4 py-2">Send to Bank List</Link>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* MIS */}
//               <div className="relative" ref={misRef}>
//                 <button
//                   onClick={() => setMisMenuOpen(!misMenuOpen)}
//                   className="flex items-center gap-1 hover:text-[#0891b2]"
//                 >
//                   MIS
//                   <svg
//                     className="w-3.5 h-3.5 ml-1"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>

//                 {misMenuOpen && (
//                   <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
//                     <Link to="/portal/mis/demo1" className="block px-4 py-2">Download Submitted List</Link>
//                     <Link to="/portal/mis/demo2" className="block px-4 py-2">Download Approved List</Link>
//                   </div>
//                 )}
//               </div>

//               {/* MEMBER */}
//               <div className="relative" ref={memberRef}>
//                 <button
//                   onClick={() => setMemberMenuOpen(!memberMenuOpen)}
//                   className="flex items-center gap-1 hover:text-[#0891b2]"
//                 >
//                   Member
//                   <svg
//                     className="w-3.5 h-3.5 ml-1"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>

//                 {memberMenuOpen && (
//                   <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
//                     <Link to="/portal/member/demo1" className="block px-4 py-2">New Member</Link>
//                     <Link to="/portal/member/demo2" className="block px-4 py-2">Member List</Link>
//                   </div>
//                 )}
//               </div>

//             </nav>

//             <div className="sm:hidden">
//               <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
//                 {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
//               </button>
//             </div>
//           </div>
//         </header>
//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="sm:hidden bg-white border-b border-gray-200 shadow-sm px-4 py-4 space-y-3 text-sm font-medium text-gray-700">

//             <Link
//               to={dashboardPath}
//               className={`block ${isActive(dashboardPath) ? 'text-[#0891b2] font-semibold' : ''}`}
//             >
//               Dashboard
//             </Link>

//             {/* Gramdoot */}
//             {user.role === 'gramdoot' && (
//               <>
//                 <div>
//                   <p className="font-semibold">Quick Registration</p>
//                   <Link to="/portal/quick-registration/new" className="block pl-3 py-1">
//                     Registration Form
//                   </Link>
//                   <Link to="/portal/quick-registration/list" className="block pl-3 py-1">
//                     Registered Applicant List
//                   </Link>
//                 </div>
//               </>
//             )}

//             {/* ADA */}
//             {user.role === 'ada' && (
//               <div>
//                 <p className="font-semibold">Applicant List</p>
//                 <Link to="/portal/ada/applications" className="block pl-3 py-1">
//                   Applicant List
//                 </Link>
//                 <Link to="/portal/ada/pending" className="block pl-3 py-1">
//                   Pending List
//                 </Link>
//                 <Link to="/portal/ada/approved" className="block pl-3 py-1">
//                   Approved List
//                 </Link>
//                 <Link to="/portal/ada/send_to_bank" className="block pl-3 py-1">
//                   Send to Bank List
//                 </Link>
//               </div>
//             )}
//             {/* MIS */}




//             {/* MEMBER */}
//             <div>
//               <p className="font-semibold">Member</p>
//               <Link to="/portal/member/demo1" className="block pl-3 py-1">
//                 New Member
//               </Link>
//               <Link to="/portal/member/demo2" className="block pl-3 py-1">
//                 Member List
//               </Link>
//             </div>
//           </div>
//         )}

//         <div className="bg-[#1565c0] h-11 flex items-center justify-center text-white">
//           Welcome to {ROLE_LABELS[user.role]} Portal Agricultural Labour Scheme
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <header className="bg-white border-b shadow-sm">
//         <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 py-3">
//           <Link to="/">
//             <img
//               src="/image/logo_bsb.png"
//               alt="Govt Logo"
//               className="h-16 w-auto"
//             />
//           </Link>

//           <div className="hidden sm:flex gap-2">
//             <Link
//               to="/status"
//               className="bg-[#00ACED] text-white px-4 py-2 rounded"
//             >
//               Check Application
//             </Link>
//             <button className="bg-[#00ACED] text-white px-4 py-2 rounded">
//               New Application Form
//             </button>
//             <button className="bg-[#00ACED] text-white px-4 py-2 rounded">
//               Faq
//             </button>
//           </div>

//           <div className="sm:hidden">
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>

//         {isMenuOpen && (
//           <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t">
//             <Link
//               to="/status"
//               className="bg-[#00ACED] text-center text-white px-4 py-2 rounded"
//             >
//               Check Application
//             </Link>
//             <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">
//               New Application Form
//             </button>
//             <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">
//               Faq
//             </button>
//           </div>
//         )}
//       </header>

//       <div className="bg-[#0648b3] text-white py-2 text-center font-medium">
//         Welcome to Agricultural Labour Portal
//       </div>
//     </>
//   );
// }

// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const ROLE_HOME = {
//   gramdoot: '/portal/dashboard',
//   ada: '/portal/ada/dashboard',
//   sno: '/portal/sno/dashboard',
//   bank: '/portal/bank/dashboard',
// };

// const ROLE_LABELS = {
//   gramdoot: 'Gramdoot',
//   ada: 'ADA',
//   sno: 'SNO',
//   bank: 'Bank',
// };

// export default function Header() {
//   const { user } = useAuth();
//   const location = useLocation();

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [quickRegOpen, setQuickRegOpen] = useState(false);
//   const [adaMenuOpen, setAdaMenuOpen] = useState(false);
//   const [misMenuOpen, setMisMenuOpen] = useState(false);
//   const [memberMenuOpen, setMemberMenuOpen] = useState(false);

//   // ✅ Separate refs for outside click handling
//   const quickRef = useRef(null);
//   const adaRef = useRef(null);
//   const misRef = useRef(null);
//   const memberRef = useRef(null);

//   const dashboardPath = ROLE_HOME[user?.role] || '/';
//   const isActive = (path) => location.pathname === path;

//   // ✅ Close dropdowns when clicking outside
//   useEffect(() => {
//     const handler = (e) => {
//       if (
//         !quickRef.current?.contains(e.target) &&
//         !adaRef.current?.contains(e.target) &&
//         !misRef.current?.contains(e.target) &&
//         !memberRef.current?.contains(e.target)
//       ) {
//         setQuickRegOpen(false);
//         setAdaMenuOpen(false);
//         setMisMenuOpen(false);
//         setMemberMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location.pathname]);

//   if (user) {
//     return (
//       <>
//         <header className="bg-white border-b border-gray-200 shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">
//             <Link to={dashboardPath}>
//               <img src="/image/logo_bsb.png" alt="WB Govt" className="h-14" />
//             </Link>

//             <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">
//               <Link
//                 to={dashboardPath}
//                 className={`hover:text-[#0891b2] ${isActive(dashboardPath) ? 'text-[#0891b2] font-semibold' : ''}`}
//               >
//                 Dashboard
//               </Link>

//               {/* Gramdoot Quick Registration */}
//               {user.role === 'gramdoot' && (
//                 <div className="relative" ref={quickRef}>
//                   <button onClick={() => setQuickRegOpen(!quickRegOpen)} className="flex gap-1">
//                     Quick Registration
//                     <svg
//                       className="w-3.5 h-3.5 ml-1"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {quickRegOpen && (
//                     <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
//                       <Link to="/portal/quick-registration/new" className="block px-4 py-2">
//                         Registration Form
//                       </Link>
//                       <Link to="/portal/quick-registration/list" className="block px-4 py-2">
//                         Registered Applicant List
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* ADA Applicant List */}
//               {user.role === 'ada' && (
//                 <div className="relative" ref={adaRef}>
//                   <button
//                     onClick={() => setAdaMenuOpen(!adaMenuOpen)}
//                     className="flex items-center gap-1 hover:text-[#0891b2]"
//                   >
//                     Applicant List
//                     <svg
//                       className="w-3.5 h-3.5 ml-1"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {adaMenuOpen && (
//                     <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
//                       <Link to="/portal/ada/applications" className="block px-4 py-2">
//                         Applicant List
//                       </Link>
//                       <Link to="/portal/ada/pending" className="block px-4 py-2">
//                         Pending List
//                       </Link>
//                       <Link to="/portal/ada/approved" className="block px-4 py-2">
//                         Approved List
//                       </Link>
//                       <Link to="/portal/ada/send_to_bank" className="block px-4 py-2">
//                         Send to Bank List
//                       </Link>
//                       <Link to="/portal/ada/rejected_list" className="block px-4 py-2">
//                         Rejected List
//                       </Link>
//                       <Link to="/portal/ada/reverted_list" className="block px-4 py-2">
//                         Reverted List
//                       </Link>
//                       <Link to="/portal/ada/deleted_list" className="block px-4 py-2">
//                         Deleted List
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* MIS (ADA only) */}
//               {user.role === 'ada' && (
//                 <div className="relative" ref={misRef}>
//                   <button
//                     onClick={() => setMisMenuOpen(!misMenuOpen)}
//                     className="flex items-center gap-1 hover:text-[#0891b2]"
//                   >
//                     MIS
//                     <svg
//                       className="w-3.5 h-3.5 ml-1"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {misMenuOpen && (
//                     <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
//                       <Link to="/portal/mis/demo1" className="block px-4 py-2">
//                         Download Submitted List
//                       </Link>
//                       <Link to="/portal/mis/demo2" className="block px-4 py-2">
//                         Download Approved List
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* MEMBER (ADA only) */}
//               {user.role === 'ada' && (
//                 <div className="relative" ref={memberRef}>
//                   <button
//                     onClick={() => setMemberMenuOpen(!memberMenuOpen)}
//                     className="flex items-center gap-1 hover:text-[#0891b2]"
//                   >
//                     Member
//                     <svg
//                       className="w-3.5 h-3.5 ml-1"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {memberMenuOpen && (
//                     <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
//                       <Link to="/portal/member/demo1" className="block px-4 py-2">New Member</Link>
//                       <Link to="/portal/member/demo2" className="block px-4 py-2">Member List</Link>
//                     </div>
//                   )}
//                 </div>
//               )}

//             </nav>

//             {/* Mobile Menu Toggle */}
//             <div className="sm:hidden">
//               <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
//                 {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="sm:hidden bg-white border-b border-gray-200 shadow-sm px-4 py-4 space-y-3 text-sm font-medium text-gray-700">
//             <Link
//               to={dashboardPath}
//               className={`block ${isActive(dashboardPath) ? 'text-[#0891b2] font-semibold' : ''}`}
//             >
//               Dashboard
//             </Link>

//             {/* Gramdoot Quick Registration */}
//             {user.role === 'gramdoot' && (
//               <div>
//                 <p className="font-semibold">Quick Registration</p>
//                 <Link to="/portal/quick-registration/new" className="block pl-3 py-1">
//                   Registration Form
//                 </Link>
//                 <Link to="/portal/quick-registration/list" className="block pl-3 py-1">
//                   Registered Applicant List
//                 </Link>
//               </div>
//             )}

//             {/* ADA Applicant List */}
//             {user.role === 'ada' && (
//               <div>
//                 <p className="font-semibold">Applicant List</p>
//                 <Link to="/portal/ada/applications" className="block pl-3 py-1">Applicant List</Link>
//                 <Link to="/portal/ada/pending" className="block pl-3 py-1">Pending List</Link>
//                 <Link to="/portal/ada/approved" className="block pl-3 py-1">Approved List</Link>
//                 <Link to="/portal/ada/send_to_bank" className="block pl-3 py-1">Send to Bank List</Link>
//                 <Link to="/portal/ada/rejected_list" className="block pl-3 py-1">Rejected List</Link>
//                 <Link to="/portal/ada/reverted_list" className="block pl-3 py-1">Reverted List</Link>
//                 <Link to="/portal/ada/deleted_list" className="block pl-3 py-1">Deleted List</Link>
//               </div>
//             )}

//             {/* MIS (ADA only) */}
//             {user.role === 'ada' && (
//               <div>
//                 <p className="font-semibold">MIS</p>
//                 <Link to="/portal/mis/demo1" className="block pl-3 py-1">Download Submitted List</Link>
//                 <Link to="/portal/mis/demo2" className="block pl-3 py-1">Download Approved List</Link>
//               </div>
//             )}

//             {/* MEMBER (ADA only) */}
//             {user.role === 'ada' && (
//               <div>
//                 <p className="font-semibold">Member</p>
//                 <Link to="/portal/member/demo1" className="block pl-3 py-1">New Member</Link>
//                 <Link to="/portal/member/demo2" className="block pl-3 py-1">Member List</Link>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="bg-[#1565c0] h-11 flex items-center justify-center text-white">
//           Welcome to {ROLE_LABELS[user.role]} Portal Agricultural Labour Scheme
//         </div>
//       </>
//     );
//   }

//   // ✅ Guest Header
//   return (
//     <>
//       <header className="bg-white border-b shadow-sm">
//         <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 py-3">
//           <Link to="/">
//             <img src="/image/logo_bsb.png" alt="Govt Logo" className="h-16 w-auto" />
//           </Link>

//           <div className="hidden sm:flex gap-2">
//             <Link to="/status" className="bg-[#00ACED] text-white px-4 py-2 rounded">Check Application</Link>
//             <button className="bg-[#00ACED] text-white px-4 py-2 rounded">New Application Form</button>
//             <button className="bg-[#00ACED] text-white px-4 py-2 rounded">Faq</button>
//           </div>

//           <div className="sm:hidden">
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>

//         {isMenuOpen && (
//           <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t">
//             <Link to="/status" className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">Check Application</Link>
//             <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">New Application Form</button>
//             <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">Faq</button>
//           </div>
//         )}
//       </header>

//       <div className="bg-[#0648b3] text-white py-2 text-center font-medium">
//         Welcome to Agricultural Labour Portal
//       </div>
//     </>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApplicants } from '../context/ApplicantContext';

const ROLE_HOME = {
  gramdoot: '/portal/dashboard',
  ada: '/portal/ada/dashboard',
  sno: '/portal/sno/dashboard',
  bank: '/portal/bank/dashboard',
};

const ROLE_LABELS = {
  gramdoot: 'Gramdoot',
  ada: 'ADA',
  sno: 'SNO',
  bank: 'Bank',
};

export default function Header() {
  const { user } = useAuth();
  const { applicants, loadFarmers } = useApplicants();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickRegOpen, setQuickRegOpen] = useState(false);
  const [adaMenuOpen, setAdaMenuOpen] = useState(false);
  const [misMenuOpen, setMisMenuOpen] = useState(false);
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);

  const quickRef = useRef(null);
  const adaRef = useRef(null);
  const misRef = useRef(null);
  const memberRef = useRef(null);

  const dashboardPath = ROLE_HOME[user?.role] || '/';
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handler = (e) => {
      if (
        !quickRef.current?.contains(e.target) &&
        !adaRef.current?.contains(e.target) &&
        !misRef.current?.contains(e.target) &&
        !memberRef.current?.contains(e.target)
      ) {
        setQuickRegOpen(false);
        setAdaMenuOpen(false);
        setMisMenuOpen(false);
        setMemberMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (user?.role === 'ada' && applicants.length === 0) {
      loadFarmers();
    }
  }, [user?.role, applicants.length, loadFarmers]);

  const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const downloadApplicantsCsv = (label, rows) => {
    const header = [
      'Sl No',
      'Acknowledgement ID',
      'Applicant Name',
      'Aadhaar No',
      'Mobile No',
      'Status',
      'Bank Name',
      'Branch Name',
      'Account Number',
      'IFSC',
    ];

    const body = rows.map((app, index) => [
      index + 1,
      app.ackId,
      app.name,
      app.aadhaar,
      app.mobile,
      app.status,
      app.bank_name || app.fullForm?.bankName || '',
      app.branch_name || app.fullForm?.branchName || '',
      app.account_number || app.fullForm?.accountNumber || '',
      app.ifsc || app.fullForm?.ifscCode || '',
    ]);

    const csv = [header, ...body]
      .map((row) => row.map(csvEscape).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${label.toLowerCase().replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleMisDownload = (type) => {
    const statusLists = {
      submitted: applicants.filter((app) => app.status !== 'deleted'),
      approved: applicants.filter((app) => app.status === 'approved'),
      rejected: applicants.filter((app) => app.status === 'rejected'),
      pending: applicants.filter((app) => app.status === 'pending'),
      reverted: applicants.filter((app) => app.status === 'reverted'),
      sent_to_bank: applicants.filter((app) => app.status === 'sent_to_bank'),
    };

    const labels = {
      submitted: 'submitted_list',
      approved: 'approved_list',
      rejected: 'rejected_list',
      pending: 'pending_list',
      reverted: 'reverted_list',
      sent_to_bank: 'send_to_bank_list',
    };

    downloadApplicantsCsv(labels[type], statusLists[type] || []);
    setMisMenuOpen(false);
    setIsMenuOpen(false);
  };

  if (user) {
    return (
      <>
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[72px]">

            <Link to={dashboardPath}>
              <img src="/image/logo_bsb.png" alt="WB Govt" className="h-14" />
            </Link>

            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">

              <Link
                to={dashboardPath}
                className={`hover:text-[#0891b2] ${isActive(dashboardPath) ? 'text-[#0891b2] font-semibold' : ''}`}
              >
                Dashboard
              </Link>

              {/* Gramdoot */}
              {user.role === 'gramdoot' && (
                <div className="relative" ref={quickRef}>
                  <button
                    onClick={() => {
                      setQuickRegOpen(!quickRegOpen);
                      setAdaMenuOpen(false);
                      setMisMenuOpen(false);
                      setMemberMenuOpen(false);
                    }}
                    className="flex gap-1"
                  >
                    Quick Registration
                    <svg
                      className="w-3.5 h-3.5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {quickRegOpen && (
                    <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
                      <Link to="/portal/quick-registration/new" className="block px-4 py-2">
                        Registration Form
                      </Link>
                      <Link to="/portal/quick-registration/list" className="block px-4 py-2">
                        Registered Applicant List
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* ADA */}
              {user.role === 'ada' && (
                <div className="relative" ref={adaRef}>
                  <button
                    onClick={() => {
                      setAdaMenuOpen(!adaMenuOpen);
                      setQuickRegOpen(false);
                      setMisMenuOpen(false);
                      setMemberMenuOpen(false);
                    }}
                    className="flex items-center gap-1 hover:text-[#0891b2] hover:cursor-pointer"
                  >
                    Applicant List
                    <svg
                      className="w-3.5 h-3.5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {adaMenuOpen && (
                    <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
                      <Link to="/portal/ada/applications" className="block px-4 py-2">Applicant List</Link>
                      <Link to="/portal/ada/pending" className="block px-4 py-2">Pending List</Link>
                      <Link to="/portal/ada/approved" className="block px-4 py-2">Approved List</Link>
                      <Link to="/portal/ada/send_to_bank" className="block px-4 py-2">Send to Bank List</Link>
                      <Link to="/portal/ada/rejected_list" className="block px-4 py-2">Rejected List</Link>
                      <Link to="/portal/ada/reverted_list" className="block px-4 py-2">Reverted List</Link>
                      <Link to="/portal/ada/deleted_list" className="block px-4 py-2">Deleted List</Link>
                    </div>
                  )}
                </div>
              )}

              {/* MIS */}
              {user.role === 'ada' && (
                <div className="relative" ref={misRef}>
                  <button
                    onClick={() => {
                      setMisMenuOpen(!misMenuOpen);
                      setQuickRegOpen(false);
                      setAdaMenuOpen(false);
                      setMemberMenuOpen(false);
                    }}
                    className="flex items-center gap-1 hover:text-[#0891b2] hover:cursor-pointer"
                  >
                    MIS
                    <svg
                      className="w-3.5 h-3.5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {misMenuOpen && (
                    <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
                      <button type="button" onClick={() => handleMisDownload('submitted')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:cursor-pointer">Download Submitted List</button>
                      <button type="button" onClick={() => handleMisDownload('approved')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:cursor-pointer">Download Approved List</button>
                      <button type="button" onClick={() => handleMisDownload('rejected')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:cursor-pointer">Download Rejected List</button>
                      <button type="button" onClick={() => handleMisDownload('pending')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:cursor-pointer">Download Pending List</button>
                      <button type="button" onClick={() => handleMisDownload('reverted')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:cursor-pointer">Download Reverted List</button>
                      <button type="button" onClick={() => handleMisDownload('sent_to_bank')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:cursor-pointer">Download Send to Bank List</button>
                    </div>
                  )}
                </div>
              )}

              {/* MEMBER */}
              {user.role === 'ada' && (
                <div className="relative" ref={memberRef}>
                  <button
                    onClick={() => {
                      setMemberMenuOpen(!memberMenuOpen);
                      setQuickRegOpen(false);
                      setAdaMenuOpen(false);
                      setMisMenuOpen(false);
                    }}
                    className="flex items-center gap-1 hover:text-[#0891b2] hover:cursor-pointer"
                  >
                    Member
                    <svg
                      className="w-3.5 h-3.5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
                  </button>

                  {memberMenuOpen && (
                    <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg">
                      <Link to="/portal/ada/members/new" className="block px-4 py-2">New Member</Link>
                      <Link to="/portal/ada/members" className="block px-4 py-2">Member List</Link>
                    </div>
                  )}
                </div>
              )}

            </nav>

            {/* Mobile Toggle */}
            <div className="sm:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>
        </header>

        {/* ✅ MOBILE MENU */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-b border-gray-200 shadow-sm px-4 py-4 space-y-3 text-sm font-medium text-gray-700">

            <Link to={dashboardPath} className="block">
              Dashboard
            </Link>

            {/* Gramdoot */}
            {user.role === 'gramdoot' && (
              <div>
                <p className="font-semibold">Quick Registration</p>
                <Link to="/portal/quick-registration/new" className="block pl-3 py-1">
                  Registration Form
                </Link>
                <Link to="/portal/quick-registration/list" className="block pl-3 py-1">
                  Registered Applicant List
                </Link>
              </div>
            )}

            {/* ADA */}
            {user.role === 'ada' && (
              <>
                <div>
                  <p className="font-semibold">Applicant List</p>
                  <Link to="/portal/ada/applications" className="block pl-3 py-1">Applicant List</Link>
                  <Link to="/portal/ada/pending" className="block pl-3 py-1">Pending List</Link>
                  <Link to="/portal/ada/approved" className="block pl-3 py-1">Approved List</Link>
                  <Link to="/portal/ada/send_to_bank" className="block pl-3 py-1">Send to Bank List</Link>
                  <Link to="/portal/ada/rejected_list" className="block pl-3 py-1">Rejected List</Link>
                  <Link to="/portal/ada/reverted_list" className="block pl-3 py-1">Reverted List</Link>
                  <Link to="/portal/ada/deleted_list" className="block pl-3 py-1">Deleted List</Link>
                </div>

                <div>
                  <p className="font-semibold">MIS</p>
                  <button type="button" onClick={() => handleMisDownload('submitted')} className="block pl-3 py-1 text-left">Download Submitted List</button>
                  <button type="button" onClick={() => handleMisDownload('approved')} className="block pl-3 py-1 text-left">Download Approved List</button>
                  <button type="button" onClick={() => handleMisDownload('rejected')} className="block pl-3 py-1 text-left">Download Rejected List</button>
                  <button type="button" onClick={() => handleMisDownload('pending')} className="block pl-3 py-1 text-left">Download Pending List</button>
                  <button type="button" onClick={() => handleMisDownload('reverted')} className="block pl-3 py-1 text-left">Download Reverted List</button>
                  <button type="button" onClick={() => handleMisDownload('sent_to_bank')} className="block pl-3 py-1 text-left">Download Send to Bank List</button>
                </div>

                <div>
                  <p className="font-semibold">Member</p>
                  <Link to="/portal/ada/members/new" className="block pl-3 py-1">New Member</Link>
                  <Link to="/portal/ada/members" className="block pl-3 py-1">Member List</Link>
                </div>
              </>
            )}

          </div>
        )}

        <div className="bg-[#1565c0] h-11 flex items-center justify-center text-white">
          Welcome to {ROLE_LABELS[user.role]} Portal Agricultural Labour Scheme
        </div>
      </>
    );
  }

  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/">
            <img src="/image/logo_bsb.png" alt="Govt Logo" className="h-16 w-auto" />
          </Link>

          <div className="hidden sm:flex gap-2">
            <Link to="/status" className="bg-[#00ACED] text-white px-4 py-2 rounded">Check Application</Link>
            <button className="bg-[#00ACED] text-white px-4 py-2 rounded">New Application Form</button>
            <button className="bg-[#00ACED] text-white px-4 py-2 rounded">Faq</button>
          </div>

          <div className="sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white border-t">
            <Link to="/status" className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">Check Application</Link>
            <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">New Application Form</button>
            <button className="bg-[#00ACED] text-center text-white px-4 py-2 rounded">Faq</button>
          </div>
        )}
      </header>

      <div className="bg-[#0648b3] text-white py-2 text-center font-medium">
        Welcome to Agricultural Labour Portal
      </div>
    </>
  );
}
