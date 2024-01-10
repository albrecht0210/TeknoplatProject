import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { createTeam } from "../../services/team_server";

const RegisterPageTeamDialog = (props) => {
    const { open, handleClose, course, updateTeamMenu } = props;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        max_members: "",
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    }

    const handleSaveClick = async (e) => {
        const payload = {
            ...formData,
            course: course
        }
        setLoading(true);
        const newTeamResponse = await createTeam(payload);
        console.log(newTeamResponse.data);
        updateTeamMenu(newTeamResponse.data);
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Team Creation</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField fullWidth name="name" label="Name" value={formData.name} onChange={handleInputChange} disabled={loading} />
                            <FormControl sx={{ width: "calc(100% * .5)" }}>
                                <InputLabel id="memberLabel">Max Members</InputLabel>
                                <Select
                                    name="max_members"
                                    labelId="memberLabel"
                                    id="teamSelect"
                                    label="Max Members"
                                    value={formData.max_members}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                >
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="description" label="Description" multiline rows={4} fullWidth value={formData.description} onChange={handleInputChange} disabled={loading} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSaveClick} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default RegisterPageTeamDialog;
