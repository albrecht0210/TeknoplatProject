import { Navigate, useOutletContext, useParams } from "react-router-dom";

export const CoursesRedirects = () => {
    const { courses } = useOutletContext();
    let { courseId } = useParams();

    const course = courses.find(course => course.id === courseId);

    if (course) return <Navigate to={`courses/${courseId}/meetings/in_progress/`} />

    return (
        <Navigate to="/" />
    );
}
