import { Box, Button, CircularProgress, Modal } from "@mui/material";
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import "@/Pages/components/createpostmodal.css";
import { CloudUploadRounded } from "@mui/icons-material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
};

export default function CreatePostModal({ handleClose, open }) {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
            setImagePreview(null);
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        if (caption && image) {
            const formData = new FormData(); // Create a FormData object to send the file
            formData.append("caption", caption); // Append caption to form data
            formData.append("image", image); // Append image file to form data
            Inertia.post(route("p.store"), formData);
        } else {
            alert("Please insert a caption and an image");
        }
    };
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form
                        className="createform"
                        onSubmit={submitForm}
                        encType="multipart/form-data"
                    >
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">
                                Create Post
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Share your experience with your friends.
                            </p>
                        </header>
                        <div>
                            <InputLabel htmlFor="caption" value="Caption" />

                            <textarea
                                name="caption"
                                onChange={(e) => setCaption(e.target.value)}
                                required
                                id="caption"
                            ></textarea>

                            <InputError className="mt-2" />
                        </div>
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                width={"100rem"}
                                alt="Preview"
                            />
                        ) : (
                            ""
                        )}

                        <div>
                            <InputLabel htmlFor="image" value="Profile Image" />
                            <Button
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadRounded />}
                            >
                                Upload file
                                <input
                                    style={{ display: "none" }} // Hide the input within the button
                                    type="file"
                                    id="image"
                                    required
                                    onChange={(e) => handleImageChange(e)}
                                />
                            </Button>

                            <InputError className="mt-2" />
                        </div>

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={loading}>
                                {loading ? (
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                    />
                                ) : (
                                    "Post"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
    );
}
