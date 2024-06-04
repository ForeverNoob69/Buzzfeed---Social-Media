import React, { useEffect, useState } from "react";
import "@/Pages/newsfeed.css";
import { Link } from "@inertiajs/react";
import { Alert, Skeleton } from "@mui/material";
import Reaction from "./components/Reaction";
import PostDelete from "./components/PostDelete";
import ZeroFollowed from "./components/ZeroFollowed";

export default function Newsfeed({ auth, open, setOpen, trigger, setTrigger }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    const fetchPosts = async () => {
        try {
            const response = await fetch("/posts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });
            if (await response.ok) {
                const { allPosts } = await response.json();
                if (allPosts.length === 0) {
                    setOpen(true);
                    return;
                }
                setPosts(allPosts);
            } else {
                setError("Failed to fetch data. Please reload.");
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);
            setError("Failed to fetch data. Please reload.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (posts.length === 0) {
            setLoading(true);
        }

        fetchPosts();
    }, [trigger]);

    return (
        <div className="newfeed">
            {loading ? (
                <div className="skeleton">
                    <Skeleton animation="wave" sx={{ zIndex: "20" }} />
                    <Skeleton
                        variant="rectangular"
                        height={300}
                        sx={{ zIndex: "20" }}
                    />
                    <Skeleton animation="wave" sx={{ zIndex: "20" }} />

                    <Skeleton animation="wave" sx={{ zIndex: "20" }} />
                </div>
            ) : (
                posts?.map((post, index) => {
                    return (
                        <section className="postSection" key={index}>
                            <div className="postTop">
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "0.5rem",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <Link
                                            href={route("profile.user", {
                                                user: post.user.id,
                                            })}
                                        >
                                            <img
                                                src={
                                                    post.user.profile?.image
                                                        ? `/storage/${post.user.profile?.image}`
                                                        : "/images/default evi.jpg"
                                                }
                                                width={"40rem"}
                                                alt=""
                                            />
                                        </Link>
                                        <Link
                                            href={route("profile.user", {
                                                user: post.user.id,
                                            })}
                                        >
                                            <b>{post.user.name}</b>
                                        </Link>
                                    </div>
                                    {auth.user.id === post.user.id && (
                                        <PostDelete
                                            post={post}
                                            posts={posts}
                                            setPosts={setPosts}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="postBottom">
                                <div>
                                    <img
                                        src={`/storage/${post.image}`}
                                        alt={post.caption}
                                    />
                                </div>
                                <Reaction user={post.user} post={post} />
                                <div className="caption">
                                    <h2>
                                        <b>{post.user.name} </b>
                                        {post.caption}
                                    </h2>
                                </div>

                                <hr />
                            </div>
                        </section>
                    );
                })
            )}
            {open && (
                <ZeroFollowed
                    open={open}
                    auth={auth}
                    setOpen={setOpen}
                    setTrigger={setTrigger}
                    trigger={trigger}
                />
            )}

            {error && (
                <Alert className="mt-5" severity="error">
                    {error}
                </Alert>
            )}
        </div>
    );
}
