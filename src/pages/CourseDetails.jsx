import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Comments from "../components/Comments";

import "./CourseDetails.css";


function CourseDetails() {

    const { courseId } = useParams();

    const [lessons, setLessons] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [completedLessons, setCompletedLessons] = useState([]);

    const completedCount = completedLessons.length;


    useEffect(() => {

        fetchLessons();

        fetchProgress();

    }, [courseId]);


    // FETCH LESSONS

    const fetchLessons = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/courses/${courseId}/lessons`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch lessons");
            }

            const data = await response.json();

            setLessons(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };


    // FETCH PROGRESS

    const fetchProgress = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/progress/courses/${courseId}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch progress");
            }

            const data = await response.json();

            const completedLessonIds = data
                .filter((progress) => progress.completed)
                .map((progress) => progress.lessonId);

            setCompletedLessons(completedLessonIds);

        } catch (error) {

            console.error(
                "Progress fetch error:",
                error
            );

        }
    };


    // MARK LESSON COMPLETED

    const markLessonCompleted = async (lessonId) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/progress/lessons/${lessonId}/complete`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to update progress");
            }

            const data = await response.json();

            console.log("Progress:", data);

            setCompletedLessons((previous) => {

                if (previous.includes(lessonId)) {
                    return previous;
                }

                return [
                    ...previous,
                    lessonId
                ];

            });

        } catch (error) {

            console.error(
                "Progress error:",
                error
            );

        }
    };


    // CONVERT YOUTUBE URL TO EMBED URL

    const getYouTubeEmbedUrl = (url) => {

        if (!url) {
            return null;
        }

        try {

            const parsedUrl = new URL(url);

            let videoId = "";

            // https://www.youtube.com/watch?v=VIDEO_ID

            if (
                parsedUrl.hostname.includes("youtube.com") &&
                parsedUrl.pathname === "/watch"
            ) {

                videoId =
                    parsedUrl.searchParams.get("v") || "";

            }

            // https://youtu.be/VIDEO_ID

            else if (
                parsedUrl.hostname === "youtu.be"
            ) {

                videoId =
                    parsedUrl.pathname.substring(1);

            }

            // https://www.youtube.com/shorts/VIDEO_ID

            else if (
                parsedUrl.hostname.includes("youtube.com") &&
                parsedUrl.pathname.startsWith("/shorts/")
            ) {

                videoId =
                    parsedUrl.pathname
                        .split("/shorts/")[1]
                        .split("/")[0];

            }

            // https://www.youtube.com/embed/VIDEO_ID

            else if (
                parsedUrl.hostname.includes("youtube.com") &&
                parsedUrl.pathname.startsWith("/embed/")
            ) {

                videoId =
                    parsedUrl.pathname
                        .split("/embed/")[1]
                        .split("/")[0];

            }

            if (!videoId) {
                return null;
            }

            /*
             * Explicitly tell YouTube that the player
             * is being loaded from our React application.
             */

            return (
                `https://www.youtube.com/embed/${videoId}` +
                `?enablejsapi=1` +
                `&origin=${encodeURIComponent(
                    "http://localhost:5173"
                )}`
            );

        } catch (error) {

            console.error(
                "Invalid YouTube URL:",
                url
            );

            return null;
        }
    };


    const progressPercentage =
        lessons.length === 0
            ? 0
            : Math.round(
                (completedCount / lessons.length) * 100
            );


    // LOADING

    if (loading) {

        return (

            <div className="course-details-page">

                <div className="course-details-loading">

                    <div className="details-loading-icon">
                        📖
                    </div>

                    <h2>
                        Loading course...
                    </h2>

                    <p>
                        Please wait while we load the lessons.
                    </p>

                </div>

            </div>

        );

    }


    // ERROR

    if (error) {

        return (

            <div className="course-details-page">

                <div className="course-details-error">
                    ⚠️ {error}
                </div>

            </div>

        );

    }


    return (

        <div className="course-details-page">


            {/* COURSE HEADER */}

            <section className="course-details-header">

                <div>

                    <span className="details-label">
                        📖 COURSE DETAILS
                    </span>

                    <h1>
                        Course Learning
                    </h1>

                    <p>
                        Continue learning and track your progress
                        lesson by lesson.
                    </p>

                </div>

                <div className="details-header-icon">
                    🎓
                </div>

            </section>


            {/* PROGRESS SECTION */}

            <section className="progress-card">

                <div className="progress-top">

                    <div>

                        <span className="progress-label">
                            YOUR PROGRESS
                        </span>

                        <h2>
                            {progressPercentage}% Complete
                        </h2>

                    </div>

                    <div className="progress-count">
                        {completedCount} / {lessons.length}
                    </div>

                </div>


                <div className="progress-bar-background">

                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${progressPercentage}%`
                        }}
                    />

                </div>


                <p>
                    {completedCount} of {lessons.length} lessons completed
                </p>

            </section>


            {/* LESSONS */}

            <div className="lessons-heading">

                <div>

                    <h2>
                        Course Lessons
                    </h2>

                    <p>
                        Complete each lesson to track your
                        learning progress.
                    </p>

                </div>

                <span className="lesson-count">
                    {lessons.length} Lessons
                </span>

            </div>


            {lessons.length === 0 ? (

                <div className="no-lessons">

                    <div>
                        📚
                    </div>

                    <h3>
                        No lessons available
                    </h3>

                    <p>
                        Lessons will appear here when they
                        are added to this course.
                    </p>

                </div>

            ) : (

                <div className="lessons-list">

                    {lessons.map((lesson) => {

                        const isCompleted =
                            completedLessons.includes(
                                lesson.id
                            );

                        const videoEmbedUrl =
                            getYouTubeEmbedUrl(
                                lesson.videoUrl
                            );


                        return (

                            <div
                                className={`lesson-item ${
                                    isCompleted
                                        ? "lesson-completed"
                                        : ""
                                }`}
                                key={lesson.id}
                            >


                                {/* LESSON NUMBER */}

                                <div className="lesson-number">

                                    {isCompleted
                                        ? "✓"
                                        : lesson.lessonOrder}

                                </div>


                                {/* LESSON CONTENT */}

                                <div className="lesson-content">

                                    <h3>
                                        {lesson.title}
                                    </h3>

                                    <p>
                                        {lesson.content}
                                    </p>


                                    {/* VIDEO */}

                                    {lesson.videoUrl &&
                                    videoEmbedUrl ? (

                                        <div className="lesson-video-container">

                                            <iframe
                                                width="100%"
                                                height="400"
                                                src={videoEmbedUrl}
                                                title={lesson.title}
                                                frameBorder="0"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />

                                        </div>

                                    ) : lesson.videoUrl ? (

                                        <div className="video-error">

                                            ⚠️ Invalid YouTube video URL.

                                        </div>

                                    ) : (

                                        <div className="no-video">

                                            🎥 No video available
                                            for this lesson.

                                        </div>

                                    )}

                                </div>


                                {/* LESSON ACTION */}

                                <div className="lesson-action">

                                    {isCompleted ? (

                                        <span className="completed-badge">
                                            ✅ Completed
                                        </span>

                                    ) : (

                                        <button
                                            className="complete-btn"
                                            onClick={() =>
                                                markLessonCompleted(
                                                    lesson.id
                                                )
                                            }
                                        >
                                            Mark as Completed
                                        </button>

                                    )}

                                </div>


                            </div>

                        );

                    })}

                </div>

            )}


            {/* COMMENTS */}

            <section className="course-comments-section">

                <div className="comments-heading">

                    <h2>
                        💬 Course Discussion
                    </h2>

                    <p>
                        Ask questions and share your thoughts
                        about this course.
                    </p>

                </div>

                <Comments
                    courseId={courseId}
                />

            </section>


        </div>

    );

}


export default CourseDetails;