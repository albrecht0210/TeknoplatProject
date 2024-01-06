import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Skeleton, Stack, Typography } from "@mui/material";

const MeetingDetailsPagePresentors = (props) => {
    const { presentors } = props;

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
                                    {member.full_name}{index !== presentor.team_json.members.length - 1 && <span>,</span>}
                                </Typography>
                            ))}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}

export const MeetingDetailsPagePresentorsSkeleton = () => {
    return (
        <Box p={3}>
            {[0, 1, 2, 3, 4, 5].map((item) => (
                <Accordion key={item}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`${item}-content`}
                        id={`${item}-header`}
                    >
                        <Skeleton animation="wave" variant="text" />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Skeleton animation="wave" variant="text" />
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}

export default MeetingDetailsPagePresentors;
