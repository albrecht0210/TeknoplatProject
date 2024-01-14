import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAsyncValue, useOutletContext } from "react-router-dom";
import * as XLSX from 'xlsx';
import { getPitchRemarks } from "../../services/teknoplat_server";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MeetingDetailsPageHistoryDialog = (props) => {
    const { profile } = useOutletContext();
    const [pitchesReponses, feedbacksResponse] = useAsyncValue();
    const { open, handleClose, meeting } = props;

    const pitches = pitchesReponses.data;
    const feedbacks = feedbacksResponse.data;

    let tabOptions = [
        { value: 0, name: "Overall" },
    ];

    const tabPitchOptions = meeting.presentors.map((pitch, index) => { return {value: (index + 1), name: pitch.name }});
    tabOptions = tabOptions.concat(tabPitchOptions);

    const [dialogTabValue, setDialogTabValue] = useState(0);
  
    const handleTabChange = (event, value) => {
        setDialogTabValue(value);
    }

    const handleExportClick = async () => {
        const remarksResponse = await getPitchRemarks(meeting.id);

        const jsonData = pitches.flatMap((pitch) => {
            return pitch.ratings.map(rating => {
                const transformedData = {
                    "Pitch Name": pitch.name,
                    "Account": rating.account.full_name,
                };
        
                rating.criteria.forEach(criteria => {
                    transformedData[criteria.name] = criteria.value;
                });
                transformedData['Remark'] = remarksResponse.data.find((remark) => remark.account === rating.account.id).remark
                transformedData['Feedback'] = feedbacks.find((feedback) => feedback.pitch === pitch.id)
                return transformedData;
            });
        });
        
        const workbook = XLSX.utils.book_new();

        // Convert JSON data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(jsonData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

        XLSX.writeFile(workbook, `${meeting.name}.xlsx`);
    }
  
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: "calc(100vw * .5)", height: "calc(100vh * .7)" } }}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {meeting.name}
                    {profile.role === "Teacher" && <Button variant="contained" onClick={handleExportClick}>Export</Button>}
                </Stack>
            </DialogTitle>
            <DialogContent dividers
                sx={{ 
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
                <Tabs value={dialogTabValue} onChange={handleTabChange} aria-label="action-tabs">
                    {tabOptions.map((option) => (
                        <Tab key={option.value} id={`option-${option.value}`} label={option.name} aria-controls={`tabpanel-${option.value}`} />
                    ))}
                </Tabs> 
                <Divider />
                {dialogTabValue === 0 && <OverallView pitches={pitches} />}
                {dialogTabValue !== 0 && <PitchView profile={profile} pitch={pitches[dialogTabValue - 1]} feedback={feedbacks.find((feedback) => feedback.pitch === pitches[dialogTabValue - 1].id)} />}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
}

const OverallView = ({pitches}) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Rating Summary',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const labels = pitches.map((pitch) => pitch.name);

    const data = {
        labels,
        datasets: [
            {
                label: "Overall Score",
                data: labels.map((label) => pitches.find((pitch) => pitch.name === label).overall),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
        ]
    }

    return (
        <Box p={3}>
            <Bar options={options} data={data} />
        </Box>
    );
}

const PitchView = ({ profile, pitch, feedback }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Rating Summary',
            },
        },
    };

    const initLabels = pitch.ratings.map((rating) => rating.account.full_name);
    let labels;

    if (profile.role === "Student") {
        labels = pitch.ratings.map((rating) => rating.account.role === "Teacher" || rating.account.full_name === profile.full_name ? rating.account.full_name : "Anonymous");
    } else {
        labels = initLabels
    }
    const data = {
        labels,
        datasets: [
            {
                label: "Score",
                data: initLabels.map((label) => pitch.ratings.find((rating) => rating.account.full_name === label).total),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
        ]
    }

    return (
        <Box p={3}>
            <Stack spacing={2}>
                <Bar options={options} data={data} />
                <Paper sx={{ p: 3 }}>
                    <Typography variant="body1" textAlign="justify">{feedback.feedback}</Typography>
                </Paper>
            </Stack>
        </Box>
    );
}

export default MeetingDetailsPageHistoryDialog;
