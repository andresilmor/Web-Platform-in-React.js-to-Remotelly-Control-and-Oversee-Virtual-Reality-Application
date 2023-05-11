import { Box, IconButton, useTheme } from "@mui/material"
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { InputBase } from "@mui/material";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

import MultipleSelectPlaceholder from "../../components/MultipleSelectPlaceholder"

const list = [{
    value:"Hospital X",
    key:"uuid"
}, {
    value:"Hospital Y",
    key:"uuid"
}];

const TopBar = (auth) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [organizationsList, setOrganizationsList] = useState([{}]);

    useEffect(()=>{
        setOrganizationsList(list)
	}, [])
    
    return (<>
    {auth["isAuthenticated"] &&
    <>
        <Box display="flex" justifyContent="space-between" pb={2}>

        
            <Box 
                display="flex" 
                backgroundColor={colors.primary[400]} 
                borderRadius="3px"
                sx={{ m:"12px 0"}}
            >
                <InputBase
                    sx={{ ml: 2, flex: 1}}
                    placeholder="Search"
                >
                </InputBase>

                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon/>
                </IconButton>

            </Box>

            <Box display="flex" alignItems={"center"}>
                <MultipleSelectPlaceholder placeholder={"Organization"} options={organizationsList} />
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.colorMode === 'dark' ? (
                        <DarkModeOutlinedIcon/>
                    ) : (
                        <LightModeOutlinedIcon/>
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon/>
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon/>
                </IconButton>
                <IconButton>
                    <PersonOutlinedIcon/>
                </IconButton>
            </Box>
        </Box>
    </>}
    </>);
}

export default TopBar