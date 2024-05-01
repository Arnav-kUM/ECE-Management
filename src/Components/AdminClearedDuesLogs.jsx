import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

function AdminClearedDuesLogs() {
    const [loading, setLoading] = useState(true);
    const [tabledata, setTableData] = useState([]);
    const token= localStorage.getItem("token");

    useEffect(() => {
        setLoading(true);
        fetchDuesLogs();
      }, []);

    const fetchDuesLogs = async () => {
        try {
            const response = await fetch(
              `http://localhost:3000/api/auth/dueslogs`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const res = await response.json();
            setLoading(false);
            if(!res.success){
                alert(res.message);
            }
            else{
                setTableData(res.data);
            }
        } 
        catch (error) {
            console.error("Error clearing dues:", error);
        }
    };

    const renderHeader = () => {
        return (
            <tr className="bg-[#3dafaa] text-white">
                <th className="border p-2 text-center">S.No</th>
                <th className="border p-2 text-center">Student Email ID</th>
                <th className="border p-2 text-center">Student Contact No.</th>
                <th className="border p-2 text-center">Dues Cleared By</th>
                <th className="border p-2 text-center">Dues Cleared on</th>
            </tr>
        );
    }

    const renderRow = (data, index) => {
        const formattedDuesClearedDate = new Date(data.student.duesClearedOn).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
        );
        return (
            <tr key={index}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2 text-center">{data.student.email}</td>
              <td className="border p-2 text-center">{data.student.contactNumber}</td>
              <td className="border p-2 text-center">{data.admin}</td>
              <td className="border p-2 text-center">{formattedDuesClearedDate}</td>
            </tr>
        );
    }

    return (
        <div>
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
                <div className="overflow-auto max-w-[80vw] max-h-[80vh] ml-2">
                    <table className="w-full border-collapse border">
                    <thead className="sticky top-0">{renderHeader()}</thead>
                    <tbody>
                    {tabledata.map((data, index) => renderRow(data, index))}
                    </tbody>
                    </table>
                </div>
            )
            
            }
        </div>
    );
}

export default AdminClearedDuesLogs
