import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useTheme, Grid, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import QRCode from "qrcode";
import useWebSocket from 'react-use-websocket';
import Cookies from 'js-cookie';
import { useAuthUser } from "react-auth-kit";


const VRSession_StartScreen = props => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    useEffect(() => {
      if (props.message == null)
        return
      console.log("Start Screen: " + props.message)
      if (props.message["state"] == "connected") {
        console.log(props.message)
        props.setStatus("connected")
      }

      
    }, [props.message]);

    const onSessionIdChange = (e) => {
        props.setSessionId(e.target.value)
        
    }

    const connectSession = async () => { 
        console.log(props.sessionId)
        props.setWsRoute(null)
        props.setWsRoute("ws://34.244.43.25/ws/vr/heal/session")
        
        props.setWsChannel(props.sessionId)
        props.sendMessage(JSON.stringify({
            state: "connecting",            
            channel: props.sessionId,
          }))  
     
    }
 
    return (
      <Box sx={{ marginInline: "24px" }}>
        <Header
          title="VR Session"
          subtitle="Control remotely Virtual Reality sessions, to minimize pacients discomfort"
        />
  
        <Grid item container spacing={2} xs={2}>
          <Grid item container  xs={12}>
            <Grid item  xs={6}>
                <TextField
                    hiddenLabel
                    id="filled-hidden-label-normal"
                    onChange={onSessionIdChange}
                    variant="filled"
                    size="small"
                    placeholder="Session ID"
                />
            </Grid>

            <Grid item xs={6}>
                <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignContent={"center"}
                >
                    <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        style={{
                            marginTop: "2px",
                        }}
                        onClick={connectSession}
                    >
                        Connect
                    </Button>
                </Box>
            </Grid>

          </Grid>

        </Grid>

        <Grid item xs={10}>
         
        </Grid>
        
      </Box>
    );
  };
  
  export default VRSession_StartScreen;