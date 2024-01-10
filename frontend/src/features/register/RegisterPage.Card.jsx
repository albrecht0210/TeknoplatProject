import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { Suspense, useRef, useState } from "react";
import { Await, Form, useLoaderData, useNavigate } from "react-router-dom";
import { fetchTeamsByCoursePublic } from "../../services/team_server";
import { Add } from "@mui/icons-material";
import RegisterPageTeamDialog from "./RegisterPage.TeamDialog";

const RegisterPageCard = (props) => {
    const { loading, loadingChange } = props;
    const { courses } = useLoaderData();
    const submitButtonRef = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        course: "",
        team: ""
    });
    const [teamsMenu, setTeamsMenu] = useState([]);
    const [openTeamDialog, setOpenTeamDialog] = useState(false);

    const handleOpenTeamDialog = () => {
        setOpenTeamDialog(true);
    }

    const handleCloseTeamDialog = () => {
        setOpenTeamDialog(false);
    }

    const addTeamToMenu = (payload) => {
        setTeamsMenu([...teamsMenu, payload]);
    }

    const handleInputChange = async (e) => {
        const { name, value } = e.target;

        if (name === "course") {
            const teamsResponse = await fetchTeamsByCoursePublic(value);
            console.log(teamsResponse);
            setTeamsMenu(teamsResponse.data);
            setFormData((previousFormData) => ({
                ...previousFormData,
                team: ""
            }))
        }

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    }

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleLoginClick();
        }
    }

    const handleRegisterClick = () => {
        loadingChange();
        submitButtonRef.current.click();
        setTimeout(() => {
            setFormData({
                firstName: "",
                lastName: "",
                username: "",
                password: "",
            });
            navigate("/login");
        }, 1500);
    }

    const handleLoginClick = () => {
        navigate("/login");
    }

    return (
        <Card
            raised={true}
            sx={{ 
                borderRadius: "8px", 
                width: { xs: "calc(100% * .75)", sm: "calc(100% * .55)", md: "calc(100% * .45)", lg: "calc(100% * .35)" } 
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Form method="post">
                    <Typography
                        variant="h6"
                        textAlign="center"
                        mb={4}
                    >
                        Register
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField
                                name="firstName"
                                label="First Name"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                disabled={loading}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField
                                name="lastName"
                                label="Last Name"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                disabled={loading}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField
                                name="username"
                                label="Username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                disabled={loading}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                disabled={loading}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <Suspense fallback={<Skeleton animation="wave" variant="rectangular" />}>
                                <Await resolve={courses}>
                                    {(resolveCourses) => (
                                        <FormControl fullWidth>
                                            <InputLabel id="courseLabel">Course</InputLabel>
                                            <Select
                                                name="course"
                                                labelId="courseLabel"
                                                id="courseSelect"
                                                label="Course"
                                                value={formData.course}
                                                onChange={handleInputChange}
                                            >
                                                {resolveCourses.data.map((course) => (
                                                    <MenuItem key={course.id} value={course.id}>{course.name} - {course.section}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                    
                                </Await>
                            </Suspense>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <Stack direction="row" spacing={2}>
                                <FormControl fullWidth disabled={formData.course === ""}>
                                    <InputLabel id="teamLabel">Team</InputLabel>
                                    <Select
                                        name="team"
                                        labelId="teamLabel"
                                        id="teamSelect"
                                        label="Team"
                                        value={formData.team}
                                        onChange={handleInputChange}
                                    >
                                        {teamsMenu.map((team) => (
                                            <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button variant="outlined" disabled={formData.course === ""} onClick={handleOpenTeamDialog}><Add /></Button>
                            </Stack>
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <Button
                                variant="contained"
                                fullWidth
                                // disabled={loading}
                                // onClick={handleLoginClick}
                            >
                                { loading ? "Making Account..." : "Register" }
                            </Button>
                            <Button ref={submitButtonRef} type="submit" sx={{ display: "none" }} />
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <Button fullWidth variant="outlined" onClick={handleLoginClick}>Login</Button>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <Button fullWidth variant="outlined">Login as Guest</Button>
                        </Grid>
                    </Grid>
                </Form>
                <RegisterPageTeamDialog open={openTeamDialog} handleClose={handleCloseTeamDialog} course={formData.course} updateTeamMenu={addTeamToMenu} />
            </CardContent>
        </Card>
    );
}

export default RegisterPageCard;
