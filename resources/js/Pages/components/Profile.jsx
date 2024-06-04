import React, { useState } from "react";
import "@/Pages/components/profile.css";
import Posts from "./Posts";
import { Link } from "@inertiajs/inertia-react";
import FollowBtn from "./FollowBtn";
import CreatePostModal from "./CreatePostModal";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

export default function Profile({ user, auth }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div className="profile">
            <div className="profileLeft">
                <img
                    src={
                        user.profile?.image
                            ? `/storage/${user.profile?.image}`
                            : "/images/default evi.jpg"
                    }
                    // width="20%"
                    style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                    alt="Profile PIC"
                />
                <div className="profileRight">
                    <div className="userInfo">
                        <p className="text-lg font-medium text-gray-900">
                            {user.profile ? user.profile.username : "No Name"}
                        </p>
                        {auth.user?.id === user.id ? (
                            <Link
                                href={route(`profile.edit`)}
                                className="profileLink"
                            >
                                Edit Profile
                            </Link>
                        ) : (
                            <>
                                <FollowBtn
                                    user={user}
                                    auth={auth}
                                    classname={"profileLink"}
                                />
                                <b className="profileLink">Message</b>
                            </>
                        )}
                        {auth.user?.id === user?.id && (
                            <button
                                className="menuOption"
                                style={{
                                    // backgroundColor: "transparent",
                                    fontSize: "medium",
                                    color: "#0095F6",
                                    padding: "0",
                                }}
                                onClick={handleOpen}
                            >
                                <h2
                                    style={{
                                        display: "flex",
                                        alignItems: "centery",
                                    }}
                                >
                                    <ControlPointIcon />
                                    Add New Post
                                </h2>
                            </button>
                        )}
                    </div>
                    <CreatePostModal
                        handleOpen={handleOpen}
                        handleClose={handleClose}
                        open={open}
                        user={user}
                    />
                    <div className="followerInfo">
                        <a href="#">{user.posts.length} Post</a>
                        <a href="#">
                            {user.profile.followers.length} Followers
                        </a>
                        <a href="#">{user.following.length} Following</a>
                    </div>
                    <div
                        className="bios"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.1rem",
                        }}
                    >
                        <h2>{user.profile?.title}</h2>
                        <h3>{user.profile?.description}</h3>
                        <a
                            href={user.profile?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: "fit-content",
                                color: "blue",
                                textDecoration: "underline",
                                backgroundColor: "transparent",
                            }}
                        >
                            {user.profile?.url}
                        </a>
                    </div>
                </div>
            </div>
            <div className="profileRight">
                <hr />
                {user.posts.length > 0 ? (
                    <Posts user={user} />
                ) : (
                    <header
                        style={{
                            height: "20vh",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            placeItems: "center",
                        }}
                    >
                        <h2 className="text-lg font-medium text-gray-900">
                            No Posts Available!
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Create posts to share with your friends.
                        </p>
                    </header>
                )}
            </div>
        </div>
    );
}
