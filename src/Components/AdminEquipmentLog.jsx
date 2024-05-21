import React, { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import {AiOutlineSearch} from "react-icons/ai";

function AdminEquipmentLog({user}) {

  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear()); // this year is to filter render data , by default it is set to current year
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const Host = 'http://localhost:3000/';
  
  useEffect(() => {
    setLoading(true); fetchEquipmentLogData();
  }, [year, searchQuery]);
  
  const fetchEquipmentLogData = async () => {
    try{
      const response = await fetch(`${Host}api/equipment/equipmentLog/${user.lab}/${year}?searchEquipment=${searchQuery}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
      });
      const data = await response.json();
      setEquipmentData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error);
      console.error('Error fetching equipment data: ', error);
    }
  }

  const renderHeaderRow = () => {
    return(
      <tr className='bg-[#3dafaa] text-white'>
        <th className='border p-2 text-center'>S.No.</th>
        <th className='border p-2 text-center'>Old Name | New Name</th>
        <th className='border p-2 text-center'>Old Lab | New Lab</th>
        <th className='border p-2 text-center'>Old Quantity | New Quantity</th>
        <th className='border p-2 text-center'>Old Type | New Type</th>
        <th className='border p-2 text-center'>Updated On</th>
      </tr>
    );
  }

  const renderRow = (equipment, index) => {
    const serialNumber = index + 1;

    const formattedChangeDate = new Date(equipment.dateOfChange).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
    return (
      <tr className='text-center'>
        <td className='border p-2'>{serialNumber}</td>
        <td className='border p-2'>{equipment.oldName} | {equipment.currentName}</td>
        <td className='border p-2'>{equipment.oldLab} | {equipment.currentLab}</td>
        <td className='border p-2'>{equipment.oldQuantity} | {equipment.currentQuantity}</td>
        <td className='border p-2'>{equipment.oldType} | {equipment.currentType}</td>
        <td className='border p-2'>{formattedChangeDate}</td>
      </tr>
    );
  }

  const renderFilterOptions = (setSelectedOption, selectedOption) => (
    <select
      value={selectedOption}
      onChange={(e) => {setSelectedOption(e.target.value); setSearchQuery('');}}
      className="p-2 border rounded"
    >
      <option value="All">All</option>
      <option value={new Date().getFullYear()}>
        {new Date().getFullYear()}
      </option>
    </select>
    
  );

  const handleSearch = (e) => {

    e.preventDefault();
    const inputElement = e.currentTarget.previousSibling;
    const query = inputElement.value;  // Use a local variable
    setSearchQuery(query);
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
        <>
          <div className='flex justify-between ml-2 mb-1 items-center mt-1'>
            <div className='flex items-center'>
              <label className="block mb-0 mr-1">Year:</label>
              {renderFilterOptions(
                setYear,
                year
              )}
              
            </div>
            <form className="w-[350px]" onSubmit={(e) => e.preventDefault()}>
              <div className="relative mr-2">
                <input
                  type="search"
                  placeholder="Search Equipments by name..."
                  className="w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]"

                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button text-white"
                  type="button"
                  onClick={handleSearch}
                >
                  <AiOutlineSearch />
                </button>
              </div>
            </form>
          </div>
          <div className='overflow-auto max-w-[80vw] max-h-[80vh] ml-2'>
            <table className='w-full border-collapse border'>
              <thead className='sticky top-0'>{renderHeaderRow()}</thead>
              <tbody>
                {equipmentData.map((equipment, index) => renderRow(equipment, index))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminEquipmentLog
