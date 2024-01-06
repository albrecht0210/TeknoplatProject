import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { addPitchFeedback } from "../../services/teknoplat_server";

const VideoPageVideoViewRateDialogFeedback = () => {
    const { profile, meeting, remarks } = useLoaderData();

    const findRemark = remarks.find((remark) => remark.pitch === localStorage.getItem("pitch"))

    const [remark, setRemark] = useState(findRemark?.remark ?? "");

    const handleChangeValue = (e) => {
        const {value} = e.target;
        setRemark(value);
    }

    const handleSave = async () => {
        const payload = {
            remark: remark,
            account: profile.id,
            pitch: localStorage.getItem("pitch"),
            meeting: meeting.id,
        }

        try {
            await addPitchFeedback(payload);
        } catch (error) {

        }
    }

    return (
        <Stack spacing={2} alignItems="center">
            <TextField
                id="feedbackTextField"
                label="Feedback"
                onChange={handleChangeValue}
                value={remark}
                multiline
                fullWidth
                rows={8}
                maxRows={8}
            />
            <Button onClick={handleSave} sx={{ width: 100 }}>Save</Button>
        </Stack>
    );
}

export default VideoPageVideoViewRateDialogFeedback;
