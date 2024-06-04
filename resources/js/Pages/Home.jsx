import React, { useState } from "react";
import Newsfeed from "./Newsfeed";
import Sidebar from "./Sidebar";
import Rightbar from "./Rightbar";

import "@/Pages/home.css";
import { Head } from "@inertiajs/react";
import { useMediaQuery } from "@mui/material";

export default function Home({ auth, user }) {
    const matches = useMediaQuery("(min-width:1000px)");
    const [open, setOpen] = useState(false);
    const [trigger, setTrigger] = useState(false);

    return (
        <div>
            <Head title="Home" />
            <div
                style={{
                    display: matches ? "none" : "flex",
                    height: "100vh",
                    width: "100vw",
                    flexDirection: "column",
                    placeItems: "center",
                    justifyContent: "center",
                }}
            >
                <header>
                    <img src="/images/mblScreen.webp" width={"200rem"} alt="" />
                    <h2
                        className="text-lg font-medium text-gray-900"
                        style={{ fontSize: "2rem" }}
                    >
                        Switch to Desktop View
                    </h2>

                    <p className="mt-2 text-lg text-gray-600">
                        Mobile view is not available.
                    </p>
                </header>
            </div>
            <div className="home" style={{ display: !matches && "none" }}>
                <Sidebar user={user} />
                <Newsfeed
                    auth={auth}
                    open={open}
                    setOpen={setOpen}
                    trigger={trigger}
                    setTrigger={setTrigger}
                />
                <Rightbar auth={auth} open={open} setOpen={setOpen} />
            </div>
        </div>
    );
}
