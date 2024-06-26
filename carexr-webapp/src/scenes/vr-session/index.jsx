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
import VRSession_Loading from "./loading";
import VRSession_Panel from "./session-panel";
import { setSidebarSelection } from "../../redux/slices/layoutSlice";
import { useDispatch } from "react-redux";

const VRSession = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const [wsRoute, setWsRoute] = useState(null);
    const [wsChannel, setWsChannel] = useState("");
    const [onMessageLogic, setOnMessageLogin] = useState(null);
    

    const [sessionId, setSessionId] = useState("");
    const [sessionType, setSessionType] = useState("");

    const [sessionStreamId, setSessionStreamId] = useState("");

    const [state, setState] = useState("disconnected");

    const auth = useAuthUser();

    const dispatch = useDispatch();

    const [toPing, setToPing] = useState(true)
    
    const [message, setMessage] = useState(null)

    const [panoramicData, setPanoramicData] = useState({})
    
    const [exerciseHistoric, setExerciseHistoric] = useState([]);
  
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
          setState("disconnected")
          setStartCountdown(false)
          setWsRoute(null)
        
        },
        share: true,
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
        //reconnectAttempts: 10,
        //reconnectInterval: 3000,
      });


    const pingTime = 15;

    const [countdown, setCountdown] = useState(pingTime);

    const decreaseCountdown = () => {
      setCountdown((prev) => prev - 1)
    };

    const [startCountdown, setStartCountdown] = useState(false);

    let intervalRef = useRef();

    useEffect(() => {
      dispatch(setSidebarSelection({
        selection: "dashboard",
      }));
    })

    useEffect(() => {
      if (!startCountdown)
        return;

      intervalRef.current = setInterval(decreaseCountdown, 1000);


      return () => clearInterval(intervalRef.current);
    }, [startCountdown]);

    useEffect(() =>  {
      
      if (countdown > 0)
        return

      if (toPing) {
        
        console.log("pinging")
        sendMessage(JSON.stringify({
          state: null,            
        }))
      }
      setCountdown(pingTime)

    }, [countdown])

    useEffect(() => {
      console.log("setting null")
      setExerciseHistoric([])
    }, [])
 
    return (
        <>
        {state == "disconnected" ?
            <VRSession_StartScreen message={message} setState={setState} wsRoute={wsRoute} setWsRoute={setWsRoute} wsChannel={wsChannel} setWsChannel={setWsChannel} sessionId={sessionId} setSessionId={setSessionId}  sendMessage={sendMessage} />
        : state == "connected" ?
            <VRSession_SelectMenu  message={message} setState={setState} wsRoute={wsRoute} setWsRoute={setWsRoute} wsChannel={wsChannel} setWsChannel={setWsChannel} sessionId={sessionId} setSessionId={setSessionId}  sendMessage={sendMessage} sessionType={sessionType} setSessionType={setSessionType} />
        : state == "loading" ?
            <VRSession_Loading  message={message} setState={setState} wsRoute={wsRoute} setWsRoute={setWsRoute} wsChannel={wsChannel} setWsChannel={setWsChannel} sessionId={sessionId} setSessionId={setSessionId} setSessionStreamId={setSessionStreamId} sendMessage={sendMessage} sessionType={sessionType} setSessionType={setSessionType} setPanoramicData={setPanoramicData} />
        : state == "running" &&
            <VRSession_Panel  message={message} setState={setState} wsRoute={wsRoute} setWsRoute={setWsRoute} wsChannel={wsChannel} setWsChannel={setWsChannel} sessionId={sessionId} setSessionId={setSessionId} sessionStreamId={sessionStreamId} setSessionStreamId={setSessionStreamId} sendMessage={sendMessage} sessionType={sessionType} setSessionType={setSessionType} panoramicData={panoramicData} setToPing={setToPing} exerciseHistoric={exerciseHistoric} setExerciseHistoric={setExerciseHistoric}/>
        }
        </>
      );
  };
  
  export default VRSession;