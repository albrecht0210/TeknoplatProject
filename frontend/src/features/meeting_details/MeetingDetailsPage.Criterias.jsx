import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Skeleton, Typography } from "@mui/material";

const MeetingDetailsPageCriterias = (props) => {
    const { criterias } = props;

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

export const MeetingDetailsPageCriteriasSkeleton = () => {
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

export default MeetingDetailsPageCriterias;