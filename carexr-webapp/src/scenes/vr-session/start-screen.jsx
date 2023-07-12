import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useTheme, Grid, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import QRCode from "qrcode";
import useWebSocket from 'react-use-websocket';
import Cookies from 'js-cookie';
import { useAuthUser } from "react-auth-kit";


const VRSession_StartScreen = params => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    

    const onSessionIdChange = (e) => {
        params.setSessionId(e.target.value)
        
    }

    const connectSession = async () => { 
        console.log(params.sessionId)
        params.setWsRoute(null)
        params.setWsRoute("ws://34.244.43.25/ws/vr/heal/session")
        
        params.setWsChannel(params.sessionId)
        params.sendMessage(JSON.stringify({
            state: "connecting",            
            channel: params.sessionId,
          }))  
     
    }
 
    return (
      <Box sx={{ marginInline: "24px" }}>
        <Header
          title="VR Session"
          subtitle="Controle remotely Virtual Reality sessions, to minimize pacients discomfort"
        />
  
        <Grid container spacing={2} xs={2}>
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

          <Grid item xs={10}>
         
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default VRSession_StartScreen;