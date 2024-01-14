import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
// import { action as loginAction } from "./features/login/LoginPage";
// import { action as meetingAction } from "./layouts/MeetingLayout";
// import { action as commentAction } from "./features/meeting/MeetingDetails.Comments";
// import { action as chatbotAction } from "./features/chatbot/ChatbotPage";

const UrlPaths = () => {
    const routes = createRoutesFromElements(
        <Route 
            id="rootLayout"
            path="/"  
            lazy={() => import("./layouts/RootLayout")}
        >
            <Route 
                id="sidebarLayout"
                path="" 
                lazy={() => import("./layouts/SidebarLayout")}
            >
                <Route 
                    id="dashboardPageIndex"
                    index 
                    lazy={() => import("./features/dashboard/DashboardPage")}
                    handle={{ crumb: () => (
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="text.primary">Dashboard</Typography>
                        </Breadcrumbs>
                    )}} 
                />
                    <Route
                    id="dashboardPage"
                    path="dashboard"
                    lazy={() => import("./features/dashboard/DashboardPage")}
                    handle={{ crumb: (path) => (
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="text.primary">Dashboard</Typography>
                        </Breadcrumbs>
                    )}} 
                />
                <Route 
                    path="courses/:courseId/meetings/" 
                    lazy={() => import("./features/meetings/MeetingsPage")}
                    handle={{ crumb: (path) => (
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="text.primary">{localStorage.getItem("course_link_name")}</Typography>
                        </Breadcrumbs>
                    )}} 
                />
                <Route 
                    path="courses/:courseId/meetings/:meetingId/" 
                    lazy={() => import("./features/meeting_details/MeetingDetailsPage")}
                    handle={{ crumb: (path) => (
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" color="inherit" href={`/courses/${localStorage.getItem("course")}/meetings/`}>
                                {localStorage.getItem("course_link_name")}
                            </Link>
                            <Typography color="text.primary">{localStorage.getItem("meeting_link_name")}</Typography>
                        </Breadcrumbs>
                    )}} 
                />
                <Route
                    path="idea_validation/"
                    lazy={() => import("./features/chatbot/ChatbotPage")}
                    handle={{ crumb: (path) => (
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="text.primary">Idea Validation</Typography>
                        </Breadcrumbs>
                    )}} 
                />
                <Route 
                    path="profile/" 
                    lazy={() => import("./features/profile/ProfilePage")}
                    handle={{ crumb: (path) => (
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="text.primary">Profile</Typography>
                        </Breadcrumbs>
                    )}} 
                />
            </Route>
            <Route path="live/:meetingId/" lazy={() => import("./features/video/VideoPage")} />
            <Route path="live/:meetingId/leave/" lazy={() => import("./features/redirects/Redirects")} />
            <Route 
                id="login"
                path="login" 
                lazy={() => import("./features/login/LoginPage")}
            />
            <Route 
                id="register"
                path="register" 
                lazy={() => import("./features/register/RegisterPage")}
            />
        </Route>
    );

    const router = createBrowserRouter(routes);

    return <RouterProvider router={router} />;
}

export default UrlPaths;
