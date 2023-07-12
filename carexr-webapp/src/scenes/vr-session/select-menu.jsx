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
  
    const [currentLocation, setCurrentLocation] = useState("Start")
    const [locationToggleEnable, setLocationToggleEnable] = useState(true);

    useEffect(() => {
        if (props.message == null)
          return
        console.log("Start Screen: " + props.message)
        if (props.message["state"] == "connected") {
            console.log("1")

            // -------------------------------------------------------------

            if (props.message["execute"] != null) {
                console.log("2")

                //-----------------------------------------------------------------------

                if (props.message["execute"]["return"] != null) {
                    console.log("3")
                    switch (props.message["execute"]["operation"]) {
                        
                        //------------------------------------------------------------------
                        case "loadScene":
                            console.log("4")
                            setLocationToggleEnable(true)
                            setCurrentLocation(props.message["execute"]["return"]["currentLocation"] == "Lobby" ? "Start" : "Lobby")
                            break;
                        //------------------------------------------------------------------

                    }
                }

            }
            
        }
  
        
    }, [props.message]);
 
    const toggleLocation = async () => { 
        console.log(props.message)
        if (!locationToggleEnable)
            return
            
        setCurrentLocation("Loading")
        console.log("Gonna toggle")
        setLocationToggleEnable(false)

        props.message["execute"] = {
            requester: props.message["managerUUID"],
            responder: props.message["applicationUUID"],
            operation: "loadScene",            
            params: {
                scene: currentLocation == "Start" ? "Lobby" : "Start"
            },
          }

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
                onClick={toggleLocation}
                sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                }}
            >
                {currentLocation == "Start" ? 'Go To Lobby' : currentLocation == "Loading" ? "Loading Lobby..." : "End Session" }
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