import { Box, Paper, Stack, TextField, Typography } from "@mui/material";
import { Form, useActionData, useOutletContext, useParams, useSubmit } from "react-router-dom";
import { addMeetingComment } from "../../services/teknoplat_server";
import { useEffect, useRef, useState } from "react";

export async function action({ request, params }) {
    const formData = await request.formData();
    const comment = formData.get("comment");
    const account = formData.get("account");
    const meetingId = params.meetingId;

    try {
        const commentResponse = await addMeetingComment(meetingId, { comment: comment, account: account });
        return { comment: commentResponse.data };
    } catch(error) {
        return error.response.data;
    }
}

export const MeetingDetailsComments = (props) => {
    const { profile, comments } = useOutletContext();
    const submit = useSubmit();
    const { meetingId } = useParams();
    const data = useActionData();

    const scrollableBoxRef = useRef(null);

    const [socket, setSocket] = useState(null);
    const [comment, setComment] = useState("");
    const [commentLists, setCommentLists] = useState(comments);

    useEffect(() => {
        const ws = new WebSocket(`${process.env.REACT_APP_TEKNOPLAT_WEBSOCKET_URL}/ws/comments/${meetingId}/`);

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
    }, []);

    useEffect(() => {
        scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
    }, []);

    const handleCommentChange = (e) => {
        const { value } = e.target;
        setComment(value);
    }

    const handleSubmit = async () => {
        e.preventDefault();
        submit();                
        if (socket) {
            socket.send(JSON.stringify({
                'comment': data.comment
            }));
            scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
        } else {
            console.log("NULL");
        }
        setComment("");
    }
    
    return (
        <Box pt={3} pl={3} pr={3}>
            <Paper sx={{ height: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 1px)", p: 1, position: "relative" }}>
                <Box
                    ref={scrollableBoxRef}
                    sx={{ 
                        maxHeight: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 72px - 16px - 1px)", 
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
                            <Paper key={comment.id} sx={{ backgroundColor: "black", width: "fit-content", p: 1, marginLeft: profile.full_name === comment.account_detail.full_name ? "auto !important" : "" }}>
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
                    <Form method="post" onSubmit={handleSubmit}>
                        <Stack direction="row" spacing={1}>
                            <TextField value={comment} name="comment" onChange={handleCommentChange} fullWidth size="small" label="Write a comment..." />
                            <TextField value={profile.id} name="account" type="hidden" />
                            <Button type="submit" size="small" variant="contained">Send</Button>
                        </Stack>
                    </Form>
                </Paper>
            </Paper>
        </Box>
    );
}
