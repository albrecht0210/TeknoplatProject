import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, MobileStepper, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { addPitchRating } from "../../services/teknoplat_server";

const VideoPageVideoViewRateDialogRate = () => {
    const { profile, meeting, ratings } = useLoaderData();

    const initialFormData = meeting.criterias.reduce((acc, criteria) => {
        acc[criteria.name] = ratings.find((rating) => rating.meeting === meeting.id && rating.criteria === criteria.id)?.rating ?? "";
        return acc;
    }, {});

    console.log(initialFormData);

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(initialFormData);
    const maxSteps = meeting.criterias.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    }

    const handleSave = async () => {
        const payload = {
            rating: Number(formData[meeting.criterias[activeStep].name]),
            account: profile.id,
            pitch: localStorage.getItem("pitch"),
            meeting: meeting.id,
            criteria:  meeting.criterias[activeStep].criteria,
        };

        try {
            await addPitchRating(payload);
            if (activeStep !== maxSteps - 1) {
                handleNext();
            }
        } catch (error) {

        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 50,
                    pl: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Typography>{meeting.criterias[activeStep].name}</Typography>
            </Paper>
            <Box sx={{ width: '100%', p: 2, height: "calc(500px - 64px - 32px - 48px - 16px - 50px - 48px - 52.5px - 3px)" }}> 
                <Stack spacing={2}>
                    <Typography>{meeting.criterias[activeStep].description}</Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <TextField onChange={handleChangeValue} value={formData[meeting.criterias[activeStep].name]} name={meeting.criterias[activeStep].name} label="Input Value"/>
                        <Button onClick={handleSave}>Save</Button>
                    </Stack>
                </Stack>
            </Box>
            <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        <KeyboardArrowLeft />Back
                    </Button>
                }
            />
        </Box>
    );
}

export default VideoPageVideoViewRateDialogRate;
