import { useState, useEffect, useRef, useCallback } from "react";
import { Slider, Autocomplete, Box, useTheme, Grid, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import QRCode from "qrcode";
import useWebSocket from 'react-use-websocket';
import Cookies from 'js-cookie';
import { useAuthUser } from "react-auth-kit";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { GetInstitutionPacients } from "../../hooks/graphql/query/GetInstitutionPacients";

import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { styled } from '@mui/material/styles';

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

    const [panoramicID, setPanoramicID] = useState("password");
    const [directedFor, setDirectedFor] = useState( [""]);
    const [institutionID, setInstitutionID] = useState(user.selectedOrganization.uuid);

    var [getPacients, {loading, error, data, called}] = GetInstitutionPacients(institutionID);

    const [exerciseSaved, setExerciseSaved] = useState(false)

    useEffect(() => {
        if (called && !loading) {
            var content = [] 

            console.log(data)

            data["GetInstitutionPacients"].forEach((value, index) => {
                
                content.push({
                    id: index,
                    uuid: value["uuid"],
                    label: value["name"]

                })
            });

            setPatientsList(content)

            /*
            data["GetPanoramicSessions"].forEach((value, index) => {
                
                var createDate = new Date( value["meta"]["createdAt"] * 1000)
                var updateDate = new Date( value["meta"]["updatedAt"] * 1000)
                content.push({
                    id: index,
                    uuid: value["uuid"],
                    label: value["label"],
                    createdAt: createDate.getDate() + " / " + createDate.getMonth() + " / " + createDate.getFullYear(),
                    updatedAt: updateDate.getDate() + " / " + updateDate.getMonth() + " / " + updateDate.getFullYear(),
                    createdBy: value["meta"]["createdBy"]

                })
            });
            setDataGridContent(content)
            */

        }
    },[loading])

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

  
    const [exerciseState, setExerciseState] = useState("unstarted")

    const [exerciseType, setExerciseType] = useState(0);
    const [exerciseLabel, setExerciseLabel] = useState("");

    const [selectedBox, setSelectedBox] = useState("");

    const [streamEventSource, setStreamEventSource] = useState(null)
    const [streamChannel, setStreamChannel] = useState(null);
    const [streamReceiverUUID, setStreamReceiverUUID] = useState(null);

    const [showLog, setShowLog] = useState(false);
    const [exerciseLog, setExerciseLog] = useState({})
    const [exerciseCommentary, setExerciseCommentary] = useState("")
    const [exerciseEvalution, setExerciseEvaluation] = useState(-1)
    const [exercisePacient, setExercisePacient] = useState({})

    const [targetAlias, setTargetAlias] = useState("");

    const [stopState, setStopState] = useState("Stop");

    const [sessionUUID, setSessionUUID] = useState(uuidv4());

    const [patientsList, setPatientsList] = useState([
            { label: 'The Godfather', id: 1 },
            { label: 'Pulp Fiction', id: 2 },
        ])

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

    const startExercise = () => { 

        let streamChannel = uuidv4()
        let receiverUUID = uuidv4()


        setStreamEventSource(new EventSource('https://473b-193-136-194-58.ngrok-free.app/sse/vr/panoramic/session/stream/receiver/' + receiverUUID + "/" + streamChannel))
  
        setStreamReceiverUUID(receiverUUID)
        setStreamChannel(streamChannel)

        setStartTiming(true)
        setShowLog(false)

        /*
        setWsRoute(null)
        setWsRoute("ws://34.244.43.25/ws/vr/heal/session/panoramic/stream")
        
        sendMessage(JSON.stringify({
            state: "initialize",        
        }))*/  
        
    }

    const saveExercise = () => {
        console.log("Save:")

        props.message["state"] = "connected"

        props.message["execute"] = {
            requester: props.message["managerUUID"],
            responder: props.message["applicationUUID"],
            operation: "saveExercise",            
            params: {
                uuid: props.exerciseHistoric[0]["uuid"],
                exerciseDuration: props.exerciseHistoric[0]["duration"],
                pacientUID: exercisePacient["uuid"],
                log: exerciseLog,
                evaluation: exerciseEvalution >= 0 ? exerciseEvalution : null,
                commentary: exerciseCommentary
    
    
            }
        }

        props.sendMessage(JSON.stringify(props.message)) 

        setExerciseSaved(true)


    }

    const runBasicOperation =  (operation) => { 
        if (operation === "stopExercise") {
            getPacients()
            setStartTiming(false)

        }
        
        props.message["execute"] = {
            requester: props.message["managerUUID"],
            responder: props.message["applicationUUID"],
            operation: operation,            
            params: null,
        }

        props.sendMessage(JSON.stringify(props.message))  

    }

    useEffect(() => {
        if (props.message == null)
          return
     
        if (props.message["state"] == "running") {
            if (props.message["execute"] != null) {
                if (props.message["execute"]["return"] != null) {
                    switch (props.message["execute"]["operation"]) {
                        
                        //------------------------------------------------------------------
                        case "pauseExercise":
                            if (props.message["execute"]["return"]["isPaused"] == true) {
                                setExerciseState("paused")
                                setStartTiming(false)

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
                                setExerciseState("checking")
                                setShowLog(true)
                                setExerciseLog(props.message["execute"]["return"]["exerciseLog"])

                                props.exerciseHistoric[0]["log"] = props.message["execute"]["return"]["exerciseLog"]["recognition"]
                                props.exerciseHistoric[0]["uuid"] = uuidv4()
                                props.exerciseHistoric[0]["duration"] = timing
                                props.exerciseHistoric[0]["state"] = "Concluded"
                                
                                console.log(props.exerciseHistoric[0])
                                 
                                console.log(sessionUUID)
                       
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
                if (parsedData["focusState"] == false) {
                    console.log("BEING CALLED")
                    setSelectedBox("")
                    setTargetAlias("")
                    return

                } 

                console.log("Looking at: " + parsedData["focusAlias"])

                setTargetAlias(parsedData["focusAlias"])
                setSelectedBox(parsedData["focusTarget"])


            }

        };

  
    }, [streamEventSource]);

    useEffect(() => {

    }, [selectedBox])

    useEffect(() => {
        if (streamChannel == null) {
            

        } else {
            startStreaming()

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

    const startStreaming = () => { 
     
        if (exerciseType != 0 && exerciseLabel.length > 0) {
            var historic = [...props.exerciseHistoric]
            historic.push({
                "label": exerciseLabel,
                "type":  getExerciseTypeExternalValue(exerciseType),
                "state": "Running"

            })
            props.setExerciseHistoric(historic)

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
    
    const columns = [
        {
            field: "alias",
            headerName: "Label / Alias",
            flex: 0.75,
            cellClassName: "name-column--cell",
        }, {
            field: "focusCount",
            headerName: "Focus Count",
            flex: 0.75,
            cellClassName: "name-column--cell",
        }, {
            field: "focusTime",
            headerName: "Focus Time",
            flex: 0.75,
            cellClassName: "name-column--cell",
            renderCell: (params) => {
                return secondsToHms(params["row"]["focusTime"])
            }
        }
    ]

      const StyledRating = styled(Rating)(({ theme }) => ({
        '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
          color: theme.palette.action.disabled,
        },
      }));
      function IconContainer(props) {
        const { value, ...other } = props;
        return <span {...other}>{customIcons[value].icon}</span>;
      }

      const customIcons = {
        1: {
          icon: <SentimentVeryDissatisfiedIcon color="error" />,
          label: 'Very Dissatisfied',
        },
        2: {
          icon: <SentimentDissatisfiedIcon color="error" />,
          label: 'Dissatisfied',
        },
        3: {
          icon: <SentimentSatisfiedIcon color="warning" />,
          label: 'Neutral',
        },
        4: {
          icon: <SentimentSatisfiedAltIcon color="success" />,
          label: 'Satisfied',
        },
        5: {
          icon: <SentimentVerySatisfiedIcon color="success" />,
          label: 'Very Satisfied',
        },
      };
      
    function valuetext(value) {
        return `${value}°C`;
      }

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

                                disabled={exerciseState != "unstarted"}
                                
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
                                disabled={exerciseState != "unstarted"}
                                
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
                                        onClick={(e) => {runBasicOperation("stopExercise"); setStopState("Stopping"); }}
                                    >
                                        {stopState}
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
                            : !exerciseSaved ?
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
                                        onClick={(e) => {saveExercise()}}
                                    >
                                        Save
                                    </Button>
                                </>

                                : <>
                                </>
                            }
                                
                                <Button
                                        type="submit"
                                        color={exerciseSaved ? "secondary" : "primary" }
                                        variant="contained"
                                        style={{
                                            marginTop: "2px",
                                            
                                            marginLeft: "12px",
                                            height: "100%"
                                        }}
                                        onClick={() => { 
                                            if (exerciseState != "checking") {  
                                                runBasicOperation("stopExercise")
                                            } 
                                            props.setState("connected")
                                        }}
                                    >
                                        {exerciseSaved ? "Return" : "Cancel" }
                                    </Button>

                        </FormControl>
                    </Box>
                    
                    <Box marginTop={"32px"}>
                        {exerciseType == 2 && streamChannel != null && (exerciseState == "running" || exerciseState == "paused" )  &&
                        <>
                            <h2><strong>Looking at:</strong> {targetAlias}</h2> 
                          
                            <h2><strong>Duration:</strong> {secondsToHms(timing)}</h2>
                        </>
                        }
                    </Box>
                    <Box marginTop={"48px"}>
                        <Box position="relative">
                            {showLog == false ? 
                                <>
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
                            </>
                        : 
                            <>
                            <Grid  container item xs={12}>
                                <Grid item xs={6}>
                                    <h1 style={{ marginTop: '-12px' }}>Label: {props.exerciseHistoric[props.exerciseHistoric.length - 1]["label"]}</h1>
                                    <h2>Type: {props.exerciseHistoric[props.exerciseHistoric.length - 1]["type"]}</h2>
                                    <h2>Duration: {secondsToHms(props.exerciseHistoric[props.exerciseHistoric.length - 1]["duration"])}</h2>
                                    
                                    <Box
                                        m="12px 0 0 0"
                                        height="40vh"
                                        sx={{
                                        "& .MuiDataGrid-root": {
                                            border: "none",
                                        },
                                        "& .MuiDataGrid-cell": {
                                            borderBottom: "none",
                                        },
                                        "& .name-column--cell": {
                                            color: colors.greenAccent[300],
                                        },
                                        "& .MuiDataGrid-columnHeaders": {
                                            backgroundColor: colors.blueAccent[700],
                                            borderBottom: "none",
                                        },
                                        "& .MuiDataGrid-virtualScroller": {
                                            backgroundColor: colors.primary[400],
                                        },
                                        "& .MuiDataGrid-footerContainer": {
                                            borderTop: "none",
                                            backgroundColor: colors.blueAccent[700],
                                        },
                                        "& .MuiCheckbox-root": {
                                            color: `${colors.greenAccent[200]} !important`,
                                        },
                                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                            color: `${colors.grey[100]} !important`,
                                            marginBottom: "12px"
                                        },
                                        }}
                                    >
                                        { props.exerciseHistoric != undefined && props.exerciseHistoric.length > 0 && props.exerciseHistoric[0]["log"] != undefined &&
                                            <DataGrid
                                                rows= { props.exerciseHistoric[0]["log"]}
                                                columns={columns}
                                                style={{
                                                    width: "100%",
                                                    maxWidth: "99.90%",
                                                    marginTop: "42px"
                                                }}
                                            />
                                        }
                                        
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box component="form" display={"flex"} justifyContent={"center"} flexDirection={"column"} marginLeft={"32px"} >
                                        <Autocomplete
                                            disablePortal
                                            
                                            id="combo-box-demo"
                                            options={patientsList}
                                            onChange={(e, v) => {
                                                setExercisePacient(v)
                                            }}
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Patient" />}
                                           
                                        />


                                        <div style={{
                                                marginTop: "24px"
                                            }}>Evaluation:&nbsp;
                                                <Slider
                                                    aria-label="Temperature"
                                                    defaultValue={5}
                                                    getAriaValueText={valuetext}
                                                    valueLabelDisplay="auto"
                                                    step={1}
                                                    marks
                                                    min={1}
                                                    max={10}
                                                    style={{
                                                        marginTop: "8px",
                                                        maxWidth: "90%"
                                                    }}
                                                    color="secondary"
                                                    onChange={(e, n) => {
                                                        setExerciseEvaluation(n)
                                                    }}
                                                />
                                           
                                        </div>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Commentary"
                                            onChange={(e) => {
                                                setExerciseCommentary(e.target.value)
                                            }}
                                            style={{
                                                marginTop: "24px",
                                                maxWidth: "90.6%"
                                            }}
                                            multiline
                                            rows={10}
                                            defaultValue=""
                                        />
                                    </Box>
                                </Grid>
                            </Grid>  
                            </>
                        }
                        </Box>
                    </Box>
                </Grid>
             
                <Grid item xs={3}>
                    <h2>Historic</h2>

                    <Box>
                        {props.exerciseHistoric.map(exercise => (
                            <>
                                <Box>
                                    <p><strong>Label:</strong> {exercise.label}<br/><strong>Type:</strong> {exercise.type}<br/><strong>State:</strong> <em>{exercise.state}</em></p>
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