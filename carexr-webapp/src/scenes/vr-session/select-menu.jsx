import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useTheme, Grid, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import QRCode from "qrcode";
import useWebSocket from 'react-use-websocket';
import Cookies from 'js-cookie';
import { useAuthUser } from "react-auth-kit";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";


const VRSession_SelectMenu = props => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const [currentLocation, setCurrentLocation] = useState("start")
 
    const goToLocation = async () => { 
        console.log(props.message)

        props.message["execute"] = JSON.stringify({
            entity: props.message["applicationUUID"],
            operation: "loadScene",            
            params: {
                scene: "lobby"
            },
          })

        props.sendMessage(JSON.stringify(props.message))  
        console.log(props.message)
        /*if (currentLocation == "start")
            setCurrentLocation("lobby")
        else
            setCurrentLocation("start")
        */
    }

    return (
      <Box sx={{ marginInline: "24px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header
                title="VR Session"
                subtitle="Select between sessions using 360º Images or 3D Models"
            />
  
            <Box>
            <Button
                onClick={goToLocation}
                sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                }}
            >
                Load {currentLocation == "start" ? 'Lobby' : "Start Scene" }
            </Button>
            </Box>
        </Box>
       
        <Grid item container spacing={2} xs={2}>
       

        </Grid>

        <Grid item xs={10}>
         
        </Grid>
      </Box>
    );
  };
  
  export default VRSession_SelectMenu;