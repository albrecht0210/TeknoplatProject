import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";

export const MeetingDetailsCriterias = () => {
    const { criterias } = useOutletContext();

    return (
        <Box p={3}>
            {criterias.map((criteria) => (
                <Accordion key={criteria.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`${criteria.name}-content`}
                        id={`${criteria.name}-header`}
                    >
                        <Typography>{`${criteria.name} - ${criteria.weight * 100}%`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography sx={{ mb: 2 }}>{ criteria.description }</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}