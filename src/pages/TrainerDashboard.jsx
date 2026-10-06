import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TrainerDashboard.css";


function TrainerDashboard() {

    const navigate = useNavigate();


    // ==============================
    // ACTIVE SECTION
    // ==============================

    const [activeSection, setActiveSection] = useState("");


    // ==============================
    // COURSE STATES
    // ==============================

    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");


    // ==============================
    // EDIT COURSE STATES
    // ==============================

    const [showEditCourseForm, setShowEditCourseForm] =
        useState(false);

    const [editCourseId, setEditCourseId] =
        useState(null);

    const [editCourseTitle, setEditCourseTitle] =
        useState("");

    const [editCourseDescription, setEditCourseDescription] =
        useState("");

    const [editCoursePrice, setEditCoursePrice] =
        useState("");

    const [editCourseVisible, setEditCourseVisible] =
        useState(true);


    // ==============================
    // MY COURSES
    // ==============================

    const [courses, setCourses] = useState([]);

    const [showCourses, setShowCourses] =
        useState(false);


    // ==============================
    // LESSON STATES
    // ==============================

    const [showLessonForm, setShowLessonForm] =
        useState(false);

    const [selectedCourseId, setSelectedCourseId] =
        useState(null);

    const [lessonTitle, setLessonTitle] =
        useState("");

    const [lessonContent, setLessonContent] =
        useState("");

    const [lessonOrder, setLessonOrder] =
        useState("");

    const [lessonVideoUrl, setLessonVideoUrl] =
        useState("");

    const [lessons, setLessons] =
        useState({});


    // ==============================
    // EDIT LESSON STATES
    // ==============================

    const [showEditLessonForm, setShowEditLessonForm] =
        useState(false);

    const [editLessonId, setEditLessonId] =
        useState(null);

    const [editLessonTitle, setEditLessonTitle] =
        useState("");

    const [editLessonContent, setEditLessonContent] =
        useState("");

    const [editLessonOrder, setEditLessonOrder] =
        useState("");

    const [editLessonVideoUrl, setEditLessonVideoUrl] =
        useState("");


    // ==============================
    // CREATE COURSE
    // ==============================

    const handleCreateCourse = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/courses",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title: title,

                        description: description,

                        price: Number(price),

                        visible: true

                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to create course"
                );
            }

            alert(
                "Course created successfully!"
            );

            setTitle("");
            setDescription("");
            setPrice("");

            setShowForm(false);

            setActiveSection("");

        } catch (error) {

            console.error(
                "Create course error:",
                error
            );

            alert(error.message);
        }
    };


    // ==============================
    // FETCH MY COURSES
    // ==============================

    const fetchMyCourses = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/courses/my-courses",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const responseText =
                await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Unable to fetch courses"
                );
            }

            const data =
                responseText
                    ? JSON.parse(responseText)
                    : [];

            setCourses(data);

            setShowCourses(true);

            for (const course of data) {

                fetchLessons(course.id);
            }

        } catch (error) {

            console.error(
                "My courses error:",
                error
            );

            alert(error.message);
        }
    };


    // ==============================
    // FETCH LESSONS
    // ==============================

    const fetchLessons = async (courseId) => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/courses/${courseId}/lessons`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const responseText =
                await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Unable to fetch lessons"
                );
            }

            const data =
                responseText
                    ? JSON.parse(responseText)
                    : [];

            setLessons((previous) => ({

                ...previous,

                [courseId]: data

            }));

        } catch (error) {

            console.error(
                "Fetch lessons error:",
                error
            );

            alert(error.message);
        }
    };


    // ==============================
    // OPEN CREATE COURSE
    // ==============================

    const openCreateCourse = () => {

        setActiveSection(
            "create-course"
        );

        setShowForm(true);

        setShowCourses(false);

        setShowLessonForm(false);

        setShowEditLessonForm(false);

        setShowEditCourseForm(false);
    };


    // ==============================
    // OPEN MY COURSES
    // ==============================

    const openMyCourses = async () => {

        setActiveSection("courses");

        setShowForm(false);

        setShowLessonForm(false);

        setShowEditLessonForm(false);

        setShowEditCourseForm(false);

        await fetchMyCourses();
    };


    // ==============================
    // OPEN ADD LESSON
    // ==============================

    const openLessonForm = (courseId) => {

        setSelectedCourseId(courseId);

        setLessonTitle("");
        setLessonContent("");
        setLessonOrder("");
        setLessonVideoUrl("");

        setShowLessonForm(true);

        setShowEditLessonForm(false);

        setShowEditCourseForm(false);

        setActiveSection("add-lesson");
    };


    // ==============================
    // CREATE LESSON
    // ==============================

    const handleCreateLesson = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/courses/${selectedCourseId}/lessons`,
                {
                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title: lessonTitle,

                        content: lessonContent,

                        lessonOrder:
                            Number(lessonOrder),

                        videoUrl:
                            lessonVideoUrl

                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to create lesson"
                );
            }

            alert(
                "Lesson created successfully!"
            );

            setLessonTitle("");
            setLessonContent("");
            setLessonOrder("");
            setLessonVideoUrl("");

            setShowLessonForm(false);

            setActiveSection("courses");

            fetchLessons(
                selectedCourseId
            );

        } catch (error) {

            console.error(
                "Create lesson error:",
                error
            );

            alert(error.message);
        }
    };


    // ==============================
    // OPEN EDIT LESSON
    // ==============================

    const openEditLessonForm = (
        lesson,
        courseId
    ) => {

        setSelectedCourseId(courseId);

        setEditLessonId(
            lesson.id
        );

        setEditLessonTitle(
            lesson.title
        );

        setEditLessonContent(
            lesson.content
        );

        setEditLessonOrder(
            lesson.lessonOrder
        );

        setEditLessonVideoUrl(
            lesson.videoUrl || ""
        );

        setShowEditLessonForm(true);

        setShowLessonForm(false);

        setShowEditCourseForm(false);

        setActiveSection("edit-lesson");
    };


    // ==============================
    // UPDATE LESSON
    // ==============================

    const handleUpdateLesson = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/courses/${selectedCourseId}/lessons/${editLessonId}`,
                {
                    method: "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title:
                            editLessonTitle,

                        content:
                            editLessonContent,

                        lessonOrder:
                            Number(editLessonOrder),

                        videoUrl:
                            editLessonVideoUrl

                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to update lesson"
                );
            }

            alert(
                "Lesson updated successfully!"
            );

            setShowEditLessonForm(false);

            setEditLessonId(null);

            setEditLessonTitle("");

            setEditLessonContent("");

            setEditLessonOrder("");

            setEditLessonVideoUrl("");

            setActiveSection("courses");

            fetchLessons(
                selectedCourseId
            );

        } catch (error) {

            console.error(
                "Update lesson error:",
                error
            );

            alert(error.message);
        }
    };


    // ==============================
    // DELETE LESSON
    // ==============================

    const handleDeleteLesson = async (
        lessonId,
        courseId
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this lesson?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}`,
                {
                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.text();

            if (!response.ok) {

                throw new Error(
                    data ||
                    "Unable to delete lesson"
                );
            }

            alert(data);

            fetchLessons(courseId);

        } catch (error) {

            console.error(
                "Delete lesson error:",
                error
            );

            alert(error.message);
        }
    };


    // ==============================
    // OPEN EDIT COURSE
    // ==============================

    const openEditCourseForm = (
        course
    ) => {

        setEditCourseId(
            course.id
        );

        setEditCourseTitle(
            course.title
        );

        setEditCourseDescription(
            course.description
        );

        setEditCoursePrice(
            course.price
        );

        setEditCourseVisible(
            course.visible
        );

        setShowEditCourseForm(true);

        setShowForm(false);

        setShowLessonForm(false);

        setShowEditLessonForm(false);

        setActiveSection(
            "edit-course"
        );
    };


    // ==============================
    // UPDATE COURSE
    // ==============================

    const handleUpdateCourse = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/courses/${editCourseId}`,
                {
                    method: "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title:
                            editCourseTitle,

                        description:
                            editCourseDescription,

                        price:
                            Number(editCoursePrice),

                        visible:
                            editCourseVisible

                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to update course"
                );
            }

            alert(
                "Course updated successfully!"
            );

            setShowEditCourseForm(false);

            setEditCourseId(null);

            setEditCourseTitle("");

            setEditCourseDescription("");

            setEditCoursePrice("");

            setEditCourseVisible(true);

            setActiveSection("courses");

            fetchMyCourses();

        } catch (error) {

            console.error(
                "Update course error:",
                error
            );

            alert(error.message);
        }
    };


    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "role"
        );

        navigate("/login");
    };


    return (

        <div className="trainer-dashboard">


            {/* ==========================
                HEADER
            =========================== */}

            <section className="trainer-header">

                <div>

                    <span className="trainer-label">
                        👨‍🏫 TRAINER PANEL
                    </span>

                    <h1>
                        Trainer Dashboard
                    </h1>

                    <p>
                        Create courses, manage lessons,
                        and help students learn.
                    </p>

                </div>

                <div className="trainer-header-icon">
                    🎓
                </div>

            </section>


            {/* ==========================
                MAIN ACTIONS
            =========================== */}

            <div className="trainer-actions">

                <button
                    className="trainer-action-btn create-course-btn"
                    onClick={openCreateCourse}
                >
                    ➕ Create Course
                </button>


                <button
                    className="trainer-action-btn my-courses-btn"
                    onClick={openMyCourses}
                >
                    📚 My Courses
                </button>


                <button
                    className="trainer-action-btn"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </div>


            {/* ==========================
                CREATE COURSE
            =========================== */}

            {activeSection === "create-course" &&
                showForm && (

                <div className="trainer-form-card">

                    <h2>
                        ➕ Create New Course
                    </h2>

                    <form
                        onSubmit={handleCreateCourse}
                    >

                        <div className="trainer-form-group">

                            <label>
                                Course Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="trainer-form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="trainer-form-group">

                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                value={price}
                                onChange={(e) =>
                                    setPrice(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="form-submit-btn"
                            >
                                Create Course
                            </button>

                            <button
                                type="button"
                                className="form-cancel-btn"
                                onClick={() => {
                                    setShowForm(false);
                                    setActiveSection("");
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ==========================
                EDIT COURSE
            =========================== */}

            {activeSection === "edit-course" &&
                showEditCourseForm && (

                <div className="trainer-form-card">

                    <h2>
                        ✏️ Edit Course
                    </h2>

                    <form
                        onSubmit={handleUpdateCourse}
                    >

                        <div className="trainer-form-group">

                            <label>
                                Course Title
                            </label>

                            <input
                                type="text"
                                value={editCourseTitle}
                                onChange={(e) =>
                                    setEditCourseTitle(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="trainer-form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                value={
                                    editCourseDescription
                                }
                                onChange={(e) =>
                                    setEditCourseDescription(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="trainer-form-group">

                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                value={editCoursePrice}
                                onChange={(e) =>
                                    setEditCoursePrice(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="trainer-form-group">

                            <label>
                                Visibility
                            </label>

                            <select
                                value={
                                    editCourseVisible
                                        ? "true"
                                        : "false"
                                }
                                onChange={(e) =>
                                    setEditCourseVisible(
                                        e.target.value ===
                                        "true"
                                    )
                                }
                            >

                                <option value="true">
                                    Visible
                                </option>

                                <option value="false">
                                    Hidden
                                </option>

                            </select>

                        </div>


                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="form-submit-btn"
                            >
                                Update Course
                            </button>

                            <button
                                type="button"
                                className="form-cancel-btn"
                                onClick={() => {
                                    setShowEditCourseForm(false);
                                    setActiveSection("courses");
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ==========================
                ADD LESSON
            =========================== */}

            {activeSection === "add-lesson" &&
                showLessonForm && (

                <div className="trainer-form-card">

                    <h2>
                        ➕ Add Lesson
                    </h2>

                    <p>
                        Course ID: {selectedCourseId}
                    </p>


                    <form
                        onSubmit={handleCreateLesson}
                    >

                        <div className="trainer-form-group">

                            <label>
                                Lesson Title
                            </label>

                            <input
                                type="text"
                                value={lessonTitle}
                                onChange={(e) =>
                                    setLessonTitle(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="trainer-form-group">

                            <label>
                                Lesson Content
                            </label>

                            <textarea
                                value={lessonContent}
                                onChange={(e) =>
                                    setLessonContent(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="trainer-form-group">

                            <label>
                                Lesson Order
                            </label>

                            <input
                                type="number"
                                value={lessonOrder}
                                onChange={(e) =>
                                    setLessonOrder(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* ==========================
                            VIDEO URL
                        =========================== */}

                        <div className="trainer-form-group">

                            <label>
                                YouTube Video URL
                            </label>

                            <input
                                type="url"
                                value={lessonVideoUrl}
                                onChange={(e) =>
                                    setLessonVideoUrl(
                                        e.target.value
                                    )
                                }
                                placeholder="https://www.youtube.com/watch?v=M7lc1UVf-VE"
                            />

                            <small>
                                Paste the normal YouTube video
                                URL here.
                            </small>

                        </div>


                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="form-submit-btn"
                            >
                                Create Lesson
                            </button>

                            <button
                                type="button"
                                className="form-cancel-btn"
                                onClick={() => {
                                    setShowLessonForm(false);
                                    setActiveSection("courses");
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ==========================
                EDIT LESSON
            =========================== */}

            {activeSection === "edit-lesson" &&
                showEditLessonForm && (

                <div className="trainer-form-card">

                    <h2>
                        ✏️ Edit Lesson
                    </h2>


                    <form
                        onSubmit={handleUpdateLesson}
                    >

                        <div className="trainer-form-group">

                            <label>
                                Lesson Title
                            </label>

                            <input
                                type="text"
                                value={editLessonTitle}
                                onChange={(e) =>
                                    setEditLessonTitle(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="trainer-form-group">

                            <label>
                                Lesson Content
                            </label>

                            <textarea
                                value={editLessonContent}
                                onChange={(e) =>
                                    setEditLessonContent(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="trainer-form-group">

                            <label>
                                Lesson Order
                            </label>

                            <input
                                type="number"
                                value={editLessonOrder}
                                onChange={(e) =>
                                    setEditLessonOrder(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* ==========================
                            EDIT VIDEO URL
                        =========================== */}

                        <div className="trainer-form-group">

                            <label>
                                YouTube Video URL
                            </label>

                            <input
                                type="url"
                                value={
                                    editLessonVideoUrl
                                }
                                onChange={(e) =>
                                    setEditLessonVideoUrl(
                                        e.target.value
                                    )
                                }
                                placeholder="https://www.youtube.com/watch?v=M7lc1UVf-VE"
                            />

                            <small>
                                Paste the normal YouTube video
                                URL here.
                            </small>

                        </div>


                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="form-submit-btn"
                            >
                                Update Lesson
                            </button>

                            <button
                                type="button"
                                className="form-cancel-btn"
                                onClick={() => {
                                    setShowEditLessonForm(false);
                                    setActiveSection("courses");
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ==========================
                MY COURSES
            =========================== */}

            {activeSection === "courses" &&
                showCourses && (

                <section className="my-courses-section">

                    <div className="section-heading">

                        <div>

                            <span>
                                📚 MY COURSES
                            </span>

                            <h2>
                                Courses Created By You
                            </h2>

                        </div>

                    </div>


                    {courses.length === 0 ? (

                        <div className="no-courses">

                            <h3>
                                No courses found
                            </h3>

                            <p>
                                Create your first course
                                to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="trainer-course-grid">

                            {courses.map((course) => (

                                <div
                                    className="trainer-course-card"
                                    key={course.id}
                                >

                                    <div className="trainer-course-top">

                                        <div className="trainer-course-icon">
                                            📖
                                        </div>

                                        <span
                                            className={
                                                course.visible
                                                    ? "visibility-badge visible-badge"
                                                    : "visibility-badge hidden-badge"
                                            }
                                        >
                                            {course.visible
                                                ? "Visible"
                                                : "Hidden"}
                                        </span>

                                    </div>


                                    <h3>
                                        {course.title}
                                    </h3>


                                    <p>
                                        {course.description}
                                    </p>


                                    <div className="course-meta">

                                        <span>
                                            ₹{course.price}
                                        </span>

                                        <span>
                                            Course ID:
                                            {" "}
                                            {course.id}
                                        </span>

                                    </div>


                                    <div className="course-actions">

                                        <button
                                            className="course-action-btn edit-course-btn"
                                            onClick={() =>
                                                openEditCourseForm(
                                                    course
                                                )
                                            }
                                        >
                                            ✏️ Edit Course
                                        </button>


                                        <button
                                            className="course-action-btn add-lesson-btn"
                                            onClick={() =>
                                                openLessonForm(
                                                    course.id
                                                )
                                            }
                                        >
                                            ➕ Add Lesson
                                        </button>

                                    </div>


                                    {/* LESSONS */}

                                    <div className="lessons-section">

                                        <h4>
                                            📚 Lessons
                                        </h4>


                                        {!lessons[course.id] ||
                                        lessons[course.id].length === 0 ? (

                                            <p>
                                                No lessons added
                                                yet.
                                            </p>

                                        ) : (

                                            lessons[course.id].map(
                                                (lesson) => (

                                                    <div
                                                        className="lesson-row"
                                                        key={lesson.id}
                                                    >

                                                        <div>

                                                            <strong>
                                                                {lesson.lessonOrder}.
                                                                {" "}
                                                                {lesson.title}
                                                            </strong>

                                                            <br />

                                                            {lesson.videoUrl ? (

                                                                <small>
                                                                    🎥 Video
                                                                    available
                                                                </small>

                                                            ) : (

                                                                <small>
                                                                    🎥 No video
                                                                </small>

                                                            )}

                                                        </div>


                                                        <div className="lesson-actions">

                                                            <button
                                                                className="edit-lesson-btn"
                                                                onClick={() =>
                                                                    openEditLessonForm(
                                                                        lesson,
                                                                        course.id
                                                                    )
                                                                }
                                                            >
                                                                ✏️ Edit
                                                            </button>


                                                            <button
                                                                className="delete-lesson-btn"
                                                                onClick={() =>
                                                                    handleDeleteLesson(
                                                                        lesson.id,
                                                                        course.id
                                                                    )
                                                                }
                                                            >
                                                                🗑️ Delete
                                                            </button>

                                                        </div>

                                                    </div>

                                                )
                                            )

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            )}

        </div>
    );
}


export default TrainerDashboard;