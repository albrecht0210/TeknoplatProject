import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const CreateMeetingDialogPresentors = (props) => {
    const { pitches, teams, checked, handleChangeChecked } = props;
    
    return (
        <FormGroup>
            {pitches.map((pitch, index) => (
                <FormControlLabel 
                    key={pitch.id} 
                    control={
                        <Checkbox checked={checked[index]} onChange={(e) => handleChangeChecked(e, index)} />
                    } 
                    label={`${teams.find((team) => team.id === pitch.team).name} - ${pitch.name}`} 
                />
            ))}
        </FormGroup>
    );
}

export default CreateMeetingDialogPresentors;
