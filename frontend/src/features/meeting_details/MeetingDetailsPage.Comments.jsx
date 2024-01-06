import { Box, Button, Paper, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { addMeetingComment } from "../../services/teknoplat_server";
import { Send } from "@mui/icons-material";

const MeetingDetailsPageComments = (props) => {
    const { profile, comments } = props;
    const scrollableBoxRef = useRef(null);
    const { meetingId } = useParams();
    
    const [socket, setSocket] = useState(null);
    const [comment, setComment] = useState("");
    const [commentLists, setCommentLists] = useState(comments);

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8008/ws/comments/${meetingId}/`);

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
        const commentResponse = await addMeetingComment(meetingId, { comment: comment, account: profile.id });
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
        <Box pt={3} pl={3} pr={3}>
            <Paper sx={{ height: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 1px)", p: 1, position: "relative", minHeight: "500px" }}>
                <Box
                    ref={scrollableBoxRef}
                    sx={{ 
                        maxHeight: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 72px - 16px - 1px)", 
                        minHeight: "calc(500px - 72px)",
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
                        {commentLists.map((comment) => (
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
                        ))}
                    </Stack>
                </Box>
                <Paper sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 2}}>
                    <Stack direction="row" spacing={1}>
                        <TextField value={comment} name="comment" onChange={handleCommentChange} fullWidth size="small" label="Write a comment..." />
                        <TextField value={profile.id} name="account" type="hidden" />
                        <Button size="small" variant="contained" onClick={handleCommentClick}><Send /></Button>
                    </Stack>
                </Paper>
            </Paper>
        </Box>
    );
}

export const MeetingDetailsPageCommentsSkeleton = () => {
    return (
        <Box pt={3} pl={3} pr={3}>
            <Paper sx={{ height: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 1px)", p: 1, position: "relative" }}>
                <Skeleton animation="wave" variant="rounded" sx={{ height: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 1px)"}} />
            </Paper>
        </Box>
    )
}

export default MeetingDetailsPageComments;
