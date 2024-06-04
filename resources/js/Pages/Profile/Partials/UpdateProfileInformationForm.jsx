import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import { CloudUploadRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    profile,
    className = "",
}) {
    const user = usePage().props.auth.user;
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            username: profile.username,
            email: user.email,
            title: profile?.title ? profile?.title : "",
            description: profile?.description ? profile?.description : "",
            url: profile?.url ? profile?.url : "",
            image: "",
        });

    const isValidUrl = (url) => {
        // Regular expression to match a URL pattern
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlPattern.test(url);
    };

    const submit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (data.url && !isValidUrl(data.url)) {
            alert("Please enter a valid URL");
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("username", data.username);
        formData.append("email", data.email.toLocaleLowerCase());
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("url", data.url);
        if (data.image) {
            formData.append("image", data.image);
        }

        // Append the image file to form data using the selected file

        console.log(formData.get("image"));
        // Submit form data with Inertia.js
        await Inertia.post(route("profile.update"), formData);

        // await patch(route("profile.update"), formData);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setData("image", file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setData("image", null);

            setImagePreview(null);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form
                onSubmit={submit}
                encType="multipart/form-data"
                className="mt-6 space-y-6"
            >
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.username} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="title" value="Bio" />
                    <TextInput
                        id="title"
                        className="mt-1 block w-full"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        autoComplete="title"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="description" value="Description" />
                    <TextInput
                        id="description"
                        className="mt-1 block w-full"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        autoComplete="description"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="url" value="URL" />
                    <TextInput
                        id="url"
                        className="mt-1 block w-full"
                        value={data.url}
                        onChange={(e) => setData("url", e.target.value)}
                        autoComplete="url"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>
                {imagePreview ? (
                    <img src={imagePreview} width={"100rem"} alt="Preview" />
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
                            type="file"
                            id="image"
                            style={{ display: "none" }} // Hide the input within the button
                            onChange={(e) => handleImageChange(e)}
                        />
                    </Button>

                    <InputError className="mt-2" message={errors.name} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
