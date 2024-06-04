import "@/Pages/rightbar.css";
import NavDropdown from "./components/NavDropdown";
import React, { useEffect, useState } from "react";
import FollowBtn from "./components/FollowBtn";
import { Link } from "@inertiajs/inertia-react";
import { Button, CircularProgress } from "@mui/material";

export default function Rightbar({ auth, setOpen }) {
    const [suggestion, setSuggestion] = useState([]);
    const [loading, setLoading] = useState(false);

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    const fetchSuggestion = async () => {
        setLoading(true);
        try {
            const response = await fetch("/suggested", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
            });
            if (await response.ok) {
                const { suggestedUsers } = await response.json();
                setSuggestion(suggestedUsers.slice(0, 3));
            } else {
                alert("Failed to fetch data. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);
            alert("Failed to fetch data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSuggestion();
    }, []);

    return (
        <div className="rightbar">
            <NavDropdown auth={auth} />

            <div className="profiles">
                <h2>Suggested for you</h2>
                {loading ? (
                    <CircularProgress style={{ margin: "0 auto" }} />
                ) : (
                    suggestion.map((suggest, index) => {
                        return (
                            <div className="suggestedUsers" key={index}>
                                <Link
                                    style={{
                                        display: "flex",
                                        gap: "0.5rem",
                                        alignItems: "center",
                                    }}
                                    href={route("profile.user", {
                                        user: suggest.id,
                                    })}
                                >
                                    <img
                                        src={
                                            suggest.image
                                                ? `/storage/${suggest.image}`
                                                : "/images/default evi.jpg"
                                        }
                                        width={"50rem"}
                                        alt=""
                                    />
                                    <h1>{suggest.username}</h1>
                                </Link>
                                <FollowBtn
                                    user={suggest.user}
                                    classname={"randomBtn"}
                                />
                            </div>
                        );
                    })
                )}
                {suggestion.length > 0 && (
                    <Button onClick={() => setOpen(true)}>See all...</Button>
                )}
            </div>
        </div>
    );
}
