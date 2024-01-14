import { Box, Toolbar } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import RegisterPageCard from "./RegisterPage.Card";
import Cookies from "js-cookie";
import { addCourseMember, addTeamMember, fetchAllCourses } from "../../services/team_server";
import { Navigate, defer, redirect } from "react-router-dom";
import { registerAccountApi, registerAccountToActivityApi, registerAccountToTeamApi } from "../../services/wildcat_server";

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
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const course = formData.get("course");
    const team = formData.get("team");

    const errors = {};

    if (firstName === "") {
        errors.firstName = "First name can't be blank.";
    }

    if (lastName === "") {
        errors.lastName = "Last name can't be blank.";
    }

    if (email === "") {
        errors.email = "Email can't be blank.";
    }

    if (username === "") {
        errors.username = "Username can't be blank.";
    }

    if (password === "") {
        errors.password = "Password can't be blank.";
    }

    if (course === "") {
        errors.course = "Course can't be blank.";
    }

    if (team === "") {
        errors.team = "Team can't be blank.";
    }

    if (Object.keys(errors).length) {
        return errors;
    }

    try {
        const registerResponse = await registerAccountApi({ 
            first_name: firstName, 
            last_name: lastName,
            email: email,
            username: username, 
            password: password, 
            choose_role: "student"
        });
        await registerAccountToTeamApi({ username: username, password: password });
        await registerAccountToActivityApi({ username: username, password: password });
        await addCourseMember({ account: registerResponse.data.id, course: course });
        await addTeamMember({ account: registerResponse.data.id, team: team });
        
        return redirect("/login");
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
