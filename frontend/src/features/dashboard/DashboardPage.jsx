import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Suspense } from "react";
import { Await, Navigate, useNavigate, useOutletContext } from "react-router-dom";
import DashboardPageSkeleton from "./DashboardPage.Skeleton";

export const Component = () => {
    const { courses } = useOutletContext();
    const navigate = useNavigate();

    const handleCourseClick = (course) => {
        localStorage.setItem("course", course.id);
        localStorage.setItem("course_link_name", `${course.name} (${course.section})`);
        navigate(`/courses/${course.id}/meetings/`);
    }

    return (
        <Suspense fallback={<DashboardPageSkeleton />}>
            <Await resolve={courses} errorElement={<Navigate to="/" />}>
                {(resolveCourses) => (
                    <Box p={3}>
                        <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
                            {resolveCourses.data.map((course) => (
                                <Paper
                                    key={course.id}
                                    component={Button}
                                    sx={{ 
                                        height: "calc((100vh - 64px - 50px) * 0.35)", 
                                        width: "calc((100vw - 280px) * 0.3)",
                                        p: 3
                                    }}
                                    onClick={() => handleCourseClick(course)}
                                >
                                    <Stack spacing={1} sx={{ width: "100%" }}>
                                        <Typography variant="h4">{ course.code }</Typography>
                                        <Typography variant="h6">{ course.name } ({ course.section })</Typography>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Await>
        </Suspense>
    );
}

Component.displayName = "DashboardPage";
