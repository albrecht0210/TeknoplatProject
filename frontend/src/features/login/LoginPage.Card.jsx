import { Form, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";

const LoginPageCard = (props) => {
    const { loading, loadingChange } = props;
    const submitButtonRef = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleLoginClick = () => {
        loadingChange();
        submitButtonRef.current.click();
        setTimeout(() => {
            setFormData({
                username: "",
                password: ""
            });
        }, 1500);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

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
        navigate("/register");
    }

    return (
        <Card
            raised={true}
            sx={{ 
                borderRadius: "8px", 
                width: { xs: "calc(100% * .75)", sm: "calc(100% * .45)", md: "calc(100% * .35)" } 
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Form method="post">
                    <Typography
                        variant="h6"
                        textAlign="center"
                        mb={4}
                    >
                        Login
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="username"
                                label="Username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                disabled={loading}
                                autoComplete="on"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                disabled={loading}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <Button
                                variant="contained"
                                disabled={loading}
                                onClick={handleLoginClick}
                                fullWidth
                            >
                                { loading ? "Logging In..." : "Login" }
                            </Button>
                            <Button ref={submitButtonRef} type="submit" sx={{ display: "none" }} />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Button fullWidth variant="outlined" onClick={handleRegisterClick}>Register</Button>
                        </Grid>
                        {/* <Grid item md={6} sm={12} xs={12}>
                            <Button fullWidth variant="outlined" onClick={handleGuestClick}>Login as Guest</Button>
                        </Grid> */}
                    </Grid>
                </Form>
            </CardContent>
        </Card>
    );
}

export default LoginPageCard;