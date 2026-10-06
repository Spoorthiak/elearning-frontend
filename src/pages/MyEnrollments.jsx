import { useEffect, useState } from "react";
import "./MyEnrollments.css";

function MyEnrollments() {

    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyEnrollments();
    }, []);

    const fetchMyEnrollments = async () => {

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/enrollments/my-enrollments",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch enrollments");
            }

            const data = await response.json();

            setEnrollments(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="enrollments-page">
                <div className="enrollments-loading">
                    <div className="enrollment-loading-icon">
                        🎓
                    </div>

                    <h2>Loading your enrollments...</h2>

                    <p>
                        Please wait while we fetch your courses.
                    </p>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="enrollments-page">
                <div className="enrollments-error">
                    ⚠️ {error}
                </div>
            </div>
        );
    }


    return (
        <div className="enrollments-page">

            {/* Header */}

            <div className="enrollments-header">

                <div>

                    <span className="enrollments-label">
                        🎓 MY LEARNING
                    </span>

                    <h1>
                        My Enrollments
                    </h1>

                    <p>
                        Continue learning from the courses
                        you have enrolled in.
                    </p>

                </div>

                <div className="enrollments-header-icon">
                    📚
                </div>

            </div>


            {/* Enrollment Count */}

            {enrollments.length > 0 && (
                <div className="enrollment-count">
                    <strong>
                        {enrollments.length}
                    </strong>

                    <span>
                        {enrollments.length === 1
                            ? " Course Enrolled"
                            : " Courses Enrolled"}
                    </span>
                </div>
            )}


            {/* Empty State */}

            {enrollments.length === 0 ? (

                <div className="empty-enrollments">

                    <div className="empty-enrollment-icon">
                        🎓
                    </div>

                    <h2>
                        No enrollments yet
                    </h2>

                    <p>
                        You haven't enrolled in any courses yet.
                        Explore available courses and start learning.
                    </p>

                    <a
                        href="/courses"
                        className="browse-courses-btn"
                    >
                        Browse Courses →
                    </a>

                </div>

            ) : (

                <div className="enrollments-grid">

                    {enrollments.map((enrollment) => (

                        <div
                            className="enrollment-card"
                            key={enrollment.id}
                        >

                            {/* Card Header */}

                            <div className="enrollment-card-header">

                                <div className="enrollment-icon">
                                    📖
                                </div>

                                <span className="status-badge">
                                    {enrollment.status}
                                </span>

                            </div>


                            {/* Course */}

                            <h2>
                                {enrollment.courseTitle}
                            </h2>


                            <div className="enrollment-details">

                                <div className="enrollment-detail">

                                    <span>
                                        👤 Student
                                    </span>

                                    <strong>
                                        {enrollment.studentUsername}
                                    </strong>

                                </div>


                                <div className="enrollment-detail">

                                    <span>
                                        📅 Enrolled On
                                    </span>

                                    <strong>
                                        {enrollment.enrolledAt}
                                    </strong>

                                </div>

                            </div>


                            {/* Button */}

                            <button
                                className="view-course-btn"
                                onClick={() =>
                                    window.location.href =
                                    `/courses/${enrollment.courseId}`
                                }
                            >
                                Continue Learning →
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyEnrollments;