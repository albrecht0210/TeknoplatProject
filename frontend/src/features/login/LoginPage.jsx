import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../../components/navbar/Navbar";
import { Box, Toolbar } from "@mui/material";
import { generateTokensApi } from "../../services/wildcat_server";
import { authenticateVideoSDKApi } from "../../services/teknoplat_server";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import LoginPageCard from "./LoginPage.Card";

export async function action({ request, params }) {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const errors = {};

    if (password === "") {
        errors.password = "Password can't be blank.";
    }

    if (username === "") {
        errors.username = "Username can't be blank.";
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
        return error.response.data;
    }
}

export const LoginPage = () => {
    const access = Cookies.get("accessToken");
    const errors = useActionData();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (typeof errors === 'object') {
            Object.keys(errors).forEach((key) => {
                enqueueSnackbar(errors[key], { variant: 'error' });
            });
        }
    }, [errors]);

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
                    <LoginPageCard errors={errors} />
                </Box>
            </Box>
        </Box>
    );
}