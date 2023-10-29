import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavbar from '../Components/AdminNavbar.jsx';
import StudentSideBar from '../Components/StudentSideBar.jsx';
import StudentEquipment from '../Components/StudentEquipment.jsx';
import StudentDashBoard from '../Components/StudentDashBoard.jsx';
import StudentBorrowRequest from '../Components/StudentBorrowRequest.jsx';
import FeedbackForm from '../Components/StudentFeedback.jsx';
const StudentPage = () => {
    return (
        <div>
        <AdminNavbar />
        <div className="flex">
          <div className="w-1/6 min-w-[300px]">
            <StudentSideBar />
          </div>
          <div className="flex-1">
            <Routes>
              <Route element={<StudentDashBoard />} path="/" />
              <Route element={<StudentEquipment />} path="/equipments" />
              <Route element={<StudentBorrowRequest />} path="/brequest" />
              <Route element = {<FeedbackForm/>} path='/feedback'/>
            </Routes>
          </div>
        </div>
      </div>
    );
}

export default StudentPage;