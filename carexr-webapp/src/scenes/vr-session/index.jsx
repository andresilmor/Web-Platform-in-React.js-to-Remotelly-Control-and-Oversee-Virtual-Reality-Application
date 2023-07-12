import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useTheme, Grid, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import QRCode from "qrcode";
import useWebSocket from 'react-use-websocket';
import Cookies from 'js-cookie';
import { useAuthUser } from "react-auth-kit";
import VRSession_StartScreen from "./start-screen";
import VRSession_SelectMenu from "./select-menu";


const VRSession = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const [wsRoute, setWsRoute] = useState(null);
    const [wsChannel, setWsChannel] = useState("");
    const [onMessageLogic, setOnMessageLogin] = useState(null);
    

    const [sessionId, setSessionId] = useState("");
    const [sessionType, setSessionType] = useState("");

    const [status, setStatus] = useState("disconnected");

    const auth = useAuthUser();
    
    const [message, setMessage] = useState(null)
  
    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
      } = useWebSocket(wsRoute, {
        onOpen: () => {
          setStartCountdown(true)
          console.log(true)
        },
        onMessage: (event) => {
          let data = JSON.parse(event.data)
          console.log(data)
          setMessage(data)
    
        },
        onClose: () => {
          setMessage(null)
          setStatus("disconnected")
          setStartCountdown(false)
          setWsRoute(null)
        
        },
        share: true,
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
        //reconnectAttempts: 10,
        //reconnectInterval: 3000,
      });


    const pingTime = 40;

    const [countdown, setCountdown] = useState(pingTime);

    const decreaseCountdown = () => {
      if (countdown <= 0)
        console.log("yo")
        
      setCountdown((prev) => prev - 1)
    };

    const [startCountdown, setStartCountdown] = useState(false);

    let intervalRef = useRef();

    useEffect(() => {
      if (!startCountdown)
        return;

      intervalRef.current = setInterval(decreaseCountdown, 1000);


      return () => clearInterval(intervalRef.current);
    }, [startCountdown]);

    useEffect(() =>  {
      if (countdown > 0)
        return
      console.log("pinging")
      sendMessage(JSON.stringify({
        state: null,            
      }))
      setCountdown(pingTime)

    }, [countdown])
 
    return (
        <>
        {status == "disconnected" ?
            <VRSession_StartScreen message={message} setStatus={setStatus} wsRoute={wsRoute} setWsRoute={setWsRoute} wsChannel={wsChannel} setWsChannel={setWsChannel} sessionId={sessionId} setSessionId={setSessionId} sendMessage={sendMessage} />
        : status == "connected" &&
            <VRSession_SelectMenu  message={message} setStatus={setStatus} wsRoute={wsRoute} setWsRoute={setWsRoute} wsChannel={wsChannel} setWsChannel={setWsChannel} sessionId={sessionId} setSessionId={setSessionId} sendMessage={sendMessage} sessionType={sessionType} setSessionType={setSessionType} />
        }
        </>
      );
  };
  
  export default VRSession;