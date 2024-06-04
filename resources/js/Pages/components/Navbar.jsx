import React from "react";
import "@/Pages/components/navbar.css";
import { Link } from "@inertiajs/inertia-react";

// import NavLink from "@/Components/NavLink";
// import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import NavDropdown from "./NavDropdown";

export default function Navbar({ auth }) {
    return (
        <div className="navbar">
            <Link className="navLeft" href={route(`home`)}>
                <img src="/images/logo.png" width={"40rem"} alt="" />
                <h2 className="logo">Buzzfeed</h2>
            </Link>
            <div className="navRight">
                {auth?.user ? (
                    <NavDropdown auth={auth} />
                ) : (
                    <>
                        <Link
                            href={route("login")}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route("register")}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
