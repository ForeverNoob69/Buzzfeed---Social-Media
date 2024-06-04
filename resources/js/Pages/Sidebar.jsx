import React, { useEffect, useState } from "react";
import "@/Pages/sidebar.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import SendIcon from "@mui/icons-material/Send";
import { Link } from "@inertiajs/inertia-react";
import CreatePostModal from "./components/CreatePostModal";
import SearchModal from "./components/SearchModal";
import { Slide } from "@mui/material";

export default function Sidebar({ user }) {
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [slider, setSlider] = useState(false);

    const handleSearchOpen = () => {
        setSearchOpen(true);
    };

    const handleSearchClose = () => {
        setSearchOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setSlider(true);
        }, 1000); // Adjust the debounce delay as needed

        return () => clearTimeout(delayDebounceFn);
    }, []);

    return (
        <Slide direction="right" in={slider}>
            <div className="sidebar">
                <Link className="navLeft" href={route(`home`)}>
                    <img src="/images/logo.png" width={"40rem"} alt="" />
                    <h2
                        className="logo"
                        style={{ fontSize: "1.7rem", fontWeight: "900" }}
                    >
                        Buzzfeed
                    </h2>
                </Link>
                <div className="menuOption">
                    <HomeOutlinedIcon fontSize="large" />
                    <h2>Home</h2>
                </div>
                <div className="menuOption">
                    <button className="menuOption" onClick={handleSearchOpen}>
                        <SearchIcon fontSize="large" />
                        <h2>Search</h2>
                    </button>
                    <SearchModal
                        handleOpen={handleSearchOpen}
                        handleSearchClose={handleSearchClose}
                        searchOpen={searchOpen}
                        user={user}
                    />
                </div>
                <div className="menuOption disable">
                    <ExploreOutlinedIcon fontSize="large" />
                    <h2>Explore</h2>
                </div>
                <div className="menuOption disable">
                    <MovieCreationOutlinedIcon fontSize="large" />
                    <h2>Reels</h2>
                </div>
                <div className="menuOption disable">
                    <SendIcon
                        fontSize="large"
                        style={{ transform: " rotate(320deg)" }}
                    />
                    <h2>Message</h2>
                </div>
                <div className="menuOption disable">
                    <FavoriteBorderOutlinedIcon fontSize="large" />
                    <h2>Notifications</h2>
                </div>
                <div className="menuOption">
                    <button className="menuOption" onClick={handleOpen}>
                        <AddBoxOutlinedIcon fontSize="large" />
                        <h2>Create</h2>
                    </button>
                    <CreatePostModal handleClose={handleClose} open={open} />
                </div>
                <Link
                    className="menuOption"
                    href={route("profile.user", {
                        user: user.id,
                    })}
                >
                    <img
                        src={`/storage/${user.profile.image}`}
                        style={{
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                        }}
                        alt=""
                    />
                    <h2>Profile</h2>
                </Link>
            </div>
        </Slide>
    );
}
