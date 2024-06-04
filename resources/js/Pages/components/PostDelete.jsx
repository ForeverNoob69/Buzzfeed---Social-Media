import { useForm } from "@inertiajs/inertia-react";
import { DeleteOutline } from "@mui/icons-material";
import { Inertia } from "@inertiajs/inertia";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Snackbar,
} from "@mui/material";
import React, { useState } from "react";

export default function PostDelete({ post, posts, setPosts, returnHome }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);

    // const onSuccess = () => {
    //     // Remove the deleted post from the local posts list (assuming you have it in a state var iable)
    //     const filteredPosts = posts.filter((allpost) => allpost.id !== post.id);
    //     setPosts(filteredPosts);
    //     alert("Post Deleted Successfully!");
    // };

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/p/${post.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });

            // try {
            //     await destroy(route("posts.destroy", post.id)); // Assuming destroy handles deletion
            //     setOpen(false); // Close the modal after successful deletion
            //     alert("Post Deleted Successfully!");
            // } catch (error) {
            //     console.error("Error deleting post:", error);
            //     alert("Deletion failed!");
            // }

            if (response.ok) {
                if (returnHome) {
                    returnHome();
                }
                setLoading(false);
                setError("");
                setOpen(false);
                setPosts(posts.filter((allpost) => allpost.id !== post.id));
                setSnackOpen(true);
                // Optionally, you can refresh the posts list or redirect
            } else {
                const errorData = await response.json();
                setError("Deletion failed!");
                setLoading(false);

                console.error("Failed to delete the post:", errorData);
            }
        } catch (error) {
            setLoading(false);

            console.error("Error deleting the post:", error);
            setError("An error occurred while trying to delete the post.");
        }
    };

    const handleSnackClose = () => {
        setSnackOpen(false);
    };

    return (
        <React.Fragment>
            <IconButton aria-label="delete" onClick={handleClickOpen}>
                <DeleteOutline />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete this Post?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Once deleted, you can't retrieve this post.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={(e) => handleDelete(e)}
                        autoFocus
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Delelte"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={handleSnackClose}
                message={error || "Post deleted successfully!"}
            />
        </React.Fragment>
    );
}
