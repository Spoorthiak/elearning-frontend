import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Courses from "./pages/Courses";
import MyEnrollments from "./pages/MyEnrollments";
import CourseDetails from "./pages/CourseDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";


function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* ROOT */}

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />


                {/* AUTHENTICATION */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* STUDENT */}

                <Route
                    path="/student-dashboard"
                    element={
                        <ProtectedRoute
                            allowedRole="ROLE_STUDENT"
                        >
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* TRAINER */}

                <Route
                    path="/trainer-dashboard"
                    element={
                        <ProtectedRoute
                            allowedRole="ROLE_TRAINER"
                        >
                            <TrainerDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ADMIN */}

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute
                            allowedRole="ROLE_ADMIN"
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* STUDENT PAGES */}

                <Route
                    path="/my-enrollments"
                    element={
                        <ProtectedRoute
                            allowedRole="ROLE_STUDENT"
                        >
                            <MyEnrollments />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/courses"
                    element={
                        <ProtectedRoute
                            allowedRole="ROLE_STUDENT"
                        >
                            <Courses />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/courses/:courseId"
                    element={
                        <ProtectedRoute
                            allowedRole="ROLE_STUDENT"
                        >
                            <CourseDetails />
                        </ProtectedRoute>
                    }
                />


            </Routes>

        </BrowserRouter>
    );
}

export default App;