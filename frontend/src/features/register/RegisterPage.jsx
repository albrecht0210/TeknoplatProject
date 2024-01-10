import { Box, Toolbar } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import RegisterPageCard from "./RegisterPage.Card";
import Cookies from "js-cookie";
import { fetchAllCourses } from "../../services/team_server";
import { Navigate, defer } from "react-router-dom";

export async function loader({ request, params }) {
    try {
        const coursesResponse = fetchAllCourses();
        return defer({
            courses: coursesResponse
        });
    } catch (error) {
        return { error: true };
    }
}

export async function action({ request, params }) {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const errors = {};

    if (username === "") {
        errors.username = "Username can't be blank.";
    }

    if (password === "") {
        errors.password = "Password can't be blank.";
    }

    if (Object.keys(errors).length) {
        return errors;
    }

    // try {
    //     const tokenResponse = await generateTokensApi({ username: username, password: password });
    //     Cookies.set("accessToken", tokenResponse.data.access);
    //     Cookies.set("refreshToken", tokenResponse.data.refresh);
        
    //     const authVideoResponse = await authenticateVideoSDKApi();
    //     Cookies.set("videoAccessToken", authVideoResponse.data);
    //     return redirect("/");
    // } catch(error) {
    //     if (error.response.status === 404) {
    //         errors.error = "Try again later. Server is down.";
    //     } else {
    //         errors.error = error.response.data.detail;
    //     }
    //     return errors;
    //     // return error.response.data;
    // }
}

export const Component = () => {
    const access = Cookies.get("accessToken");
    const [loading, setLoading] = useState(false);

    const handleLoadingChange = () => {
        setLoading(!loading);
    }

    if (access) {
        return <Navigate to="/" />
    }

    return (
        <Box>
            <Navbar />
            <Box component="main">
                <Toolbar />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "calc(100vh - 64px)"
                    }}
                >
                    <RegisterPageCard loading={loading} loadingChange={handleLoadingChange} />
                </Box>
            </Box>
        </Box>
    );
}

Component.displayName = "RegisterPage";
