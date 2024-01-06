import { Navigate, Outlet, defer, useLoaderData } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { Box, Toolbar } from "@mui/material";
import { fetchProfileApi } from "../services/teknoplat_server";
import { fetchAccountCourses } from "../services/team_server";
import Cookies from "js-cookie";
 
export async function loader({ request, params }) {
    const access = Cookies.get("accessToken");

    if (!access) {
        return { error: true };
    }

    try {
        const profileResponse = await fetchProfileApi();
        const coursesResponse = fetchAccountCourses();
        return defer({
            profile: profileResponse.data,
            courses: coursesResponse
        });
    } catch (error) {
        return { error: true };
    }
}

export const Component = () => {
    const { profile, courses, error } = useLoaderData();

    if (error) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("videoAccessToken");
        localStorage.clear();
        return <Navigate to="/login" />
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Sidebar profile={profile} courses={courses} />
            <Box
                component="main"
                sx={{ flexGrow: 1, width: { sm: `calc(100% - 240px)` }}}
            >
                <Toolbar />
                <Outlet context={{ profile: profile, courses: courses }} />
            </Box>
        </Box>      
    );
}

Component.displayName = "SidebarLayout";
