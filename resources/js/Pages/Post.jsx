import React from "react";
import "@/Pages/components/posts.css";
import { Link } from "@inertiajs/inertia-react";
import Navbar from "./components/Navbar";
import Reaction from "./components/Reaction";
import FollowBtn from "./components/FollowBtn";
import PostDelete from "./components/PostDelete";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
export default function Post({ post, auth, profile }) {
    const returnHome = () => {
        return Inertia.visit("/");
    };
    return (
        <section className="post">
            <Navbar auth={auth} />
            <Head title={post.user.names} />
            <div className="theSinglePost">
                <div className="postLeft">
                    <img src={`/storage/${post.image}`} alt={post.caption} />
                </div>
                <div className="postRight">
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                        }}
                    >
                        <img
                            // src={`/storage/${profile?.image}`}
                            src={
                                profile?.image
                                    ? `/storage/${profile?.image}`
                                    : "/images/default evi.jpg"
                            }
                            alt=""
                            // style={{ borderRadius: "50%" }}
                        />
                        <Link
                            href={route("profile.user", { user: post.user.id })}
                        >
                            <b>{post.user.name} </b>
                        </Link>
                        <span style={{ color: "#0095F6" }}>
                            {auth.user.id !== post.user.id ? (
                                <FollowBtn user={post.user} auth={auth} />
                            ) : (
                                <PostDelete
                                    post={post}
                                    returnHome={returnHome}
                                    // posts={posts}
                                    // setPosts={setPosts}
                                />
                            )}
                        </span>
                    </div>
                    <div className="caption">
                        <hr style={{ marginBottom: "1rem" }} />
                        <h2>
                            <b>{post.user.name}: </b>
                            {post.caption}
                        </h2>
                    </div>
                    <div>
                        <Reaction
                            user={post.user}
                            url={`http://127.0.0.1:8000/posts/${post.id}`}
                            post={post}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
