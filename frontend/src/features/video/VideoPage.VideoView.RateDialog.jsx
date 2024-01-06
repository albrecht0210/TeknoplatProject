import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tab, Tabs } from "@mui/material";

const VideoPageVideoViewRateDialog = (props) => {
    const { open, handleClose, meeting } = props;
    
    const pitch = meeting.presentors.find((presentor) => presentor.id === localStorage.getItem("pitch"));

    const tabOptions = [
        { value: 0, name: "Rate", stringValue: "rate" },
        { value: 1, name: "Feedback", stringValue: "feedback" },
    ];
    const [dialogTabValue, setDialogTabValue] = useState(0);

    const handleTabChange = (event, value) => {
        setDialogTabValue(value);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', height: 500 } }}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{pitch?.name}</DialogTitle>
            <DialogContent dividers>
                <Tabs value={dialogTabValue} onChange={handleTabChange} aria-label="action-tabs">
                    {tabOptions.map((option) => (
                        <Tab key={option.value} id={`option-${option.value}`} label={option.name} aria-controls={`tabpanel-${option.value}`} />
                    ))}
                </Tabs> 
                <Divider />
                <Box pt={2}>
                    {dialogTabValue === 0 && <RatingStepperTab />}
                    {dialogTabValue === 1 && <FeedbackTab />}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                {/* <Button disabled={!isDone}>Done</Button> */}
            </DialogActions>
        </Dialog>
    );
}

export default VideoPageVideoViewRateDialog;
