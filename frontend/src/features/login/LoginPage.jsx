import { Navigate, redirect, useActionData } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../../components/navbar/Navbar";
import { Box, Toolbar } from "@mui/material";
import { generateTokensApi } from "../../services/wildcat_server";
import { authenticateVideoSDKApi } from "../../services/teknoplat_server";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import LoginPageCard from "./LoginPage.Card";

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

    try {
        const tokenResponse = await generateTokensApi({ username: username, password: password });
        Cookies.set("accessToken", tokenResponse.data.access);
        Cookies.set("refreshToken", tokenResponse.data.refresh);
        
        const authVideoResponse = await authenticateVideoSDKApi();
        Cookies.set("videoAccessToken", authVideoResponse.data);
        return redirect("/");
    } catch(error) {
        if (error.response.status === 404) {
            errors.error = "Try again later. Server is down.";
        } else {
            errors.error = error.response.data.detail;
        }
        return errors;
        // return error.response.data;
    }
}

export const Component = () => {
    const access = Cookies.get("accessToken");
    const errors = useActionData();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof errors === 'object') {
            let count = 0;
            Object.keys(errors).forEach((key) => {
                setTimeout(() => {
                    enqueueSnackbar(errors[key], { variant: 'error', autoHideDuration: 3000 });
                }, 200 * count);
                count++;
            });
            setLoading(false);
        }
    }, [errors, enqueueSnackbar]);
    
    if (access) {
        return <Navigate to="/" />
    }

    const handleLoadingChange = () => {
        setLoading(!loading);
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
                    <LoginPageCard errors={errors} loading={loading} loadingChange={handleLoadingChange} />
                </Box>
            </Box>
        </Box>
    );
}

Component.displayName = "LoginPage";
