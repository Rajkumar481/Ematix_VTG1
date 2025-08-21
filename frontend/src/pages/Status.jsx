// import React, { useEffect, useState } from "react";
// import {
//   Calendar,
//   Clock,
//   ChevronDown,
//   ChevronRight,
//   User,
//   CheckCircle2,
//   AlertCircle,
//   Edit3,
//   Loader2,
//   Activity,
//   TrendingUp,
// } from "lucide-react";
// import dayjs from "dayjs";
// import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// import isToday from "dayjs/plugin/isToday";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import customFetch from "../utils/customFetch";

// dayjs.extend(isSameOrAfter);
// dayjs.extend(isToday);

// const PatientStatusSummary = () => {
//   const [loading, setLoading] = useState(true);
//   const [pending, setPending] = useState([]);
//   const [cleared, setCleared] = useState([]);
//   const [expandedSections, setExpandedSections] = useState({
//     past: false,
//     today: true,
//     future: false,
//     cleared: true,
//   });
//   const [filters, setFilters] = useState({
//     searchTerm: "",
//     diagnosis: "",
//     nextVisit: "",
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // const fetchData = async () => {
//   //   try {
//   //     const res = await customFetch.get("/details");
//   //     const data = res.data;

//   //     const clearedList = [];
//   //     const pendingList = [];

//   //     data.forEach((detail) => {
//   //       const patient = detail.patient;
//   //       if (!patient) return;

//   //       const progress = detail.progress;

//   //       if (progress === "clear") {
//   //         clearedList.push(detail);
//   //       } else {
//   //         pendingList.push(detail);
//   //       }
//   //     });

//   //     pendingList.sort((a, b) =>
//   //       dayjs(a.nextVisit).valueOf() - dayjs(b.nextVisit).valueOf()
//   //     );

//   //     setPending(pendingList);
//   //     setCleared(clearedList);
//   //   } catch (err) {
//   //     console.error("Failed to fetch patient details", err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchData = async () => {
//     try {
//       const res = await customFetch.get("/details");
//       const data = res.data;

//       // 1️⃣ Group by patientId
//       const patientMap = {};
//       data.forEach((detail) => {
//         const patientId = detail.patient?._id;
//         if (!patientId) return;

//         if (!patientMap[patientId]) patientMap[patientId] = [];
//         patientMap[patientId].push(detail);
//       });

//       const clearedList = [];
//       const pendingToday = [];
//       const pendingUpcoming = [];
//       const pendingPast = [];

//       const todayStart = dayjs().startOf("day");
//       const todayEnd = dayjs().endOf("day");

//       // 2️⃣ For each patient, pick latest visit & classify
//       Object.values(patientMap).forEach((visits) => {
//         // Sort by startDate descending
//         visits.sort(
//           (a, b) => dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf()
//         );
//         const latest = visits[0];
//         const progressValue = (latest.progress || "").toLowerCase().trim();
//         const medsRemaining = Number(latest.medicineTakenPatient) || 0;

//         if (progressValue === "clear" || medsRemaining === 0) {
//           clearedList.push(latest);
//         } else {
//           const visitDate = dayjs(latest.nextVisit);
//           if (visitDate.isBetween(todayStart, todayEnd, null, "[]")) {
//             pendingToday.push(latest);
//           } else if (visitDate.isAfter(todayEnd)) {
//             pendingUpcoming.push(latest);
//           } else {
//             pendingPast.push(latest);
//           }
//         }
//       });

//       // Sort each pending list
//       pendingToday.sort(
//         (a, b) => dayjs(a.nextVisit).valueOf() - dayjs(b.nextVisit).valueOf()
//       );
//       pendingUpcoming.sort(
//         (a, b) => dayjs(a.nextVisit).valueOf() - dayjs(b.nextVisit).valueOf()
//       );
//       pendingPast.sort(
//         (a, b) => dayjs(a.nextVisit).valueOf() - dayjs(b.nextVisit).valueOf()
//       );

//       setCleared(clearedList);
//       setPendingToday(pendingToday);
//       setPendingUpcoming(pendingUpcoming);
//       setPendingPast(pendingPast);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const groupPendingByDate = (data) => {
//     const past = [];
//     const today = [];
//     const future = [];

//     const todayDate = dayjs().startOf("day");

//     data.forEach((item) => {
//       const visitDate = dayjs(item.nextVisit);
//       if (!visitDate.isValid()) return;

//       if (visitDate.isBefore(todayDate)) past.push(item);
//       else if (visitDate.isToday()) today.push(item);
//       else future.push(item);
//     });

//     return { past, today, future };
//   };

//   const getDateStatusColor = (dateType) => {
//     switch (dateType) {
//       case "past":
//         return "text-red-700 bg-red-50 border-red-200 hover:bg-red-100";
//       case "today":
//         return "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100";
//       case "future":
//         return "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100";
//       default:
//         return "text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100";
//     }
//   };

//   const getDateIcon = (dateType) => {
//     switch (dateType) {
//       case "past":
//         return <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />;
//       case "today":
//         return <Clock className="w-5 h-5 sm:w-6 sm:h-6" />;
//       case "future":
//         return <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />;
//       default:
//         return <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />;
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value.toLowerCase() }));
//   };

//   const filterData = (data) => {
//     return data.filter((item) => {
//       const patient = item.patient || {};
//       const name = patient.name?.toLowerCase() || "";
//       const phone = patient.phone?.toLowerCase() || "";
//       const address = patient.address?.toLowerCase() || "";
//       const diagnosisList = (patient.diagnosis || []).join(" ").toLowerCase();
//       const nextVisit = item.nextVisit
//         ? dayjs(item.nextVisit).format("YYYY-MM-DD")
//         : "";

//       const matchesSearch =
//         name.includes(filters.searchTerm) ||
//         phone.includes(filters.searchTerm) ||
//         address.includes(filters.searchTerm);

//       const matchesDiagnosis =
//         !filters.diagnosis || diagnosisList.includes(filters.diagnosis);

//       const matchesDate = !filters.nextVisit || nextVisit === filters.nextVisit;

//       return matchesSearch && matchesDiagnosis && matchesDate;
//     });
//   };

//   const renderTableSection = (title, data, sectionKey, dateType) => {
//     const isExpanded = expandedSections[sectionKey];
//     const colorClass = dateType
//       ? getDateStatusColor(dateType)
//       : "text-gray-700 bg-white border-gray-200 hover:bg-gray-50";

//     return (
//       <div className="mb-4">
//         <button
//           onClick={() => toggleSection(sectionKey)}
//           className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 shadow-sm ${colorClass}`}
//         >
//           <div className="flex items-center gap-3">
//             {dateType && getDateIcon(dateType)}
//             <span className="font-semibold text-base sm:text-lg">{title}</span>
//             <span className="bg-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
//               {data.length}
//             </span>
//           </div>
//           {isExpanded ? (
//             <ChevronDown className="w-6 h-6" />
//           ) : (
//             <ChevronRight className="w-6 h-6" />
//           )}
//         </button>

//         {isExpanded && (
//           <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-lg">
//             {data.length === 0 ? (
//               <div className="p-8 sm:p-12 text-center text-gray-500">
//                 <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                   <User className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-700 mb-2">
//                   No Records Available
//                 </h3>
//                 <p className="text-gray-500">
//                   There are no patients in this category at the moment.
//                 </p>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-100">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 text-sm">
//                   <div>Name</div>
//                   <div>Next Visit</div>
//                   <div>Action</div>
//                 </div>
//                 {data.map((item) => (
//                   <div
//                     key={item._id}
//                     onClick={() =>
//                       navigate("/details", {
//                         state: { patientId: item.patient._id },
//                       })
//                     }
//                     className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
//                   >
//                     <div className="flex items-center">
//                       <h4 className="font-semibold text-gray-900 truncate">
//                         {item.patient?.name || "Unknown Patient"}
//                       </h4>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600 gap-2">
//                       <Calendar className="w-4 h-4" />
//                       <span>
//                         {item.nextVisit
//                           ? dayjs(item.nextVisit).format("DD-MM-YYYY")
//                           : "No date set"}
//                       </span>
//                     </div>
//                     <div className="flex items-center">
//                       {sectionKey !== "cleared" && (
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate("/upload", {
//                               state: { patient: item.patient },
//                             });
//                           }}
//                           className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm"
//                         >
//                           <Edit3 className="w-4 h-4" />
//                           Update
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderPendingTable = () => {
//     const filteredPending = filterData(pending);
//     const { past, today, future } = groupPendingByDate(filteredPending);

//     return (
//       <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
//             <Activity className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
//               Pending Patients
//             </h2>
//             <p className="text-gray-600 text-sm">
//               Patients requiring follow-up visits
//             </p>
//           </div>
//         </div>

//         {pending.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
//               <CheckCircle2 className="w-12 h-12 text-white" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-3">
//               All Caught Up!
//             </h3>
//             <p className="text-gray-600 text-lg">
//               No pending patients at the moment. Great work!
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {renderTableSection("Today", today, "today", "today")}
//             {renderTableSection("Upcoming", future, "future", "future")}
//             {renderTableSection("Past Dates", past, "past", "past")}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderClearedTable = () => (
//     <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center gap-4 mb-6">
//         <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
//           <CheckCircle2 className="w-6 h-6 text-white" />
//         </div>
//         <div>
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
//             Cleared Patients
//           </h2>
//           <p className="text-gray-600 text-sm">
//             Successfully completed treatments
//           </p>
//         </div>
//       </div>
//       {renderTableSection("✅ Cleared Patients", cleared, "cleared")}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-gray-200">
//           <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
//           <h3 className="text-2xl font-bold text-gray-900 mb-3">
//             Loading Patient Data
//           </h3>
//           <p className="text-gray-600 text-lg">
//             Please wait while we fetch the latest information...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-10 text-center">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div
//               className="w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg mt-15"
//               style={{
//                 background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
//               }}
//             >
//               <TrendingUp className="w-6 h-6 text-white" />
//             </div>
//             <h1
//               className="text-2xl md:text-3xl lg:text-4xl font-bold mt-15"
//               style={{ color: "#137570" }}
//             >
//               Patient Status Dashboard
//             </h1>
//           </div>
//           <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
//             Monitor and manage patient appointments and treatment progress with
//             our comprehensive dashboard
//           </p>
//         </div>

//         {/* filters */}
//         <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 sm:p-6 rounded-xl shadow border border-gray-200">
//           <input
//             type="text"
//             name="searchTerm"
//             placeholder="Search by name, phone or address"
//             className="px-4 py-2 border rounded-lg"
//             onChange={handleFilterChange}
//           />
//           <input
//             type="text"
//             name="diagnosis"
//             placeholder="Search by diagnosis"
//             className="px-4 py-2 border rounded-lg"
//             onChange={handleFilterChange}
//           />
//           <input
//             type="date"
//             name="nextVisit"
//             className="px-4 py-2 border rounded-lg"
//             onChange={handleFilterChange}
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-8">{renderPendingTable()}</div>
//           <div className="space-y-8">{renderClearedTable()}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientStatusSummary;

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  User,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Loader2,
  Activity,
  TrendingUp,
} from "lucide-react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isToday from "dayjs/plugin/isToday";
import { useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";

dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);

const PatientStatusSummary = () => {
  const [loading, setLoading] = useState(true);

  // ✅ States for cleared and all pending types
  const [cleared, setCleared] = useState([]);
  const [pendingToday, setPendingToday] = useState([]);
  const [pendingUpcoming, setPendingUpcoming] = useState([]);
  const [pendingPast, setPendingPast] = useState([]);

  const [expandedSections, setExpandedSections] = useState({
    past: false,
    today: true,
    future: false,
    cleared: true,
  });

  const [filters, setFilters] = useState({
    searchTerm: "",
    diagnosis: "",
    nextVisit: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await customFetch.get("/details");
      const data = res.data;

      // Group by patientId
      const patientMap = {};
      data.forEach((detail) => {
        const patientId = detail.patient?._id;
        if (!patientId) return;
        if (!patientMap[patientId]) patientMap[patientId] = [];
        patientMap[patientId].push(detail);
      });

      const clearedList = [];
      const todayList = [];
      const upcomingList = [];
      const pastList = [];

      const todayStart = dayjs().startOf("day");
      const todayEnd = dayjs().endOf("day");

      // For each patient, pick latest visit & classify
      Object.values(patientMap).forEach((visits) => {
        visits.sort(
          (a, b) => dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf()
        );
        const latest = visits[0];
        const progressValue = (latest.progress || "").toLowerCase().trim();
        const medsRemaining = Number(latest.medicineTakenPatient) || 0;

        if (progressValue === "clear" || medsRemaining === 0) {
          clearedList.push(latest);
        } else {
          const visitDate = dayjs(latest.nextVisit);
          if (visitDate.isBetween(todayStart, todayEnd, null, "[]")) {
            todayList.push(latest);
          } else if (visitDate.isAfter(todayEnd)) {
            upcomingList.push(latest);
          } else {
            pastList.push(latest);
          }
        }
      });

      // Sort each list
      todayList.sort(
        (a, b) => dayjs(a.nextVisit).valueOf() - dayjs(b.nextVisit).valueOf()
      );
      upcomingList.sort(
        (a, b) => dayjs(a.nextVisit).valueOf() - dayjs(b.nextVisit).valueOf()
      );
      pastList.sort(
        (a, b) => dayjs(a.nextVisit).valueOf() - dayjs(b.nextVisit).valueOf()
      );

      // ✅ Update state
      setCleared(clearedList);
      setPendingToday(todayList);
      setPendingUpcoming(upcomingList);
      setPendingPast(pastList);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getDateStatusColor = (dateType) => {
    switch (dateType) {
      case "past":
        return "text-red-700 bg-red-50 border-red-200 hover:bg-red-100";
      case "today":
        return "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100";
      case "future":
        return "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const getDateIcon = (dateType) => {
    switch (dateType) {
      case "past":
        return <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />;
      case "today":
        return <Clock className="w-5 h-5 sm:w-6 sm:h-6" />;
      case "future":
        return <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value.toLowerCase() }));
  };

  const filterData = (data) => {
    return data.filter((item) => {
      const patient = item.patient || {};
      const name = patient.name?.toLowerCase() || "";
      const phone = patient.phone?.toLowerCase() || "";
      const address = patient.address?.toLowerCase() || "";
      const diagnosisList = (patient.diagnosis || []).join(" ").toLowerCase();
      const nextVisit = item.nextVisit
        ? dayjs(item.nextVisit).format("YYYY-MM-DD")
        : "";

      const matchesSearch =
        name.includes(filters.searchTerm) ||
        phone.includes(filters.searchTerm) ||
        address.includes(filters.searchTerm);

      const matchesDiagnosis =
        !filters.diagnosis || diagnosisList.includes(filters.diagnosis);

      const matchesDate = !filters.nextVisit || nextVisit === filters.nextVisit;

      return matchesSearch && matchesDiagnosis && matchesDate;
    });
  };

  const renderTableSection = (title, data, sectionKey, dateType) => {
    const isExpanded = expandedSections[sectionKey];
    const colorClass = dateType
      ? getDateStatusColor(dateType)
      : "text-gray-700 bg-white border-gray-200 hover:bg-gray-50";

    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 shadow-sm ${colorClass}`}
        >
          <div className="flex items-center gap-3">
            {dateType && getDateIcon(dateType)}
            <span className="font-semibold text-base sm:text-lg">{title}</span>
            <span className="bg-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {data.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-6 h-6" />
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-lg">
            {data.length === 0 ? (
              <div className="p-8 sm:p-12 text-center text-gray-500">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Records Available
                </h3>
                <p className="text-gray-500">
                  There are no patients in this category at the moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 text-sm">
                  <div>Name</div>
                  <div>Next Visit</div>
                  <div>Action</div>
                </div>
                {data.map((item) => (
                  <div
                    key={item._id}
                    onClick={() =>
                      navigate("/details", {
                        state: { patientId: item.patient._id },
                      })
                    }
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.patient?.name || "Unknown Patient"}
                      </h4>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {item.nextVisit
                          ? dayjs(item.nextVisit).format("DD-MM-YYYY")
                          : "No date set"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {sectionKey !== "cleared" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/dashboard/upload", {
                              state: { patient: item.patient },
                            });
                          }}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPendingTable = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Pending Patients
          </h2>
          <p className="text-gray-600 text-sm">
            Patients requiring follow-up visits
          </p>
        </div>
      </div>

      {pendingToday.length === 0 &&
      pendingUpcoming.length === 0 &&
      pendingPast.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            All Caught Up!
          </h3>
          <p className="text-gray-600 text-lg">
            No pending patients at the moment. Great work!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {renderTableSection("Today", pendingToday, "today", "today")}
          {renderTableSection("Upcoming", pendingUpcoming, "future", "future")}
          {renderTableSection("Past Dates", pendingPast, "past", "past")}
        </div>
      )}
    </div>
  );

  const renderClearedTable = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Cleared Patients
          </h2>
          <p className="text-gray-600 text-sm">
            Successfully completed treatments
          </p>
        </div>
      </div>
      {renderTableSection("✅ Cleared Patients", cleared, "cleared")}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-gray-200">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Loading Patient Data
          </h3>
          <p className="text-gray-600 text-lg">
            Please wait while we fetch the latest information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg mt-15"
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
              }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold mt-15"
              style={{ color: "#137570" }}
            >
              Patient Status Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Monitor and manage patient appointments and treatment progress with
            our comprehensive dashboard
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 sm:p-6 rounded-xl shadow border border-gray-200">
          <input
            type="text"
            name="searchTerm"
            placeholder="Search by name, phone or address"
            className="px-4 py-2 border rounded-lg"
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="diagnosis"
            placeholder="Search by diagnosis"
            className="px-4 py-2 border rounded-lg"
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="nextVisit"
            className="px-4 py-2 border rounded-lg"
            onChange={handleFilterChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">{renderPendingTable()}</div>
          <div className="space-y-8">{renderClearedTable()}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientStatusSummary;
