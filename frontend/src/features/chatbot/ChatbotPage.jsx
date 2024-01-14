import { useState } from "react";
import ChatbotPageThread from "./ChatbotPage.Thread";
import ChatbotPageSetting from "./ChatbotPage.Setting";
import { fetchChatbotThread, initiateChatbotThread } from "../../services/teknoplat_server";
import { Box, Divider, Tab, Tabs } from "@mui/material";

export async function loader({ request, params }) {
    const account = localStorage.getItem("account");
    
    try {
        let chatbotResponse = await fetchChatbotThread(account);
        console.log(chatbotResponse.data);
        if (chatbotResponse.data.length === 0) {
            chatbotResponse = await initiateChatbotThread(account);
        }
        return { chatbot: chatbotResponse.data[0] };
    } catch (error) {
        return error.response.data;
    }
}

export const Component = () => {
    const tabOptions = [
        { value: 0, name: "Chatbot"},
        { value: 1, name: "Settings" },
    ];

    const [tabValue, setTabValue] = useState(0);
    
    const handleTabChange = (event, value) => {
        setTabValue(value);
    }

    return (
        <Box p={3}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="action-tabs">
                {tabOptions.map((option) => (
                    <Tab key={option.value} id={`option-${option.value}`} label={option.name} aria-controls={`tabpanel-${option.value}`} />
                ))}
            </Tabs> 
            <Divider />
            {tabValue === 0 && <ChatbotPageThread /> }
            {tabValue === 1 && <ChatbotPageSetting /> }
        </Box>
    );
}

Component.displayName = "ChatbotPage"