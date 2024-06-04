import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import "@/Pages/components/posts.css";
import { Button, CircularProgress } from "@mui/material";

export default function CreatePosts({ auth }) {
    const [loading, setLoading] = useState(false);
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);

        // Preview the selected image
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(image);
    };

    const submitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        if (caption || image) {
            const formData = new FormData(); // Create a FormData object to send the file
            formData.append("caption", caption); // Append caption to form data
            formData.append("image", image); // Append image file to form data
            Inertia.post(route("p.store"), formData);
        } else {
            alert("Please Insert a caption or a Picture.");
        }
    };
    return (
        <section className="createpost">
            <Navbar auth={auth} />
            <Head title="Create New Post" />

            <form
                onSubmit={submitForm}
                encType="multipart/form-data"
                className="mt-6 space-y-6"
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
                        id="caption"
                    ></textarea>

                    <InputError className="mt-2" />
                </div>
                {imagePreview && (
                    <img src={imagePreview} width={"100rem"} alt="Preview" />
                )}

                <div>
                    <InputLabel htmlFor="image" value="Profile Image" />
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => handleImageChange(e)}
                    />

                    <InputError className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    {/* <PrimaryButton disabled={loading}>Post</PrimaryButton> */}
                    <Button
                        onClick={(e) => submitForm(e)}
                        autoFocus
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Post"
                        )}
                    </Button>
                </div>
            </form>
            {/* <form
                    encType="multipart/form-data"
                    style={{
                        paddingTop: "10rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        placeItems: "center",
                    }}
                    onSubmit={(e) => submitForm(e)}
                    method="POST"
                >
                    <input
                        type="hidden"
                        name="_token"
                        value="{!! csrf_token() !!}"
                    />
    
                  
                    <div>
    
                        <TextInput
                            type="file"
                            name="image"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
    
                      
                    </div>
                    
                    <div>
                        <InputLabel htmlFor="name" value="Caption" />
    
                        <TextInput
                            name="caption"
                            onChange={(e) => setCaption(e.target.value)}
                        />
    
                        
                    </div>
                    <button type="submit">Post</button>
                </form> */}
        </section>
    );
}
