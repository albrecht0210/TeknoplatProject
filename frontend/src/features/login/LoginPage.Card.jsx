import { Form } from "react-router-dom";
import { useRef, useState } from "react";
import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

const LoginPageCard = (props) => {
    const { loading, loadingChange } = props;
    const submitButtonRef = useRef(null);

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
                    <Stack spacing={3}>
                        <Typography
                            variant="h6"
                            textAlign="center"
                        >
                            Login
                        </Typography>
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
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            disabled={loading}
                            variant="outlined"
                        />
                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={handleLoginClick}
                        >
                            { loading ? "Logging In..." : "Login" }
                        </Button>
                        <Button ref={submitButtonRef} type="submit" sx={{ display: "none" }} />
                    </Stack>
                </Form>
            </CardContent>
        </Card>
    );
}

export default LoginPageCard;