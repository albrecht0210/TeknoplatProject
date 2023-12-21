import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";

export const MeetingDetailsPitches = () => {
    const { presentors } = useOutletContext();

    return (
        <Box p={3}>
            {presentors.map((presentor) => (
                <Accordion key={presentor.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`${presentor.name}-content`}
                        id={`${presentor.name}-header`}
                    >
                        <Typography>{`${presentor.team_json.name} - ${presentor.name}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ mb: 2 }}>{ presentor.description }</Typography>
                        <Stack direction="row" spacing={1}>
                            <Typography>Team Members: </Typography>
                            {presentor.team_json.members.map((member, index) => (
                                <Typography key={member.id}>
                                    {member.full_name}{index !== team.members.length - 1 && <span>,</span>}
                                </Typography>
                            ))}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}
