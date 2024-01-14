import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { createPitch, updatePitch } from "../../services/teknoplat_server";

const MeetingsPageCreatePitch = (props) => {
    const { open, handleClose, team, updateTeam, isCreate=true } = props;

    const [formData, setFormData] = useState({
        name: team?.pitch?.name ?? "",
        description: team?.pitch?.description ?? "",
        team: team.id,
        team_name: team.name,
        course: localStorage.getItem("course")
    });

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    }

    const handleSaveClick = async() => {
        if (isCreate) {
            await createPitch(formData);
        } else {
            await updatePitch(formData, team.pitch.id);
        }
        updateTeam(formData);
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} sx={{ "& .MuiPaper-root": { width: "calc(100vw * .3)" } }}>
            <DialogTitle>{isCreate ? "Create your pitch" : "Update your pitch"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 2 }}>
                    <TextField name="name" label="Name" value={formData.name} onChange={handleInputChange} />
                    <TextField name="description" multiline rows={4} label="Description" value={formData.description} onChange={handleInputChange} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSaveClick} disabled={formData.name === "" || formData.description === ""}>Save</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default MeetingsPageCreatePitch;
