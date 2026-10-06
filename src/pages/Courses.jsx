import { useEffect, useState } from "react";
import "./Courses.css";

function Courses() {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/courses/visible",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch courses");
            }

            const data = await response.json();

            setCourses(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleEnroll = async (courseId) => {

        console.log("Enroll button clicked:", courseId);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/enrollments/${courseId}`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const responseText = await response.text();

            console.log("Status:", response.status);
            console.log(
                "Enrollment response:",
                responseText
            );

            if (!response.ok) {
                throw new Error(
                    responseText ||
                    `Enrollment failed (${response.status})`
                );
            }

            setMessage("Enrollment successful!");

        } catch (error) {

            console.error(
                "Enrollment error:",
                error
            );

            setMessage(error.message);
        }
    };


    const handlePayment = async (courseId) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/payments/create-order/${courseId}`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to create payment order"
                );
            }

            console.log(
                "Razorpay Order:",
                data
            );

            const options = {

                key: "rzp_test_TiWXdUBYGJUE2z",

                amount: data.amount,

                currency: data.currency,

                name: "E-Learning Platform",

                description: "Course Enrollment",

                order_id: data.id,

                handler: async function (response) {

                    console.log(
                        "Payment Response:",
                        response
                    );

                    try {

                        const token =
                            localStorage.getItem("token");

                        const verifyResponse =
                            await fetch(
                                `http://localhost:8080/api/payments/verify/${courseId}?` +
                                `orderId=${encodeURIComponent(
                                    response.razorpay_order_id
                                )}` +
                                `&paymentId=${encodeURIComponent(
                                    response.razorpay_payment_id
                                )}` +
                                `&signature=${encodeURIComponent(
                                    response.razorpay_signature
                                )}`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Authorization":
                                            `Bearer ${token}`
                                    }
                                }
                            );

                        const result =
                            await verifyResponse.text();

                        console.log(
                            "Payment Verification:",
                            result
                        );

                        if (!verifyResponse.ok) {
                            throw new Error(
                                result ||
                                "Payment verification failed"
                            );
                        }

                        setMessage(
                            "Payment successful! You are enrolled."
                        );

                    } catch (error) {

                        console.error(
                            "Payment verification error:",
                            error
                        );

                        setMessage(
                            error.message
                        );
                    }
                },

                prefill: {
                    name:
                        localStorage.getItem(
                            "username"
                        ) || "",
                },

                theme: {
                    color: "#2563eb"
                }
            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.error(
                "Payment error:",
                error
            );

            setMessage(error.message);
        }
    };


    if (loading) {

        return (
            <div className="courses-page">

                <div className="courses-loading">
                    <div className="loading-icon">
                        📚
                    </div>

                    <h2>
                        Loading courses...
                    </h2>

                    <p>
                        Please wait while we fetch
                        available courses.
                    </p>
                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="courses-page">

                <div className="courses-error">
                    ⚠️ {error}
                </div>

            </div>
        );
    }


    return (

        <div className="courses-page">

            {/* Header */}

            <div className="courses-header">

                <div>

                    <span className="courses-label">
                        📚 LEARNING
                    </span>

                    <h1>
                        Available Courses
                    </h1>

                    <p>
                        Explore our courses and start
                        learning something new today.
                    </p>

                </div>

                <div className="courses-header-icon">
                    🎓
                </div>

            </div>


            {/* Message */}

            {message && (

                <div className="course-message">
                    ✅ {message}
                </div>

            )}


            {/* Courses */}

            {courses.length === 0 ? (

                <div className="empty-courses">

                    <div>
                        📚
                    </div>

                    <h2>
                        No courses available
                    </h2>

                    <p>
                        There are currently no published
                        courses.
                    </p>

                </div>

            ) : (

                <div className="courses-grid">

                    {courses.map((course) => (

                        <div
                            className="course-card"
                            key={course.id}
                        >

                            <div className="course-card-top">

                                <div className="course-icon">
                                    📖
                                </div>

                                <span className="course-badge">
                                    Available
                                </span>

                            </div>


                            <h2>
                                {course.title}
                            </h2>


                            <p className="course-description">
                                {course.description}
                            </p>


                            <div className="course-info">

                                <div className="course-info-item">

                                    <span>
                                        👨‍🏫 Trainer
                                    </span>

                                    <strong>
                                        {course.trainerUsername}
                                    </strong>

                                </div>

                                <div className="course-info-item">

                                    <span>
                                        💰 Price
                                    </span>

                                    <strong className="course-price">
                                        ₹{course.price}
                                    </strong>

                                </div>

                            </div>


                            <button
                                className="pay-button"
                                onClick={() =>
                                    handlePayment(course.id)
                                }
                            >
                                💳 Pay & Enroll
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Courses;