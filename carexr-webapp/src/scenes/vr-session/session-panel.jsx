import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useTheme, Grid, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import QRCode from "qrcode";
import useWebSocket from 'react-use-websocket';
import Cookies from 'js-cookie';
import { useAuthUser } from "react-auth-kit";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { GetPanoramicSessions } from "../../hooks/graphql/query/GetPanoramicSessions";

import {v4 as uuidv4} from 'uuid';

import { DataGrid,GridToolbar, GridColDef, GridApi, GridCellValue } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";


import { useSelector } from "react-redux";

const VRSession_Panel = props => {
    const { user } = useSelector((state) => state)
      
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [wsRoute, setWsRoute] = useState(null);
    const [wsChannel, setWsChannel] = useState("");
    const [onMessageLogic, setOnMessageLogin] = useState(null);
    const pingTime = 25;

    const [countdown, setCountdown] = useState(pingTime);

    const decreaseCountdown = () => {
      setCountdown((prev) => prev - 1)
    };

    const [startCountdown, setStartCountdown] = useState(false);
    let intervalRef = useRef();
    let timingRef = useRef();

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

    
    const [timing, setTiming] = useState(0);
    const [startTiming, setStartTiming] = useState(false);

    const increaseTiming = () => {
        if (startTiming)
            setTiming((prev) => prev +1)
    };

    useEffect(() => {
        if (!startTiming)
          return;
    
        timingRef.current = setInterval(increaseTiming, 1000);
    
    
        return () => clearInterval(timingRef.current);
      }, [startTiming]);
   

    const [message, setMessage] = useState(null)

    const [panoramicID, setPanoramicID] = useState("password");
    const [directedFor, setDirectedFor] = useState( [""]);
    const [institutionID, setInstitutionID] = useState(user.selectedOrganization.uuid);
  
    const [exerciseState, setExerciseState] = useState("unstarted")

    const [exerciseType, setExerciseType] = useState(0);
    const [exerciseLabel, setExerciseLabel] = useState("");

    const [exerciseHistoric, setExerciseHistoric] = useState([]);
    const [selectedBox, setSelectedBox] = useState("");

    const [streamEventSource, setStreamEventSource] = useState(null)
    const [streamChannel, setStreamChannel] = useState(null);
    const [streamReceiverUUID, setStreamReceiverUUID] = useState(null);

    const [targetAlias, setTargetAlias] = useState("")

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
      } = useWebSocket(wsRoute, {
        onOpen: () => {
          console.log(true)
        },
        onMessage: (event) => {
          let data = JSON.parse(event.data)
          console.log(data)
          setMessage(data)
    
        },
        onClose: () => {
          streamEventSource.close()
          setStreamEventSource(null)
          setMessage(null)
          setWsRoute(null)
        
        },
        share: true,
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
        //reconnectAttempts: 10,
        //reconnectInterval: 3000,
      });
    

    const startExercise =  () => { 

        let streamChannel = uuidv4()
        let receiverUUID = uuidv4()


        setStreamEventSource(new EventSource('http://34.244.43.25/sse/vr/panoramic/session/stream/receiver/' + receiverUUID + "/" + streamChannel))
  
        setStreamReceiverUUID(receiverUUID)
        setStreamChannel(streamChannel)

        setStartTiming(true)

        /*
        setWsRoute(null)
        setWsRoute("ws://34.244.43.25/ws/vr/heal/session/panoramic/stream")
        
        sendMessage(JSON.stringify({
            state: "initialize",        
        }))*/  
        
    }

    const runBasicOperation =  (operation) => { 
        props.message["execute"] = {
            requester: props.message["managerUUID"],
            responder: props.message["applicationUUID"],
            operation: operation,            
            params: null,
        }

        console.log(operation)
        props.sendMessage(JSON.stringify(props.message))  

    }

    useEffect(() => {
        if (props.message == null)
          return
     
        if (props.message["state"] == "running") {
            if (props.message["execute"] != null) {
                if (props.message["execute"]["return"] != null) {
                    console.log("3")
                    switch (props.message["execute"]["operation"]) {
                        
                        //------------------------------------------------------------------
                        case "pauseExercise":
                            if (props.message["execute"]["return"]["isPaused"] == true) {
                                setExerciseState("paused")
                                setStartTiming(false)
                                console.log("Pausing Exercise")

                            }

                            break;
                        //------------------------------------------------------------------
                        case "continueExercise":
                            if (props.message["execute"]["return"]["continued"] == true) {
                                setExerciseState("running")
                                setStartTiming(true)
                                
                            }

                            break;
                        //------------------------------------------------------------------
                        case "restartExercise":
                            if (props.message["execute"]["return"]["hasRestarted"] == true) {
                                setTiming(0)
                                setSelectedBox("")
                                setTargetAlias("")
                                
                            }

                            break;
                        //------------------------------------------------------------------
                        case "stopExercise":
                            if (props.message["execute"]["return"]["hasStopped"] == true) {
                                setExerciseState("stopped")
                                setStartTiming(false)
                                
                            }

                            break;
                    }

                }

            }
            
        }
  
        
    }, [props.message]);


    useEffect(() => {
        if (streamEventSource == null)
            return

        streamEventSource.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            
            if (parsedData["state"] == "connected") {
            } else if (parsedData["state"] == "streaming") {
                console.log("HERE I AM BITCH")
                console.log(String(parsedData["focusTarget"]))
                console.log(selectedBox)
                console.log(selectedBox === parsedData["focusTarget"] )
                console.log(parsedData["focusState"])
                console.log(parsedData["focusState"] == false)
                if (parsedData["focusState"] == false) {
                    console.log("BEING CALLED")
                    setSelectedBox("")
                    setTargetAlias("")
                    console.log(selectedBox)
                    console.log("-----------------------")
                    return

                } 

                setTargetAlias(parsedData["focusAlias"])
                setSelectedBox(parsedData["focusTarget"])

                console.log(parsedData)

            }

        };

  
    }, [streamEventSource]);

    useEffect(() => {
        console.log("------------------------------------------")
        console.log(selectedBox)
        console.log("------------------------------------------")

    }, [selectedBox])

    useEffect(() => {
        if (streamChannel == null) {
            

        } else {
            startRecord()

        }

    }, [streamChannel])



    const getExerciseTypeExternalValue = (type) => {
        switch (type) {
            case 1: 
                return "Point of Interest"
            case 2: 
                return "Recognition"
            case 3: 
                return "Learning (Eye)"
            case 4: 
                return "Learning (Controller)"

        }

    }

    const startRecord = () => { 
     
        if (exerciseType != 0 && exerciseLabel.length > 0) {
            var historic = [...exerciseHistoric]
            console.log(exerciseHistoric)
            historic.push({
                "Label": exerciseLabel,
                "Type":  getExerciseTypeExternalValue(exerciseType),
                "State": "Running"

            })
            setExerciseHistoric(historic)
            console.log(exerciseHistoric)

            setExerciseState("running")

            props.message["execute"] = {
                requester: props.message["managerUUID"],
                responder: props.message["applicationUUID"],
                operation: "startExercise",            
                params: {
                    label: exerciseLabel,
                    type: exerciseType,
                    receiverUUID: streamReceiverUUID, 
                    streamChannel: streamChannel
                },
            }
            console.log(props.message)
            props.sendMessage(JSON.stringify(props.message))  

            //props.setToPing(true)

        }
    }  

    const secondsToHms = (d) => {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? "h  " : "h  ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? "m  " : "m  ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s ") : "";
        return hDisplay + mDisplay + sDisplay; 
    }
    
    //const boundingBoxData = [
    //    { id: 1, x: /* Bounding box 1 x coordinate */, y: /* Bounding box 1 y coordinate */, width: /* Bounding box 1 width */, height: /* Bounding box 1 height */ },
    //    { id: 2, x: /* Bounding box 2 x coordinate */, y: /* Bounding box 2 y coordinate */, width: /* Bounding box 2 width */, height: /* Bounding box 2 height */ },
    //    // Add more bounding boxes as needed
    //];

    const imageRatio = props.panoramicData["imageWidth"] / props.panoramicData["imageHeight"];
    
    return (
      <Box sx={{ marginInline: "24px" }}>
        <Grid container>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header
                        title="VR Session"
                        subtitle="Remote Control Panel."
                    />
        
                </Box>
            </Grid>
            <Grid  container item xs={12}>
                <Grid item xs={9}>
                    <Box display="flex">
                        <FormControl variant="filled" sx={{ m: 0, minWidth: 120, width: "50%" }}>
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-normal"
                                multiline
                                
                                variant="filled"

                                disabled={exerciseState == "Running"}
                                
                                onChange={(e) => {
                                    setExerciseLabel(e.target.value)
                                    
                                }}

                                placeholder="Question / Label"
                            />
                        </FormControl>
                        <FormControl variant="filled" sx={{ marginLeft: 4, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                sx={{
                                    paddingBottom:0.13
                                }}
                                disabled={exerciseState == "Running"}
                                
                                //value={age}
                                onChange={(e) => {
                                    setExerciseType(e.target.value)
                                    
                                }}
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={1}>Point of Interest</MenuItem>
                                <MenuItem value={2}>Recognition</MenuItem>
                                <MenuItem value={3}>Learning (Eye)</MenuItem>
                                <MenuItem value={4}>Learning (Controller)</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl  sx={{ marginLeft: 4, flexDirection: "row"}} >

                            {exerciseState == "unstarted" ?
                                <>
                                    <Button
                                        type="submit"
                                        color="secondary"
                                        variant="contained"
                                        style={{
                                            marginTop: "2px",
                                            height: "100%"
                                        }}
                                        onClick={startExercise}
                                    >
                                        Start
                                    </Button>
                                </>
                            : exerciseState == "running" || exerciseState == "paused" ?
                                <>
                                    <Button
                                        type="submit"
                                        color="secondary"
                                        variant="contained"
                                        style={{
                                            marginTop: "2px",
                                            height: "100%",
                                            marginRight: "12px"
                                        }}
                                        onClick={(e) => {runBasicOperation("stopExercise")}}
                                    >
                                        Stop
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        style={{
                                            marginTop: "2px",
                                            height: "100%",
                                            marginRight: "12px"
                                        }}
                                        onClick={(e) => {runBasicOperation(exerciseState === "paused" ? "continueExercise" : "pauseExercise")}}
                                    >
                                        {exerciseState === "paused" ? "Continue" : "Pause"}
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        style={{
                                            marginTop: "2px",
                                            height: "100%"
                                        }}
                                        onClick={(e) => {runBasicOperation("restartExercise")}}
                                    >
                                        Restart
                                    </Button>
                                </>
                            :
                                <>
                                    <Button
                                        type="submit"
                                        color="secondary"
                                        variant="contained"
                                        style={{
                                            marginTop: "2px",
                                            height: "100%",
                                            marginRight: "12px"
                                        }}
                                        onClick={(e) => {runBasicOperation("saveExercise")}}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        style={{
                                            marginTop: "2px",
                                            height: "100%"
                                        }}
                                        onClick={() => {props.setState("connected")}}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            }
                                

                        </FormControl>
                    </Box>
                    
                    <Box marginTop={"32px"}>
                        {exerciseType == 2 && streamChannel != null  &&
                        <>
                            <h2><strong>Looking at:</strong> {targetAlias}</h2> 
                          
                            <h2><strong>Duration:</strong> {secondsToHms(timing)}</h2>
                        </>
                        }
                    </Box>
                    <Box marginTop={"48px"}>
                        <Box position="relative">
                            <img src={`${props.panoramicData["base64"]}`} alt="Panoramic" width={"92%"}/>
                            {props.panoramicData["mapping"].map((box) => (
                            <Box
                                key={box.uuid}
                                //onClick={() => handleBoxClick(box.id)} | ${selectedBox === box.id ? 'red' : 'blue'}
                                sx={{
                                    position: 'absolute',
                                    left: `${((box.boundingBox.x / imageRatio) / 37.4).toFixed(2)}%`,
                                    top: `${((box.boundingBox.y / imageRatio) / 17.3).toFixed(2)}%`,
                                    width: `${((box.boundingBox.width / imageRatio) / 40).toFixed(2)}%`,
                                    height: `${((box.boundingBox.height / imageRatio) / 17.5).toFixed(2)}%`,
                                    border: `2px solid ${selectedBox === box.uuid ? '#1bfc06' : '#FF0000'}`,
                                }}
                            />
                        ))}
                        </Box>
                    </Box>
                </Grid>
             
                <Grid item xs={3}>
                    <h2>Historic</h2>

                    <Box>
                        {exerciseHistoric.map(exercise => (
                            <>
                                <Box>
                                    <p><strong>Label:</strong> {exercise.Label}<br/><strong>Type:</strong> {exercise.Type}<br/><strong>State:</strong> <em>{exercise.State}</em></p>
                                </Box>
                            </>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Grid>    
      </Box>
    );
  };
  
  export default VRSession_Panel;