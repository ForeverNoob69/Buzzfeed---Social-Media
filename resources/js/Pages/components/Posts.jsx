import React from "react";
import "@/Pages/components/posts.css";
import { Link } from "@inertiajs/inertia-react";

export default function Posts({ user }) {
    return (
        <div className="posts">
            {user.posts.map((post, index) => {
                return (
                    <Link
                        style={{ padding: "0" }}
                        key={index}
                        href={`/p/${post.id}`}
                    >
                        <img
                            key={index}
                            src={`/storage/${post.image}`}
                            alt={post.caption}
                        />
                    </Link>
                );
            })}
        </div>
    );
}
