import { Close } from "@mui/icons-material";
import { AppBar, Button, Checkbox, Dialog, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, MenuItem, Select, Slide, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useAsyncValue } from "react-router-dom";
import { addNewActivity } from "../../services/activity_server";
import { addMeetingCriteria, addMeetingPresentor, fetchMeetingById, updateNewMeeting } from "../../services/teknoplat_server";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MeetingsPageCreateMeeting = (props) => {
    const { profile, open, handleClose } = props;
    const [pitchesReponses, criteriasResponse] = useAsyncValue();

    const pitches = pitchesReponses.data;
    const criterias = criteriasResponse.data;

    let submitButtonRef = useRef(null);
    const [dialogOpen, setDialogOpen] = useState(open);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        teacher_weight_score: "80",
        student_weight_score: "20",
    });
    const [checkedTeams, setCheckedTeams] = useState(pitches.map(() => false));
    const [formCriterias, setFormCriterias] = useState(criterias.map(() => { return { criteria: false, weight: "0" }}));
    const [isWeightError, setIsWeightError] = useState(false);
    const [emails, setEmails] = useState([{ email: "", emailAt: "@gmail.com" }]);
    const [loading, setLoading] = useState(false);
    
    const { name, description, teacher_weight_score, student_weight_score } = formData;

    useEffect(() => {
        setDialogOpen(open);
    }, [open]);

    useEffect(() => {
        let sum = 0;
        formCriterias.forEach((form) => {
            sum += Number(form.weight);
        });
        if (sum > 100) {
            setIsWeightError(true);
        } else {
            setIsWeightError(false);
        }
    }, [formCriterias]);

    const handleDialogClose = () => {
        setDialogOpen(false);
        setFormData({
            name: "",
            description: "",
            teacher_weight_score: "80",
            student_weight_score: "20",
        });
        setEmails([{ email: "", emailAt: "@gmail.com" }]);
        setCheckedTeams(pitches.map(() => false));
        setFormCriterias(criterias.map(() => { return { criteria: false, weight: "0" }}));
        setIsWeightError(false);
        setLoading(false);
        setTimeout(() => {
            handleClose();
        }, 1000);
    }

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        if (name === 'teacher_weight_score') {
            if (value === "") value = "0";
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue > 100) return;
            const studentWeight = 100 - parseInt(numericValue, 10);
            setFormData(prev => ({ ...prev, teacher_weight_score: numericValue, student_weight_score: studentWeight }));
        } else if (name === 'student_weight_score') {
            if (value === "") value = "0";
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue > 100) return;
            const teacherWeight = 100 - parseInt(numericValue, 10);
            setFormData(prev => ({ ...prev, student_weight_score: numericValue, teacher_weight_score: teacherWeight }));
        } else {
            setFormData((previousFormData) => ({
                ...previousFormData,
                [name]: value
            }));
        }
    }

    const handleChangeCheckTeam = (e, position) => {
        const newcheckedTeams = checkedTeams.map((checked, index) => {
            if (index === position) {
                return !checked;
            } else {
                return checked;
            }
        });
        setCheckedTeams(newcheckedTeams);
    }

    const handleChangeCheckCriteria = (e, position) => {
        const newFormCriterias = formCriterias.map((form, index) => {
            if (index === position) {
                return { criteria: !form.criteria, weight: form.weight };
            } else {
                return form;
            }
        });
        setFormCriterias(newFormCriterias);
    }

    const handleWeightClick = (e, position) => {
        const newFormCriterias = formCriterias.map((form, index) => {
            if (index === position) {
                return { criteria: form.criteria, weight: "" };
            } else {
                return form;
            }
        });
        setFormCriterias(newFormCriterias);
    }

    const handleWeightChange = (e, position) => {
        let { value } = e.target;
        if (value === "") value = "0";
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue > 100) return;

        const newFormCriterias = formCriterias.map((form, index) => {
            if (index === position) {
                return { criteria: form.criteria, weight: numericValue };
            } else {
                return form;
            }
        });
        setFormCriterias(newFormCriterias);
    }

    const handleInvitedEmailChange = (e, position) => {
        const newEmails = emails.map((email, index) => {
            if (index === position) {
                return { email: e.target.value, emailAt: email.emailAt }
            } else {
                return email;
            }
        });
        setEmails(newEmails);
    }

    const handleAddEmailClick = () => {
        setEmails(email => [...email, { email: "", emailAt: "@gmail.com" }]);
    }

    const handleEmailAtChange = (e, position) => {
        const newEmails = emails.map((email, index) => {
            if (index === position) {
                return { email: email.email, emailAt: e.target.value }
            } else {
                return email;
            }
        });
        setEmails(newEmails);
    };

    const handleImportData = () => {

    }

    const handleSave = async () => {
        setLoading(true);
        const activity_data = {
            name: name,
            description: description,
            account: profile.id
        };
        const meeting_update_data = {
            teacher_weight_score: Number(teacher_weight_score) / 100,
            student_weight_score: Number(student_weight_score) / 100
        };
        const meeting_presentors_data = checkedTeams.filter((checked) => checked === true).map((checked, index) => {
            return { presentor: pitches[index].id };
        });
        const meeting_criterias_data = formCriterias.filter((form) => form.criteria === true).map((form, index) => {
            return { criteria: criterias[index], weight: form.weight };
        });

        const activityResponse = await addNewActivity(activity_data);
        const activity = activityResponse.data;
        const meetingResponse = await fetchMeetingById(activity.meeting);
        const meeting = meetingResponse.data;
        await updateNewMeeting(meeting, meeting_update_data);
        
        meeting_presentors_data.forEach(async (presentor) => {
            await addMeetingPresentor(meeting.id, presentor);
        });

        meeting_criterias_data.forEach(async (criteria) => {
            await addMeetingCriteria(meeting.id, criteria);
        });

        setTimeout(() => {
            handleDialogClose();
            setLoading(false);
        }, 1000);    
    }

    return (
        <Dialog fullScreen open={dialogOpen} onClose={handleDialogClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleDialogClose}
                        aria-label="close"
                    >
                        <Close />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Create Meeting
                    </Typography>
                    <Button color="inherit" onClick={handleImportData} sx={{ mr: 2 }}>
                        Import
                    </Button>
                    <Button disabled={loading} color="inherit" onClick={handleSave}>
                        { loading ? "Saving" : "Save" }
                    </Button>
                    <Button ref={submitButtonRef} type="submit" sx={{ display: "none" }} />
                </Toolbar>
            </AppBar>
            <Grid 
                container 
                sx={{ 
                    p: 5,
                    maxHeight: "calc(100vh - 64px)",
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
                <Grid item sm={12} md={4} sx={{ p: 1 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Meeting General Information</Typography>
                        <TextField label="Title" name="name" value={name} onChange={handleInputChange} />
                        <TextField 
                            label="Description" 
                            name="description" 
                            value={description} 
                            onChange={handleInputChange} 
                            multiline 
                            rows={5}
                        />
                        <Grid container>
                            <Grid item xs={6} sx={{ pr: 1 }}>
                                <TextField 
                                    fullWidth 
                                    label="Teacher Score Weight" 
                                    name="teacher_weight_score" 
                                    value={teacher_weight_score} 
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    onChange={handleInputChange} 
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ pl: 1 }}>
                                <TextField 
                                    fullWidth 
                                    label="Student Score Weight"
                                    name="student_weight_score" 
                                    value={student_weight_score}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    onChange={handleInputChange} 
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="h6">Invite Guest Mentors</Typography>
                        {emails.map((email, index) => (
                            <Stack key={index} direction="row">
                                <TextField fullWidth label="Email" name={`email${index}`} value={email.email} onChange={(e) => handleInvitedEmailChange(e, index)} />
                                <FormControl sx={{ width: 200 }}>
                                    <Select
                                        id="emailAt"
                                        value={email.emailAt}
                                        onChange={(e) => handleEmailAtChange(e, index)}
                                    >
                                        <MenuItem value="@cit.edu">@cit.edu</MenuItem>
                                        <MenuItem value="@gmail.com">@gmail.com</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField name={`fullEmail${index}`} value={`${email.email}${email.emailAt}`} sx={{ display: "none" }} />
                            </Stack>
                        ))}
                        <Button variant="contained" sx={{ width: "50px" }} onClick={handleAddEmailClick} >Add</Button>
                    </Stack>
                </Grid>
                <Grid item sm={12} md={8} sx={{ p: 1 }}>
                    <Grid container>
                        <Grid item md={5} xs={12} sx={{ px: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Teams</Typography>
                            <FormGroup>
                                {pitches.map((pitch, index) => (
                                    <FormControlLabel 
                                        key={pitch.id} 
                                        control={
                                            <Checkbox checked={checkedTeams[index]} onChange={(e) => handleChangeCheckTeam(e, index)} />
                                        } 
                                        label={pitch.team_json.name} 
                                    />
                                ))}
                            </FormGroup>
                        </Grid>
                        <Grid item md={7} xs={12} sx={{ px: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Criteria</Typography>
                            <FormGroup>
                                {criterias.map((criteria, index) => (
                                    <Stack key={criteria.id} direction="row" justifyContent="space-between" mb={1}>
                                        <FormControlLabel 
                                            control={
                                                <Checkbox checked={formCriterias[index].criteria} onChange={(e) => handleChangeCheckCriteria(e, index)} />
                                            } 
                                            label={criteria.name} 
                                        />
                                        <TextField 
                                            disabled={!formCriterias[index].criteria} 
                                            sx={{ width: "30%" }} 
                                            size="small" 
                                            label="Weight" 
                                            name="weight" 
                                            value={formCriterias[index].weight} 
                                            onChange={(e) => handleWeightChange(e, index)} 
                                            onClick={(e) => handleWeightClick(e, index)}
                                            error={formCriterias[index].criteria && isWeightError}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                                            }}
                                        />
                                    </Stack>
                                ))}
                            </FormGroup>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    );
}

export default MeetingsPageCreateMeeting;
