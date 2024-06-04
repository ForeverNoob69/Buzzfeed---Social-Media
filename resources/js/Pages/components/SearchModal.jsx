import { Box, CircularProgress, Modal, Slide } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import InputLabel from "@/Components/InputLabel";
import "@/Pages/components/createpostmodal.css";
import TextInput from "@/Components/TextInput";
import { Link } from "@inertiajs/react";

const style = {
    position: "absolute",
    top: "5%",
    left: "25%",

    transform: "translate(-50%, -50%)",
    width: 700,
};

export default function SearchModal({ handleSearchClose, searchOpen }) {
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = useCallback(async () => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`/search-users?query=${query}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setResults(data);
            setLoading(false);
        } catch (error) {
            console.error("There was an error fetching the users!", error);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 800); // Adjust the debounce delay as needed

        return () => clearTimeout(delayDebounceFn);
    }, [query]);
    return (
        <Modal
            open={searchOpen}
            onClose={handleSearchClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Slide direction="down" in={searchOpen} mountOnEnter unmountOnExit>
                <Box sx={style}>
                    <form className="createform" encType="multipart/form-data">
                        {/* <header>
                            <h2 className="text-lg font-medium text-gray-900">
                                Search{" "}
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Search for your Friends.
                            </p>
                        </header> */}
                        <div>
                            <InputLabel htmlFor="search" value="Search" />
                            <TextInput
                                className="mt-1 block w-full"
                                name="search"
                                onChange={(e) => setQuery(e.target.value)}
                                id="search"
                            />

                            {/* <InputError className="mt-2" /> */}
                        </div>
                        <div>
                            <ul>
                                {loading ? (
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                    />
                                ) : (
                                    results.map((user, index) => (
                                        <Link
                                            href={route("profile.user", {
                                                user: user.id,
                                            })}
                                            key={index}
                                        >
                                            <li key={user.id}>
                                                {user.name} ({user.email})
                                            </li>
                                        </Link>
                                    ))
                                )}
                            </ul>
                        </div>
                    </form>
                </Box>
            </Slide>
        </Modal>
    );
}
