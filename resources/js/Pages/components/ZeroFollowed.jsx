import { Link } from "@inertiajs/react";
import { Box, Button, CircularProgress, Modal, Slide } from "@mui/material";
import React, { useEffect, useState } from "react";
import "@/Pages/rightbar.css";
import FollowBtn from "./FollowBtn";
import { Transition } from "@headlessui/react";

const style = {
    position: "absolute",
    borderRadius: "10px",
    top: "10%",
    left: "33%",
    overflow: "auto",
    height: "70vh",
    // transform: "translate(-50%, -50%)",
    width: 500,
    backgroundColor: "white",
    boxShadow: "0px 0px 8px -3px rgba(0, 0, 0, 0.5)",
    zIndex: "1000",
};
export default function ZeroFollowed({
    open,
    auth,
    setOpen,
    setTrigger,
    trigger,
}) {
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
                setSuggestion(suggestedUsers);
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

    const handleClose = () => {
        setOpen(false);
        setTrigger(!trigger);
    };
    useEffect(() => {
        fetchSuggestion();
    }, []);
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Slide direction="down" in={open} mountOnEnter unmountOnExit>
                <Box sx={style}>
                    <div
                        className="profiles"
                        style={{
                            display: "flex",
                            marginTop: "0",
                            padding: " 2rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Suggested For you{" "}
                                </h2>

                                <h2 className="mt-1 text-sm text-gray-600">
                                    You have to follow Users to see their posts.
                                </h2>
                            </header>
                            <Button onClick={() => handleClose()}>close</Button>
                        </div>
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
                                            auth={auth}
                                            classname={"randomBtn"}
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Box>
            </Slide>
        </Modal>
    );
}
