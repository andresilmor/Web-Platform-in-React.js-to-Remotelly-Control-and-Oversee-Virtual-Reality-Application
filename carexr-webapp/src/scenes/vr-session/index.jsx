import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useTheme, Grid, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import QRCode from "qrcode";
import useWebSocket from 'react-use-websocket';
import Cookies from 'js-cookie';
import { useAuthUser } from "react-auth-kit";
import VRSession_StartScreen from "./start-screen";


const VRSession = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const [wsRoute, setWsRoute] = useState(null);
    const [wsChannel, setWsChannel] = useState("");
    
    const [sessionId, setSessionId] = useState("");

    const auth = useAuthUser();
    
  
    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
      } = useWebSocket(wsRoute, {
        onOpen: () => {},
        onMessage: (event) => {
          let data = JSON.parse(event.data)
  
          console.log(data)
    
        },
        onClose: () => {
          setWsRoute(null)
        
        },
        share: true,
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => false,
        //reconnectAttempts: 10,
        //reconnectInterval: 3000,
      });


 
    return (
      <VRSession_StartScreen  wsRoute={wsRoute} setWsRoute={setWsRoute} wsChannel={wsChannel} setWsChannel={setWsChannel} sessionId={sessionId} setSessionId={setSessionId} sendMessage={sendMessage}></VRSession_StartScreen>
    );
  };
  
  export default VRSession;