import Cookies from "js-cookie";
import { Outlet, useLoaderData } from "react-router-dom";
import { fetchProfileApi } from "../services/teknoplat_server";
import { fetchAccountCourses } from "../services/team_server";

export async function loader({ request, params }) {
    try {
        const profileResponse = await fetchProfileApi();
        const coursesResponse = await fetchAccountCourses();
        localStorage.setItem("account", profileResponse.data.id);
        return {
            profile: profileResponse.data,
            courses: coursesResponse.data
        };
    } catch (error) {
        return error.response.data;
    }
}

export const AuthenticatedLayout = () => {
    const data = useLoaderData();
    const access = Cookies.get("accessToken");

    if (!access) {
        return <Navigate to="/login" />
    }

    return (
        <Outlet context={{ profile: data.profile, courses: data.courses }} />
    );
}
