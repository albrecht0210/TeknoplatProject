import { Form, useSubmit } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import LoginButton from "./LoginButton";

const LoginCard = () => {
    const submit = useSubmit();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        setLoading(true);
        submit(formData);
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
                <Form method="post" onSubmit={handleSubmit}>
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
                            disabled={loading}
                            variant="outlined"
                        />
                        <LoginButton disabled={loading} />
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={loading}
                        >
                            { loading ? "Logging In..." : "Login" }
                        </Button>
                    </Stack>
                </Form>
            </CardContent>
        </Card>
    );
}

export default LoginCard;