import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { addMeetingComment } from "../../services/teknoplat_server";
import { Send } from "@mui/icons-material";

function VideoPageVideoViewChatPanel() {
    const { profile, meeting } = useLoaderData();
    const scrollableBoxRef = useRef(null);
    
    const [socket, setSocket] = useState(null);
    const [comment, setComment] = useState("");
    const [commentLists, setCommentLists] = useState(meeting.comments);

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8008/ws/comments/${meeting.id}/`);

        ws.onopen = () => {
            setSocket(ws);
        };
        
        ws.onmessage = (event) => {
            const newComment = JSON.parse(event.data).comment;
            setCommentLists((previous) => [
                ...previous,
                newComment
            ]);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setSocket(null);
        };

        return () => {
            ws.close();
        };
        // eslint-disable-next-line 
    }, []);

    useEffect(() => {
        scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
    }, [commentLists]);

    const handleCommentChange = (e) => {
        const { value } = e.target;
        setComment(value);
    }
    
    const handleCommentClick = async (e) => {
        const commentResponse = await addMeetingComment(meeting.id, { comment: comment, account: profile.id });
        if (socket) {
            socket.send(JSON.stringify({
                'comment': commentResponse.data
            }));
            scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
        } else {
            console.log("NULL");
        }
        setComment("");
    }
    return (
        <Paper sx={{ height: "calc(100vh - 72px - 48px - 24px)", width: "360px" }}>
            <Box 
                ref={scrollableBoxRef}
                sx={{ 
                    height: "calc(100vh - 72px - 72px - 48px - 24px)", 
                    maxHeight: "calc(100vh - 72px - 72px - 48px - 24px)", 
                    width: "360px",
                    px: 1,
                    py: 2,
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
                    { commentLists.map((comment) => (
                        <Paper 
                            key={comment.id} 
                            sx={{ 
                                backgroundColor: "black", 
                                width: "fit-content",
                                maxWidth: "80%", 
                                p: 1, 
                                marginLeft: profile.full_name === comment.account_detail.full_name ? "auto !important" : "",
                            }}
                        >
                            <Stack direction="row" spacing={1}>
                                <img 
                                    src="/sample/default_avatar.png"
                                    alt="AccountProfile"
                                    style={{ width: "20px", height: "20px", marginRight: "5px", borderRadius: "5px" }}
                                />
                                <Stack spacing={0}>
                                    <Typography variant="body1" fontSize={14} color="grey">{comment.account_detail.full_name}</Typography>
                                    <Typography variant="body1" fontSize={14}>{comment.comment}</Typography>
                                </Stack>
                            </Stack>
                        </Paper>
                    )) }
                </Stack>
            </Box>
            <Box sx={{ width: "100%", p: 2 }}>
                <Stack direction="row" spacing={1}>
                    <TextField value={comment} name="comment" onChange={handleCommentChange} fullWidth size="small" label="Write a comment..." />
                    <TextField value={profile.id} name="account" type="hidden" />
                    <Button size="small" variant="contained" onClick={handleCommentClick}><Send /></Button>
                </Stack>
            </Box>
        </Paper>
    );
}

export default VideoPageVideoViewChatPanel;
