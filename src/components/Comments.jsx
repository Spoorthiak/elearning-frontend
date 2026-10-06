import { useEffect, useState } from "react";
import API_URL from "../services/api";
import "./Comments.css";

function Comments({ courseId }) {

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [replyContent, setReplyContent] = useState({});
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchComments();
    }, [courseId]);

    // FETCH COMMENTS
    const fetchComments = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/comments/course/${courseId}`,
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
                    "Unable to fetch comments"
                );
            }

            const data =
                responseText
                    ? JSON.parse(responseText)
                    : [];

            setComments(data);

        } catch (error) {

            console.error(
                "Comments error:",
                error
            );

            setError(error.message);
        }
    };

    // ADD COMMENT
    const addComment = async () => {

        if (!content.trim()) {

            setMessage(
                "Please enter a comment."
            );

            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/comments/course/${courseId}`,
                {
                    method: "POST",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`,
                        "Content-Type":
                            "text/plain"
                    },
                    body: content
                }
            );

            const responseText =
                await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText ||
                    "Unable to add comment"
                );
            }

            setContent("");

            setMessage(
                "Comment added successfully!"
            );

            fetchComments();

        } catch (error) {

            console.error(
                "Add comment error:",
                error
            );

            setError(error.message);
        }
    };

    // ADD REPLY
    const addReply = async (commentId) => {

        const reply =
            replyContent[commentId];

        if (!reply || !reply.trim()) {

            setMessage(
                "Please enter a reply."
            );

            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/comments/${commentId}/reply`,
                {
                    method: "POST",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`,
                        "Content-Type":
                            "text/plain"
                    },
                    body: reply
                }
            );

            const responseText =
                await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText ||
                    "Unable to add reply"
                );
            }

            setReplyContent({
                ...replyContent,
                [commentId]: ""
            });

            setMessage(
                "Reply added successfully!"
            );

            fetchComments();

        } catch (error) {

            console.error(
                "Add reply error:",
                error
            );

            setError(error.message);
        }
    };

    return (

        <div className="comments-container">

            {/* HEADER */}

            <div className="comments-title">

                <div className="comments-title-icon">
                    💬
                </div>

                <div>

                    <h2>
                        Course Discussion
                    </h2>

                    <p>
                        Ask questions and discuss
                        the course with others.
                    </p>

                </div>

            </div>

            {/* MESSAGE */}

            {message && (

                <div className="comment-message">
                    ✅ {message}
                </div>

            )}

            {error && (

                <div className="comment-error">
                    ⚠️ {error}
                </div>

            )}

            {/* ADD COMMENT */}

            <div className="add-comment-card">

                <h3>
                    💭 Add a Comment
                </h3>

                <textarea
                    className="comment-textarea"
                    value={content}
                    onChange={(e) =>
                        setContent(
                            e.target.value
                        )
                    }
                    placeholder="Share your thoughts or ask a question..."
                    rows="4"
                />

                <div className="comment-submit-row">

                    <span>
                        Be respectful and helpful.
                    </span>

                    <button
                        className="comment-submit-btn"
                        onClick={addComment}
                    >
                        Add Comment
                    </button>

                </div>

            </div>

            {/* COMMENTS */}

            <div className="comments-list">

                {comments.length === 0 ? (

                    <div className="no-comments">

                        <div>
                            💬
                        </div>

                        <h3>
                            No comments yet
                        </h3>

                        <p>
                            Be the first person to start
                            the discussion!
                        </p>

                    </div>

                ) : (

                    comments.map((comment) => (

                        <div
                            className="comment-card"
                            key={comment.id}
                        >

                            {/* COMMENT HEADER */}

                            <div className="comment-header">

                                <div className="comment-user">

                                    <div className="user-avatar">

                                        {comment.username
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                    </div>

                                    <div>

                                        <strong>
                                            {comment.username}
                                        </strong>

                                        <small>
                                            {comment.createdAt}
                                        </small>

                                    </div>

                                </div>

                            </div>

                            {/* COMMENT TEXT */}

                            <p className="comment-content">
                                {comment.content}
                            </p>

                            {/* REPLY */}

                            <div className="reply-section">

                                <textarea
                                    className="reply-textarea"
                                    value={
                                        replyContent[
                                            comment.id
                                        ] || ""
                                    }
                                    onChange={(e) =>
                                        setReplyContent({
                                            ...replyContent,
                                            [comment.id]:
                                                e.target.value
                                        })
                                    }
                                    placeholder="Write a reply..."
                                    rows="2"
                                />

                                <button
                                    className="reply-btn"
                                    onClick={() =>
                                        addReply(
                                            comment.id
                                        )
                                    }
                                >
                                    ↩ Reply
                                </button>

                            </div>

                            {/* REPLIES */}

                            {comment.replies &&
                                comment.replies.length > 0 && (

                                    <div className="replies-container">

                                        <h4>
                                            Replies (
                                            {
                                                comment.replies
                                                    .length
                                            }
                                            )
                                        </h4>

                                        {comment.replies.map(
                                            (reply) => (

                                                <div
                                                    className="reply-card"
                                                    key={reply.id}
                                                >

                                                    <div className="reply-user">

                                                        <div className="reply-avatar">

                                                            {reply.username
                                                                ?.charAt(0)
                                                                ?.toUpperCase()}

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    reply.username
                                                                }
                                                            </strong>

                                                            <small>
                                                                {
                                                                    reply.createdAt
                                                                }
                                                            </small>

                                                        </div>

                                                    </div>

                                                    <p>
                                                        {
                                                            reply.content
                                                        }
                                                    </p>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default Comments;