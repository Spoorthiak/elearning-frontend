import { Link } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {

    return (
        <div className="student-dashboard">

            {/* Welcome Section */}
            <section className="student-welcome">

                <div>
                    <span className="welcome-label">
                        👋 Welcome back!
                    </span>

                    <h1>
                        Student Dashboard
                    </h1>

                    <p>
                        Continue your learning journey and explore
                        new courses.
                    </p>
                </div>

                <div className="welcome-icon">
                    🎓
                </div>

            </section>


            {/* Quick Actions */}
            <h2 className="student-section-title">
                What would you like to do?
            </h2>


            <div className="student-action-grid">

                {/* Browse Courses */}
                <div className="student-action-card">

                    <div className="action-icon blue-icon">
                        📚
                    </div>

                    <h2>
                        Browse Courses
                    </h2>

                    <p>
                        Explore available courses and discover
                        something new to learn.
                    </p>

                    <Link to="/courses">
                        <button className="student-action-btn blue-btn">
                            Browse Courses →
                        </button>
                    </Link>

                </div>


                {/* My Enrollments */}
                <div className="student-action-card">

                    <div className="action-icon green-icon">
                        🎓
                    </div>

                    <h2>
                        My Enrollments
                    </h2>

                    <p>
                        View the courses you have enrolled in and
                        continue your learning.
                    </p>

                    <Link to="/my-enrollments">
                        <button className="student-action-btn green-btn">
                            My Enrollments →
                        </button>
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default StudentDashboard;