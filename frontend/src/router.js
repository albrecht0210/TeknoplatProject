import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./features/error/ErrorPage";
import LoginPage, { loginAction } from "./features/login/LoginPage";
import MeetingsLayout from "./layouts/MeetingsLayout";

const UrlPaths = () => {
    const routes = createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
            <Route path="/" lazy={() => import("./layouts/AuthenticatedLayout")} >
                <Route path="/" lazy={() => import("./layouts/MainLayout")}>
                    <Route 
                        index 
                        lazy={() => import("./features/dashboard/DashboardPage")}
                        handle={{ crumb: () => <span>Dashboard</span> }} 
                    />
                    <Route
                        path="/"
                        lazy={() => import("./features/dashboard/DashboardPage")}
                        handle={{ crumb: () => <span>Dashboard</span> }}
                    />
                    <Route 
                        path="courses/" 
                        element={<Navigate to="/" />}
                    />
                    <Route 
                        path="courses/:courseId" 
                        element={<Navigate to="courses/:courseId/meetings/" />}
                    />
                    <Route 
                        path="courses/:courseId/meetings/" 
                        lazy={() => import("./layouts/MeetingsLayout")}
                        handle={{ crumb: () => <span>{localStorage.getItem("course_link_name")}</span> }}
                    >
                        
                    </Route>
                    <Route path="courses/:courseId/meetings/:meetingId/" />
                    <Route path="chatbot/" />
                </Route>
                <Route path="live/:meetingId/"/>
            </Route>
            <Route path="login" element={<LoginPage />} action={loginAction} />
        </Route>
    );
}

export default UrlPaths;
