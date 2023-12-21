import { Box, Paper } from "@mui/material";
import { useLoaderData, useSubmit } from "react-router-dom";

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

function VideoPageVideoViewChatPanel(props) {
    const { profile } = useOutletContext();
    const { meetingId } = useParams();
    const submit = useSubmit();
    const data = useLoaderData();

    const scrollableBoxRef = useRef(null);

    const [socket, setSocket] = useState(null);
    const [comment, setComment] = useState("");
    const [commentLists, setCommentLists] = useState(data.comments);

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
        <Paper sx={{ height: "calc(100vh - 72px - 48px - 24px)", width: "calc(100vw * 0.25)" }}>
            <Box 
                ref={scrollableBoxRef}
                sx={{ 
                    height: "calc(100vh - 72px - 72px - 48px - 24px)", 
                    maxHeight: "calc(100vh - 72px - 72px - 48px - 24px)", 
                    width: "calc(100vw * 0.25)",
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
                        <Paper key={comment.id} sx={{ backgroundColor: "black", width: "fit-content", maxWidth: "80%", p: 1, marginLeft: profile.full_name === comment.account_detail.full_name ? "auto !important" : "" }}>
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
                <Form method="post" onSubmit={handleSubmit}>
                    <Stack direction="row" spacing={1}>
                        <TextField value={comment} name="comment" onChange={handleCommentChange} fullWidth size="small" label="Write a comment..." />
                        <TextField value={profile.id} name="account" type="hidden" />
                        <Button type="submit" size="small" variant="contained">Send</Button>
                    </Stack>
                </Form>
            </Box>
        </Paper>
    );
}

export default VideoPageVideoViewChatPanel;
