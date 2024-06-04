import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Dashboard({ auth, user }) {
    const matches = useMediaQuery("(min-width:1000px)");

    return (
        <div
            className="dashboard"
            style={{
                display: "flex",
                flexDirection: "column",
                placeItems: "center",
            }}
        >
            {!matches || (
                <>
                    <Head title={user?.name} />
                    <Navbar auth={auth} />
                    <Profile user={user} auth={auth} />
                </>
            )}
            <header
                style={{
                    height: "100vh",
                    flexDirection: "column",
                    justifyContent: "center",
                    display: matches ? "none" : "flex",
                }}
            >
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
    );
}
