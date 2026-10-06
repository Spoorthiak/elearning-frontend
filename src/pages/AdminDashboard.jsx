import { useState } from "react";
import API_URL from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {

    const [users, setUsers] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({});
    const [courses, setCourses] = useState([]);
    const [trainers, setTrainers] = useState([]);

    const [showTrainerForm, setShowTrainerForm] = useState(false);
    const [trainerUsername, setTrainerUsername] = useState("");
    const [trainerPassword, setTrainerPassword] = useState("");

    const [activeSection, setActiveSection] = useState("");

    // FETCH USERS
    const fetchUsers = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/admin/users`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to fetch users"
                );
            }

            setUsers(data);

        } catch (error) {

            console.error(
                "Fetch users error:",
                error
            );

            alert(error.message);
        }
    };

    // UPDATE USER ROLE
    const updateRole = async (userId) => {

        try {

            const token =
                localStorage.getItem("token");

            const role =
                selectedRoles[userId];

            if (!role) {

                alert(
                    "Please select a role"
                );

                return;
            }

            const response = await fetch(
                `${API_URL}/api/admin/users/${userId}/role?role=${encodeURIComponent(role)}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to update role"
                );
            }

            alert(
                "Role updated successfully!"
            );

            fetchUsers();

        } catch (error) {

            console.error(
                "Update role error:",
                error
            );

            alert(error.message);
        }
    };

    // FETCH COURSES
    const fetchCourses = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/courses`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to fetch courses"
                );
            }

            setCourses(data);

        } catch (error) {

            console.error(
                "Fetch courses error:",
                error
            );

            alert(error.message);
        }
    };

    // UPDATE COURSE VISIBILITY
    const updateCourseVisibility = async (
        courseId,
        visible
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/admin/courses/${courseId}/visibility?visible=${visible}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to update course visibility"
                );
            }

            alert(
                visible
                    ? "Course is now visible!"
                    : "Course is now hidden!"
            );

            fetchCourses();

        } catch (error) {

            console.error(
                "Update visibility error:",
                error
            );

            alert(error.message);
        }
    };

    // FETCH TRAINERS
    const fetchTrainers = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/admin/users`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to fetch trainers"
                );
            }

            const trainerUsers =
                data.filter(
                    (user) =>
                        user.role ===
                        "ROLE_TRAINER"
                );

            setTrainers(
                trainerUsers
            );

        } catch (error) {

            console.error(
                "Fetch trainers error:",
                error
            );

            alert(error.message);
        }
    };

    // CREATE TRAINER
    const handleCreateTrainer = async () => {

        if (
            !trainerUsername.trim() ||
            !trainerPassword.trim()
        ) {

            alert(
                "Please enter username and password"
            );

            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/admin/trainers?username=${encodeURIComponent(
                    trainerUsername
                )}&password=${encodeURIComponent(
                    trainerPassword
                )}`,
                {
                    method: "POST",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to create trainer"
                );
            }

            alert(
                "Trainer created successfully!"
            );

            setTrainerUsername("");
            setTrainerPassword("");
            setShowTrainerForm(false);
            setActiveSection("");

        } catch (error) {

            console.error(
                "Create trainer error:",
                error
            );

            alert(error.message);
        }
    };

    // OPEN USERS
    const openUsers = async () => {

        setActiveSection("users");
        setShowTrainerForm(false);

        await fetchUsers();
    };

    // OPEN COURSES
    const openCourses = async () => {

        setActiveSection("courses");
        setShowTrainerForm(false);

        await fetchCourses();
    };

    // OPEN TRAINERS
    const openTrainers = async () => {

        setActiveSection("trainers");
        setShowTrainerForm(false);

        await fetchTrainers();
    };

    // OPEN CREATE TRAINER
    const openCreateTrainer = () => {

        setActiveSection(
            "create-trainer"
        );

        setShowTrainerForm(true);
    };

    return (
        <div className="admin-dashboard">

            {/* HEADER */}

            <section className="admin-header">

                <div>

                    <span className="admin-label">
                        🛡️ ADMIN PORTAL
                    </span>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Manage users, trainers,
                        courses and platform visibility.
                    </p>

                </div>

                <div className="admin-header-icon">
                    🛡️
                </div>

            </section>

            {/* MAIN ACTION BUTTONS */}

            <div className="admin-actions">

                <button
                    className="admin-action-btn users-btn"
                    onClick={openUsers}
                >
                    👥 View Users
                </button>

                <button
                    className="admin-action-btn courses-btn"
                    onClick={openCourses}
                >
                    📚 View Courses
                </button>

                <button
                    className="admin-action-btn trainers-btn"
                    onClick={openTrainers}
                >
                    👨‍🏫 View Trainers
                </button>

                <button
                    className="admin-action-btn create-trainer-btn"
                    onClick={openCreateTrainer}
                >
                    ➕ Create Trainer
                </button>

            </div>

            {/* CREATE TRAINER */}

            {activeSection === "create-trainer" &&
                showTrainerForm && (

                    <div className="admin-form-card">

                        <div className="admin-form-header">

                            <div className="admin-form-icon">
                                👨‍🏫
                            </div>

                            <div>

                                <h2>
                                    Create Trainer
                                </h2>

                                <p>
                                    Add a new trainer account
                                </p>

                            </div>

                        </div>

                        <div className="admin-form-group">

                            <label>
                                Trainer Username
                            </label>

                            <input
                                type="text"
                                value={trainerUsername}
                                onChange={(e) =>
                                    setTrainerUsername(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter username"
                            />

                        </div>

                        <div className="admin-form-group">

                            <label>
                                Trainer Password
                            </label>

                            <input
                                type="password"
                                value={trainerPassword}
                                onChange={(e) =>
                                    setTrainerPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter password"
                            />

                        </div>

                        <div className="admin-form-buttons">

                            <button
                                className="admin-submit-btn"
                                onClick={
                                    handleCreateTrainer
                                }
                            >
                                Create Trainer
                            </button>

                            <button
                                className="admin-cancel-btn"
                                onClick={() => {

                                    setShowTrainerForm(
                                        false
                                    );

                                    setActiveSection(
                                        ""
                                    );

                                    setTrainerUsername(
                                        ""
                                    );

                                    setTrainerPassword(
                                        ""
                                    );
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                )}

            {/* USERS */}

            {activeSection === "users" &&
                users.length > 0 && (

                    <section className="admin-section">

                        <div className="section-heading">

                            <div className="section-heading-icon">
                                👥
                            </div>

                            <div>

                                <h2>
                                    Users
                                </h2>

                                <p>
                                    Manage user roles
                                </p>

                            </div>

                        </div>

                        <div className="users-grid">

                            {users.map(
                                (user) => (

                                    <div
                                        className="user-card"
                                        key={user.id}
                                    >

                                        <div className="user-card-top">

                                            <div className="user-avatar">
                                                👤
                                            </div>

                                            <span
                                                className={`role-badge ${
                                                    user.role ===
                                                    "ROLE_ADMIN"
                                                        ? "admin-role"
                                                        : user.role ===
                                                          "ROLE_TRAINER"
                                                        ? "trainer-role"
                                                        : "student-role"
                                                }`}
                                            >
                                                {user.role.replace(
                                                    "ROLE_",
                                                    ""
                                                )}
                                            </span>

                                        </div>

                                        <h3>
                                            {user.username}
                                        </h3>

                                        <p className="user-role-text">

                                            Current Role:{" "}

                                            <strong>
                                                {user.role}
                                            </strong>

                                        </p>

                                        {user.role !==
                                            "ROLE_ADMIN" && (

                                            <div className="role-update">

                                                <select
                                                    value={
                                                        selectedRoles[
                                                            user.id
                                                        ] ||
                                                        user.role
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedRoles(
                                                            {
                                                                ...selectedRoles,
                                                                [user.id]:
                                                                    e.target.value
                                                            }
                                                        )
                                                    }
                                                >

                                                    <option value="ROLE_STUDENT">
                                                        Student
                                                    </option>

                                                    <option value="ROLE_TRAINER">
                                                        Trainer
                                                    </option>

                                                </select>

                                                <button
                                                    className="update-role-btn"
                                                    onClick={() =>
                                                        updateRole(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    Update Role
                                                </button>

                                            </div>
                                        )}

                                    </div>
                                )
                            )}

                        </div>

                    </section>
                )}

            {/* COURSES */}

            {activeSection === "courses" &&
                courses.length > 0 && (

                    <section className="admin-section">

                        <div className="section-heading">

                            <div className="section-heading-icon">
                                📚
                            </div>

                            <div>

                                <h2>
                                    Courses
                                </h2>

                                <p>
                                    Manage course visibility
                                </p>

                            </div>

                        </div>

                        <div className="admin-course-grid">

                            {courses.map(
                                (course) => (

                                    <div
                                        className="admin-course-card"
                                        key={course.id}
                                    >

                                        <div className="admin-course-top">

                                            <div className="admin-course-icon">
                                                📖
                                            </div>

                                            <span
                                                className={`course-status ${
                                                    course.visible
                                                        ? "course-visible"
                                                        : "course-hidden"
                                                }`}
                                            >
                                                {course.visible
                                                    ? "● Visible"
                                                    : "● Hidden"}
                                            </span>

                                        </div>

                                        <h3>
                                            {course.title}
                                        </h3>

                                        <p className="course-description">
                                            {course.description}
                                        </p>

                                        <div className="course-details">

                                            <div>

                                                <span>
                                                    💰 Price
                                                </span>

                                                <strong>
                                                    ₹{course.price}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    👨‍🏫 Trainer
                                                </span>

                                                <strong>
                                                    {course.trainerUsername}
                                                </strong>

                                            </div>

                                        </div>

                                        <button
                                            className={`visibility-btn ${
                                                course.visible
                                                    ? "hide-course-btn"
                                                    : "show-course-btn"
                                            }`}
                                            onClick={() =>
                                                updateCourseVisibility(
                                                    course.id,
                                                    !course.visible
                                                )
                                            }
                                        >
                                            {course.visible
                                                ? "🙈 Hide Course"
                                                : "👁️ Show Course"}
                                        </button>

                                    </div>
                                )
                            )}

                        </div>

                    </section>
                )}

            {/* TRAINERS */}

            {activeSection === "trainers" &&
                trainers.length > 0 && (

                    <section className="admin-section">

                        <div className="section-heading">

                            <div className="section-heading-icon">
                                👨‍🏫
                            </div>

                            <div>

                                <h2>
                                    Trainers
                                </h2>

                                <p>
                                    View all trainer accounts
                                </p>

                            </div>

                        </div>

                        <div className="trainers-grid">

                            {trainers.map(
                                (trainer) => (

                                    <div
                                        className="trainer-card"
                                        key={trainer.id}
                                    >

                                        <div className="trainer-avatar">
                                            👨‍🏫
                                        </div>

                                        <div className="trainer-info">

                                            <h3>
                                                {trainer.username}
                                            </h3>

                                            <span className="trainer-badge">
                                                ROLE_TRAINER
                                            </span>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </section>
                )}

            {/* NO USERS MESSAGE */}

            {activeSection === "users" &&
                users.length === 0 && (

                    <div className="admin-form-card">

                        <h2>
                            👥 Users
                        </h2>

                        <p>
                            No users found.
                        </p>

                    </div>
                )}

            {/* NO COURSES MESSAGE */}

            {activeSection === "courses" &&
                courses.length === 0 && (

                    <div className="admin-form-card">

                        <h2>
                            📚 Courses
                        </h2>

                        <p>
                            No courses found.
                        </p>

                    </div>
                )}

            {/* NO TRAINERS MESSAGE */}

            {activeSection === "trainers" &&
                trainers.length === 0 && (

                    <div className="admin-form-card">

                        <h2>
                            👨‍🏫 Trainers
                        </h2>

                        <p>
                            No trainers found.
                        </p>

                    </div>
                )}

        </div>
    );
}

export default AdminDashboard;