import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Rating, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { addPitchFeedback, addPitchRating, fetchAccountRatings, fetchAccountRemarks, updatePitchFeedback, updatePitchRating } from "../../services/teknoplat_server";

const VideoPageVideoViewRateDialog = (props) => {
    const { open, handleClose } = props;
    // const { profile, meeting, ratings, remarks } = useLoaderData();
    const { profile, meeting } = useLoaderData();

    let initialRateData = {};
    meeting.criterias.forEach((criteria) => initialRateData[criteria.name] = 0);

    const [pitch, setPitch] = useState({});
    const [ratingsData, setRatingsData] = useState(initialRateData);
    const [ratingsId, setRatingsId] = useState(null);
    const [remark, setRemark] = useState("");
    const [remarkId, setRemarkId] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const fillData = async (pitchId) => {
        const ratingsResponse = await fetchAccountRatings(meeting.id, pitchId);
        if (ratingsResponse.data.length !== 0) {
            const ratings = ratingsResponse.data;
            let updatedRateData = {};
            let ids = {};
            meeting.criterias.forEach((criteria) => {
                updatedRateData[criteria.name] = Number(ratings.find((rating) => rating.criteria === criteria.criteria).rating);
                ids[criteria.name] = ratings.find((rating) => rating.criteria === criteria.criteria).id;
            });
            setRatingsData(updatedRateData);
            setRatingsId(ids);
            setIsUpdate(true);
        }
        const remarkResponse = await fetchAccountRemarks(meeting.id, pitchId);
        if (remarkResponse.data.length !== 0) {
            setRemark(remarkResponse.data[0].remark);
            setRemarkId(remarkResponse.data[0].id);
        }
    }

    useEffect(() => {
        if (open) {
            const pitch = meeting.presentors.find((presentor) => presentor.id === localStorage.getItem("pitch"));
            setPitch(pitch);
            fillData(pitch.id);
        } else {
            setRatingsData(initialRateData);
            setRemark("");
        }
        // eslint-disable-next-line
    }, [open]);

    useEffect(() => {
        let isNotZero = true;

        meeting.criterias.forEach((criteria) => {
            if (!isNotZero) return;
            isNotZero = ratingsData[criteria.name] !== 0;
        });
        setIsComplete(isNotZero && remark !== "");
        // eslint-disable-next-line 
    }, [ratingsData, remark]);

    const handleRatingChange = (e, newValue) => {
        const  {name} = e.target;

        setRatingsData((previousData) => ({
            ...previousData,
            [name]: newValue
        }))
    }

    const handleRemarkChange = (e) => {
        setRemark(e.target.value);
    }

    const handleSaveClick = async () => {
        setIsComplete(false);
        const ratingsPayload = meeting.criterias.map((criteria) => ({
            rating: ratingsData[criteria.name],
            account: profile.id,
            pitch: localStorage.getItem("pitch"),
            meeting: meeting.id,
            criteria: criteria.criteria
        }));

        const remarkPayload = {
            remark: remark,
            account: profile.id,
            pitch: localStorage.getItem("pitch"),
            meeting: meeting.id,
        }

        ratingsPayload.map(async (payload) => {
            try {
                if (isUpdate) {
                    const id = ratingsId[meeting.criterias.find((criteria) => payload.criteria === criteria.criteria).name];
                    payload['id'] = id;
                    await updatePitchRating(payload);
                } else {
                    await addPitchRating(payload);
                }
            } catch (error) {

            }
        });

        try {
            if (isUpdate) {
                remarkPayload['id'] = remarkId;
                await updatePitchFeedback(remarkPayload);
            } else {
                await addPitchFeedback(remarkPayload);
            }
        } catch (error) {

        }
        handleClose();
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', height: "70%" } }}
            maxWidth="sm"
            open={open}
        >
            <DialogTitle>{pitch?.name}</DialogTitle>
            <DialogContent dividers>
                <Typography variant="h6">Rating</Typography>
                <Stack spacing={2} py={2}>
                    {meeting.criterias.map((criteria) => (
                        <Stack key={criteria.id} direction="row" justifyContent="space-between">
                            <Typography>{criteria.name}</Typography>
                            <Stack direction="row" spacing={1}>
                                <Rating
                                    name={criteria.name}
                                    precision={0.2}
                                    value={ratingsData[criteria.name]}
                                    onChange={handleRatingChange}
                                    size="large"
                                />
                                <Typography>{ratingsData[criteria.name] % 1 === 0 ? `${ratingsData[criteria.name]}.0` : ratingsData[criteria.name]}</Typography>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>Remarks</Typography>
                <TextField 
                    value={remark} 
                    onChange={handleRemarkChange} 
                    fullWidth 
                    multiline 
                    rows={5} 
                    label="Write your remark/feedback" 
                />
                
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={handleSaveClick} disabled={!isComplete}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default VideoPageVideoViewRateDialog;
