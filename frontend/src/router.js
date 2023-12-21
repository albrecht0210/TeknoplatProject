import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./features/error/ErrorPage";
import { action as loginAction } from "./features/login/LoginPage";
import { action as meetingAction } from "./layouts/MeetingLayout";
import { action as commentAction } from "./features/meeting/MeetingDetails.Comments";
import { action as chatbotAction } from "./features/chatbot/ChatbotPage";

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
                        lazy={() => import("./features/redirects/CoursesRedirects")}
                    />
                    <Route 
                        path="courses/:courseId" 
                        lazy={() => import("./features/redirects/CoursesRedirects")}
                    />
                    <Route 
                        path="courses/:courseId/meetings/" 
                        lazy={() => import("./layouts/MeetingsLayout")}
                        handle={{ crumb: () => <span>{localStorage.getItem("course_link_name")}</span> }}
                    >
                        <Route 
                            path=":status/"
                            lazy={() => import("./features/meeting/MeetingList")}
                        />
                    </Route>
                    <Route 
                        path="courses/:courseId/meeting/" 
                        lazy={() => import("./features/redirects/CoursesRedirects")}
                    />
                    <Route 
                        path="courses/:courseId/meeting/:meetingId/"
                        lazy={() => import("./layouts/MeetingLayout")}
                        handle={{ crumb: () => <span>{localStorage.getItem("meeting_link_name")}</span> }}
                        action={meetingAction}
                    >
                        <Route path="pitches/" lazy={() => import("./features/meeting/MeetingDetails.Pitches")} />
                        <Route path="criterias/" lazy={() => import("./features/meeting/MeetingDetails.Criterias")} />
                        <Route path="comments/" lazy={() => import("./features/meeting/MeetingDetails.Comments")} action={commentAction} />
                    </Route>
                    <Route 
                        path="chatbot/" 
                        lazy={() => import("./features/chatbot/ChatbotPage")} 
                        action={chatbotAction}
                    />
                </Route>
                <Route path="live/:meetingId/" />
            </Route>
            <Route 
                path="login" 
                lazy={() => import("./features/login/LoginPage")}
                action={loginAction} 
            />
        </Route>
    );
}

export default UrlPaths;
