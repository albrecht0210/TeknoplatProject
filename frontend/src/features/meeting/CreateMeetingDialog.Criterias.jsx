import { Checkbox, FormControlLabel, FormGroup, Stack, TextField } from "@mui/material";

function CreateMeetingDialogCriterias(props) {
    const { criterias, checked, weights, handleChangeChecked, handleInputChange } = props;

    return (
        <FormGroup>
            {criterias.map((criteria, index) => (
                <Stack key={criteria.id} direction="row" justifyContent="space-between" mb={1}>
                    <FormControlLabel 
                        control={
                            <Checkbox checked={checked[index]} onChange={(e) => handleChangeChecked(e, index)} />
                        } 
                        label={criteria.name} 
                    />
                    <TextField disabled={!checked[index]} sx={{ width: "30%" }} size="small" label="Weight" name="weight" value={weights[index]} onChange={(e) => handleInputChange(e, index)} />
                </Stack>
            ))}
        </FormGroup>
    );
}

export default CreateMeetingDialogCriterias;
