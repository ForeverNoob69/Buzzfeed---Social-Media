import "@/Pages/components/profile.css";
import { CircularProgress, Snackbar } from "@mui/material";
import React, { useState } from "react";

export default function FollowBtn({ user, classname, auth }) {
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(user?.follows);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const btnText = isFollowing ? "Unfollow" : "Follow";

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    const handleFollow = async () => {
        if (auth.user == null) {
            alert("Login in first");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`/follow/${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });
            if (await response.ok) {
                const { followed } = await response.json();
                if (followed.length > 0) {
                    setIsFollowing(true);
                    setOpen(true);
                    setMessage(`You started following ${user.name}`);
                } else {
                    setIsFollowing(false);
                    setOpen(true);
                    setMessage(`You unfollowed ${user.name}`);
                }
            } else {
                alert("Something went wrong.");
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };
    // useEffect(() => {
    //     let timeout;
    //     if (open) {
    //         timeout = setTimeout(() => {
    //             setOpen(false);
    //         }, 3000); // 5 seconds
    //     }
    //     return () => {
    //         clearTimeout(timeout);
    //     };
    // }, [open]);

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message={message}
            />
            <button
                disabled={loading}
                className={classname}
                onClick={() => handleFollow()}
            >
                {loading ? (
                    <CircularProgress size={20} color="inherit" />
                ) : (
                    btnText
                )}
            </button>
        </>
    );
}
