import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { addNewChatToChatbot } from "../../services/teknoplat_server";

function ChatbotPageThread() {
    const { chatbot } = useLoaderData();
    const scrollableBoxRef = useRef(null);
    console.log(chatbot.messages);
    const [chat, setChat] = useState("");
    const [chats, setChats] = useState(chatbot.messages);

    useEffect(() => {
        scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
    }, [chats]);

    const handleChatChange = (e) => {
        const { value } = e.target;
        setChat(value);
    }

    const handleSend = async (e) => {
        // const updateChats = {'role': 'user', 'content': chat};
        setChats((previous) => (([
            ...previous,
            {role: 'user', content: chat}
        ])));
        setChat("");
        const chatResponse = await addNewChatToChatbot(chatbot.id, { 
            content: chat, 
            leniency: localStorage.getItem("lenient_harsh") ?? 0.5,
            generality: localStorage.getItem("general_specific") ?? 0.5,
            optimism: localStorage.getItem("optimistic_pessimistic") ?? 0.5,
        });
        const newChatData = chatResponse.data;
        console.log(newChatData)
        setChats((previous) => (([
            ...previous,
            newChatData
        ])));
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
                        {chats.map((ch, index) => (
                            <Paper key={index} sx={{ backgroundColor: "black", width: "30%", p: 2, marginLeft: ch.role === "user" ? "auto !important" : "" }}>
                                <Stack spacing={1}>
                                    <Typography variant="body1" fontSize={14}>{ch.role === "user" ? "You" : "Expert Panelist"}</Typography>
                                    {ch.content.split("\n").map((str, index) => (
                                        <Typography key={index} variant="body1" fontSize={14}>{str}</Typography>
                                    ))}
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                </Box>
                <Paper sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 2}}>
                    <Stack direction="row" spacing={1}>
                        <TextField multiline maxRows={8} value={chat} name="chat" onChange={handleChatChange} fullWidth size="small" label="Write your pitch..." />
                        <TextField value={chatbot?.id} name="chatbot" type="hidden" />
                        <Button size="small" variant="contained" onClick={handleSend}>Send</Button>
                    </Stack>
                </Paper>
            </Paper>
        </Box>
    );
}

export default ChatbotPageThread;
