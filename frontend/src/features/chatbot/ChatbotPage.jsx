import { useState } from "react";
import ChatbotPageThread from "./ChatbotPage.Thread";
import ChatbotPageSetting from "./ChatbotPage.Setting";
import { addNewChatToChatbot, fetchChatbotThread } from "../../services/teknoplat_server";
import { Box } from "@mui/material";
import TabContainer from "../../components/tabcontainer/TabContainer";

export async function loader({ request, params }) {
    const account = localStorage.getItem("account");
    
    try {
        const chatbotResponse = await fetchChatbotThread(account);
        return { chatbot: chatbotResponse.data[0] };
    } catch (error) {
        return error.response.data;
    }
}

export async function action({ request, params }) {
    const formData = await request.formData();
    const chat = formData.get("chat");
    const chatbot = formData.get("chatbot");

    try {
        const chatResponse = await addNewChatToChatbot(chatbot, { content: chat });
        return chatResponse.data;
    } catch(error) {
        return error.response.data;
    }
}

export const ChatbotPage = () => {
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

