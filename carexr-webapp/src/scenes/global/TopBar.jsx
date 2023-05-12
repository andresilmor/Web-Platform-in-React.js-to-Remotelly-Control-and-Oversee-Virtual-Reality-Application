import { Box, IconButton, useTheme } from "@mui/material"
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { InputBase } from "@mui/material";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import MultipleSelectPlaceholder from "../../components/MultipleSelectPlaceholder";

import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../../redux/slices/userSlice";


const TopBar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [organizationsList, setOrganizationsList] = useState([]);
    const [selectedKey, setSelected] = useState("");
    const signOut = useSignOut();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const memberOf = [];

    
    const list = [];
    list.push({
        value: "dsa",
        key: "dasd"
    })

    useEffect(()=>{
        memberOf.forEach((value) => {
            list.push({
                value: value.name,
                key: value.uuid
            })
        })

        setOrganizationsList(list);
        setSelected(list[0].key);

	})

    const logout = () => {
        signOut();
        dispatch(resetUser());
        navigate("/login");

    }
    
    return (<>
        <Box display="flex" justifyContent="space-between" pb={2} sx={{ marginInline: "24px", marginTop: "16px" }}>

        
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

            <Box display="flex" >
            <Box display="flex" alignItems={"center"}>
                <MultipleSelectPlaceholder placeholder={"Organization"} options={organizationsList} selected={selectedKey} sx={{ marginInline:"4px "}} />
                
                <IconButton sx={{ marginInline:"2px "}}>
                    <NotificationsOutlinedIcon/>
                </IconButton>
                <IconButton sx={{ marginInline:"2px "}}>
                    <PersonOutlinedIcon/>
                </IconButton>
            </Box>

            <Box display="flex" alignItems={"center"} ml="24px">
                <IconButton onClick={colorMode.toggleColorMode} sx={{ marginInline:"2px "}}>
                    {theme.palette.colorMode === 'dark' ? (
                        <DarkModeOutlinedIcon/>
                    ) : (
                        <LightModeOutlinedIcon/>
                    )}
                </IconButton>
                <IconButton sx={{ marginInline:"4px "}}>
                    <SettingsOutlinedIcon/>
                </IconButton>
                <IconButton onClick={logout} sx={{ padding: "8px 6px 8px 10px", marginInline: "2px" }}>
                    <LogoutOutlinedIcon/>
                </IconButton>     
            </Box>
            </Box>
        </Box>
    </>);
}

export default TopBar