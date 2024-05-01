import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from 'react-modal';
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedGraduationYear, setSelectedGraduationYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState("");
  const [studentEmailToDelete, setStudentEmailToDelete] = useState("");
  const [studentEquipedData,setStudentEquipedData] = useState([]);
  const token= localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/students");
      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
      } else {
        console.error("Error fetching students:", data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error);
      console.error("Error fetching students:", error);
    }
  };

  const disableStudent = async (studentId, studentEmail) => {
    setStudentIdToDelete(studentId);
    setStudentEmailToDelete(studentEmail);
    fetchStudentEqipedItems(studentId);
    setShowModal(true);
  };

  const fetchStudentEqipedItems = async (studentID) => {
    const statuses = ["accepted", "returning"]; // Use an array for multiple statuses
    const lab = 'All';
    try {
      const response = await fetch(
        `http://localhost:3000/api/transaction/requests/${statuses}/${lab}/${studentID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      const requestsArray = data.Rrequests || [];
      const studentsArray = data.students || [];
      const equipmentsArray = data.equipments || [];

      const requestDataArray = requestsArray.map((request, index) => {
        return {
          request: requestsArray[index] || {},
          student: studentsArray[index] || {},
          equipment: equipmentsArray[index] || {},
        };
      });

      setStudentEquipedData(requestDataArray);
    }
    catch (error){
      alert("Error in fetching student details");
    }
  }

  const closeModal = () => {
    setShowModal(false);
  };

  const handleClearDues = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/disableStudent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentID: studentIdToDelete })
      });

      if (response.ok) {
        fetchStudents();
        setShowModal(false);
      } else {
        console.error("Failed to clear dues.");
      }
    } catch (error) {
      console.error("Error clearing dues:", error);
    }
  };

  const renderHeader = () => {
    return (
      <tr className="bg-[#3dafaa] text-white">
        <th className="border p-2 text-center">S.No</th>
        <th className="border p-2 text-center">Full Name</th>
        <th className="border p-2 text-center">Email</th>
        <th className="border p-2 text-center">Roll Number</th>
        <th className="border p-2 text-center">Enrollment Date</th>
        <th className="border p-2 text-center">Contact Number</th>
        <th className="border p-2 text-center">Branch</th>
        <th className="border p-2 text-center">Batch</th>
        <th className="border p-2 text-center">Graduation Year</th>
        <th className="border p-2 text-center">Action</th>
      </tr>
    );
  };

  const renderRow = (student, index) => {
    const isBatchSelected =
      selectedBatch === "" || student.graduationType === selectedBatch;

    const isBranchSelected =
      selectedBranch === "" || student.branch === selectedBranch;
    const isGraduationYearSelected =
      selectedGraduationYear === "" ||
      student.graduationYear === parseInt(selectedGraduationYear);

    if (isBatchSelected && isBranchSelected && isGraduationYearSelected) {
      return (
        <tr key={index}>
          <td className="border p-2 text-center">{index + 1}</td>
          <td className="border p-2 text-center">{student.fullName}</td>
          <td className="border p-2 text-center">{student.email}</td>
          <td className="border p-2 text-center">{student.rollNumber}</td>
          <td className="border p-2 text-center">
            {new Date(student.enrollmentDate).toLocaleDateString()}
          </td>
          <td className="border p-2 text-center">{student.contactNumber}</td>
          <td className="border p-2 text-center">{student.branch}</td>
          <td className="border p-2 text-center">{student.graduationType}</td>
          <td className="border p-2 text-center">{student.graduationYear}</td>
          <td className="border p-2 text-center">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md items-center"
              onClick={() => disableStudent(student._id, student.email)}
            >
              Clear Dues
            </button>
          </td>
        </tr>
      );
    }
    return null;
  };

  const renderFilterOptions = (options, setSelectedOption, selectedOption) => (
    <select
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  const renderEquipmentDetails = (requestData, index) => {
    const { equipment, request } = requestData;
    
    return (
      <tr key={index}>
        <td className="border p-2 text-center bg-gray-200">{index + 1}</td>
        <td className="border p-2 text-center bg-gray-200">{equipment?.name}</td>
        <td className="border p-2 text-center bg-gray-200">{request?.lab}</td>
        <td className="border p-2 text-center bg-gray-200">{request?.quantity}</td>
      </tr>
    );
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Confirm Clear Dues"
      >
        <div className="flex flex-col justify-evenly h-full">

          <div>
            {
              studentEquipedData.length !== 0 ?
              <div className="flex flex-col items-center w-full mb-5">
                <h2 className= 'text-gray-500 text-5xl mb-10'>Student has following Items equiped</h2>
                <table className="w-full max-h-[40vh] overflow-auto">
                  <thead>
                    <tr className="bg-gray-400">
                      <th className="border p-2 text-center">S.No.</th>
                      <th className="border p-2 text-center">Equipment Name</th>
                      <th className="border p-2 text-center">Lab</th>
                      <th className="border p-2 text-center">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                  {studentEquipedData.map((data, index) => renderEquipmentDetails(data, index))}
                  </tbody>
                </table>
              </div>
              : 
              <div className="flex flex-col items-center w-full">
                <h2 className= 'text-gray-500 text-5xl mt-10'>Student has no Item equiped</h2>
              </div>
            }
          </div>
          <div className={`flex flex-col items-center ${studentEquipedData.length === 0 ? `justify-center h-full`: `justify-end`} `}>  
            <h2 className={`${studentEquipedData.length === 0 ? `text-5xl mb-4`:'text-3xl'}`}>Are you sure?</h2>
            <p className={`${studentEquipedData.length === 0 ? `text-2xl mb-3`:'text-2xl mb-1'}`}>{`You want to clear dues of ${studentEmailToDelete} ?`}</p>
            <div>
              <button 
                onClick={handleClearDues}
                className="mr-2 p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
              >
                Clear Dues
              </button>
              <button 
                onClick={closeModal}
                className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {loading ? (
        <div className="flex justify-center">
          <ClipLoader
            color={'#3dafaa'}
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="ml-2">
          <div className="flex items-center mb-4">
            <div className="mr-2">
              <label className="block mb-0">Batch:</label>
              {renderFilterOptions(
                ['btech', 'mtech', 'phd'],
                setSelectedBatch,
                selectedBatch
              )}
            </div>
            <div className="mr-2">
              <label className="block mb-0">Branch:</label>
              {renderFilterOptions(
                ['cse', 'csb', 'csam', 'csd', 'ece', 'csss', 'vlsi', 'csai'],
                setSelectedBranch,
                selectedBranch
              )}
            </div>
            <div>
              <label className="block mb-0">Graduation Year:</label>
              {renderFilterOptions(
                ["2023", "2024", "2025", "2026", "2027", "2028", "2029"],
                setSelectedGraduationYear,
                selectedGraduationYear
              )}
            </div>
          </div>
          <div className="overflow-auto max-w-[80vw] max-h-[80vh]">
            <table className="w-full border-collapse border">
              <thead className="sticky top-0">{renderHeader()}</thead>
              <tbody>
                {students.map((student, index) => renderRow(student, index))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
