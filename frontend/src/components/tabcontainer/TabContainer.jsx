import { Tab, Tabs } from "@mui/material";

const TabContainer = (props) => {
    const { selected, handleChange, tabOptions } = props;

    return (
        <Tabs value={selected} onChange={handleChange}>
            { tabOptions.map((option) => (
                <Tab 
                    key={option.value} 
                    label={option.name[0].toUpperCase() + option.name.slice(1)}
                    id={option.name + '-tab'} 
                    aria-controls={option.name + "-tabpanel"} 
                />
            )) }
        </Tabs>
    );
}

export default TabContainer;
