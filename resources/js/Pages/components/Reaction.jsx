import React, { useState } from "react";
import "@/Pages/newsfeed.css";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Checkbox } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

export default function Reaction({ url, user, post }) {
    const [likes, setLikes] = useState(post.has_liked);

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    const handleLike = async () => {
        try {
            const response = await fetch(
                `${url}/like` || `/posts/${post.id}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.id}`,
                        "X-CSRF-TOKEN": csrfToken,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setLikes(true);
                console.log(data);
                post["likes_count"]++;
            }
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

    const handleUnlike = async () => {
        try {
            const response = await fetch(
                `${url}/unlike` || `posts/${post.id}/unlike`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.id}`,
                        "X-CSRF-TOKEN": csrfToken,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setLikes(false);
                post["likes_count"]--;
            }
        } catch (error) {
            console.error("Error unliking the post:", error);
        }
    };
    return (
        <>
            <div className="reactIcons">
                <Checkbox
                    checked={likes}
                    onChange={likes ? handleUnlike : handleLike}
                    icon={
                        <FavoriteBorder
                            style={{
                                color: "black",
                                padding: "0",
                                margin: "0",
                            }}
                        />
                    }
                    checkedIcon={
                        <Favorite
                            style={{
                                color: "rgb(255, 48, 64)",
                                padding: "0",
                                margin: "0",
                            }}
                        />
                    }
                />
                <ModeCommentOutlinedIcon />
                <SendOutlinedIcon style={{ transform: " rotate(320deg)" }} />
            </div>
            <h1 style={{ padding: "0 1rem", fontWeight: "900" }}>
                {post.likes_count} Likes
            </h1>
        </>
    );
}
