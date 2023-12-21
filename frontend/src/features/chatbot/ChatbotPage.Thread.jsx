import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useLoaderData, useSubmit } from "react-router-dom";

function ChatbotPageThread() {
    const loaderData = useLoaderData();
    const submit = useSubmit();
    const actionData = useActionData();
    const scrollableBoxRef = useRef(null);

    const [chat, setChat] = useState("");
    const [chats, setChats] = useState(loaderData.chatbot.messages.filter((chat) => chat.role === "user" || chat.role === "assistant"));

    useEffect(() => {
        scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
    }, []);

    const handleChatChange = (e) => {
        const { value } = e.target;
        setChat(value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submit();
        const newChat = actionData.chat;
        setChat("");
        setChats((previous) => ({
            ...previous,
            newChat
        }));
        scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
    }

    return (
        <Box py={3}>
            <Paper sx={{ height: "calc(100vh - 64px - 48px - 48px - 48px - 1px)", p: 1, position: "relative" }}>
                <Box
                    ref={scrollableBoxRef}
                    sx={{ 
                        maxHeight: "calc(100vh - 64px - 48px - 48px - 48px - 16px - 72px - 1px)", 
                        px: 1,
                        overflowY: "hidden",
                        ":hover": {
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            "&::-webkit-scrollbar": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: (theme) => theme.palette.primary.main,
                                borderRadius: "2.5px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: (theme) => theme.palette.background.paper,
                            },
                        },
                    }}
                >
                    <Stack spacing={2}>
                        {chats.map((chat, index) => (
                            <Paper key={index} sx={{ backgroundColor: "black", width: "30%", p: 2, marginLeft: chat.role === "user" ? "auto !important" : "" }}>
                                <Stack spacing={1}>
                                    <Typography variant="body1" fontSize={14}>{chat.role === "user" ? "You" : "Expert Panelist"}</Typography>
                                    <Typography variant="body1" fontSize={14}>{chat.content}</Typography>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                </Box>
                <Paper sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 2}}>
                    <Form method="post" onSubmit={handleSubmit}>
                        <Stack direction="row" spacing={1}>
                            <TextField value={chat} name="chat" onChange={handleChatChange} fullWidth size="small" label="Write your pitch..." />
                            <TextField value={loaderData.chatbot.id} name="chatbot" type="hidden" />
                            <Button type="submit" size="small" variant="contained">Send</Button>
                        </Stack>
                    </Form>
                </Paper>
            </Paper>
        </Box>
    );
}

export default ChatbotPageThread;
