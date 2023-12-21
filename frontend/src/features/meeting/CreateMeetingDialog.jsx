import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useState } from "react";
import CreateMeetingDialogPresentors from "./CreateMeetingDialog.Presentors";
import CreateMeetingDialogCriterias from "./CreateMeetingDialog.Criterias";
import { addNewActivity } from "../../services/activity_server";
import { addMeetingCriteria, addMeetingPresentor, fetchMeeting, updateNewMeeting } from "../../services/teknoplat_server";

const CreateMeetingDialog = (props) => {
    const { open, pitches, teams, criterias, profile, handleClose } = props;
    
    const tabOptions = [
        { value: 0, name: "Presentors", stringValue: "presentors" },
        { value: 1, name: "Criteria", stringValue: "criteria" },
    ];

    const [formData, setFormData] = useState({
        name: "",
        descripton: "",
        teacher_weight_score: "",
        student_weight_score: "",
        checkedPitches: pitches.map(() => false),
        checkedCriterias: criterias.map(() => false),
        criteriaWeights: criterias.map(() => ""),
        presentors: [],
        criterias: []
    });
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, value) => {
        setTabValue(value);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'teacher_weight_score') {
            const numericValue = value.replace(/[^0-9]/g, '');
            const studentWeight = 100 - parseInt(numericValue, 10);
            setFormData(prev => ({ ...prev, teacher_weight_score: numericValue, student_weight_score: studentWeight }));
        } else if (name === 'student_weight_score') {
            const numericValue = value.replace(/[^0-9]/g, '');
            const teacherWeight = 100 - parseInt(numericValue, 10);
            setFormData(prev => ({ ...prev, student_weight_score: numericValue, teacher_weight_score: teacherWeight }));
        } else {
            setFormData((previousFormData) => ({
                ...previousFormData,
                [name]: value
            }));
        }
    }

    const handleInputWeights = (e, position) => {
        const { value } = e.target;
        const weights = formData.criteriaWeights.map((weight, index) => index === position ? value : weight);
        const criteriaList = formData.criterias.map((criteria) => criteria.pos === position ? ({...criteria, weight: weights[position]}) : ({...criteria}));
        setFormData((previousFormData) => ({
            ...previousFormData,
            criteriaWeights: weights,
            criterias: criteriaList
        }));
    }

    const handleChangeCheckedPitches = (e, position) => {
        const { checkedPitches, presentors } = formData;
        const checked = checkedPitches.map((check, index) => index === position ? !check : check);
        const pitch = pitches[position];
        const finalPresentors = checked[position] ? [...presentors, pitch.id] : presentors.filter(id => id !== pitch.id);
        setFormData(prev => ({ ...prev, checkedPitches: checked, presentors: finalPresentors }));
    }

    const handleChangeCheckedCriterias = (e, position) => {
        const { checkedCriterias, criterias, criteriaWeights } = formData;
        const checked = checkedCriterias.map((check, index) => index === position ? !check : check);
        const criteria = criterias[position];
        const criteriaWeight = criteriaWeights[position];
        const criteriaData = { pos: position, criteria: criteria.id, weight: criteriaWeight };
        const finalCriterias = checked[position] ? [...criterias, criteriaData] : criterias.filter(c => c.pos !== position);
        setFormData(prev => ({ ...prev, checkedCriterias: checked, criterias: finalCriterias }));
    }

    const handleSaveDialog = async () => {
        console.log(formData);
        // const activityResponse = await addNewActivity({ name: formData.name, descripton: formData.descripton, account: profile.id});
        // const activity = activityResponse.data;
        
        // const meetingResponse = await fetchMeeting(activity.meeting);
        // const meeting = meetingResponse.data;

        // await updateNewMeeting(meeting, { teacher_weight_score: Number(formData.teacher_weight_score) / 100, student_weight_score: Number(formData.student_weight_score) / 100 })
        // formData.presentors.forEach(async (presentor) => {
        //     await addMeetingPresentor(meeting.id, { presentor: presentor });
        // });

        // formData.criterias.forEach(async (criteria) => {
        //     await addMeetingCriteria(meeting.id, { criteria: criteria, weight: criteria.weight });
        // })
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create a Meeting</DialogTitle>
            <DialogContent sx={{ width: "calc(100vw * 0.5)", height: "calc(100vh * 0.9)" }}>
                <Stack spacing={2} sx={{ py: 2, px: 1 }}>
                    <TextField label="Title" name="name" value={formData.name} onChange={handleInputChange} />
                    <TextField label="Description" name="descripton" value={formData.descripton} onChange={handleInputChange} />
                    <Stack direction="row" spacing={2}>
                        <TextField fullWidth label="Teacher Score Weight" name="teacher_weight_score" value={`${formData.teacher_weight_score}%`} onChange={handleInputChange} />
                        <TextField fullWidth label="Student Score Weight" name="student_weight_score" value={`${formData.student_weight_score}%`} onChange={handleInputChange} />
                    </Stack>
                </Stack>
                <TabContainer 
                    tabOptions={tabOptions}
                    handleChange={handleTabChange}
                    selected={tabValue}
                />
                <Box 
                    px={2} 
                    pt={2} 
                    sx={{ 
                        maxHeight: "calc(100vh * 0.265)",
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
                    }}>
                    {tabValue === 0 && <CreateMeetingDialogPresentors 
                            pitches={pitches} 
                            teams={teams} 
                            checked={formData.checkedPitches} 
                            handleChangeChecked={handleChangeCheckedPitches} 
                        />
                    }
                    {tabValue === 1 && <CreateMeetingDialogCriterias
                            criterias={criterias} 
                            checked={formData.checkedCriterias} 
                            weights={formData.criteriaWeights} 
                            handleChangeChecked={handleChangeCheckedCriterias}
                            handleInputChange={handleInputWeights}
                        />
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSaveDialog}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateMeetingDialog;
