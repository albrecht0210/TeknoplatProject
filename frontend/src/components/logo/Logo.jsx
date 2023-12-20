import { Toolbar, Typography } from "@mui/material";

const Logo = () => {
    return (
        <Toolbar sx={{ p: "0px 12px !important" }}>
            <img 
                src="/sample/wildcat.png" 
                alt="WildcatLogo" 
                style={{ width: '3rem', marginRight: "8px" }}
            />
            <Typography 
                variant="h6"
                sx={{
                    mr: 2,
                    display: 'flex',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    textDecoration: 'none',
                    color: "#fecc00"
                }}
            >
                TEKNOPLAT
            </Typography>
        </Toolbar>
    );
}

export default Logo;