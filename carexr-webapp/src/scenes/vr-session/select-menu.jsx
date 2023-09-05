import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useTheme, Grid, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import QRCode from "qrcode";
import useWebSocket from 'react-use-websocket';
import Cookies from 'js-cookie';
import { useAuthUser } from "react-auth-kit";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { GetPanoramicSessions } from "../../hooks/graphql/query/GetPanoramicSessions";


import { DataGrid,GridToolbar, GridColDef, GridApi, GridCellValue } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";


import { useSelector } from "react-redux";

const VRSession_SelectMenu = props => {

    const columns = [
        {
          field: "label",
          headerName: "Label / Alias",
          flex: 0.75,
          cellClassName: "name-column--cell",
        },
        {
          field: "supportEyeTracking",
          headerName: "Eye Tracking",
          headerAlign: "left",
          align: "center",
        },
        {
          field: "containsInfo",
          headerName: "Information",
          headerAlign: "left",
          align: "center",
        },
        {
          field: "pointsCount",
          headerName: "Number of Marks",
          flex: 1,
        },
        {
          field: "createdAt",
          headerName: "Created At",
          flex: 1,
        },
        {
          field: "updatedAt",
          headerName: "Updated At",
          flex: 1,
        }, {
            field: "action",
            headerName: "",
            sortable: false,
            renderCell: (params) => {
              const onClick = (e) => {
                e.stopPropagation(); // don't select this row after clicking
        
                const api = params.api;
                //const thisRow = {};

                var uuid;

                api
                  .getAllColumns()
                  .filter((c) => c.field !== "__check__" && !!c)
                  .forEach(
                    (c) => (uuid = params["row"]["uuid"])
                  );
        

                selectHotspot(uuid)

                return;
              };
        
              return <Button onClick={onClick} type="submit"
              color="secondary"
              variant="contained">Select</Button>;
            }
          }
      ];
      
    
    const rows = [
      
        { id: "2", uuid: ["dsda","dsadas"], firstName: "test", age: 42 },
        { id: "3", uuid: "Lannister", firstName: "Jaime", age: 45 },
        { id: "4", uuid: "Stark", firstName: "Arya", age: 16 },
        { id: "5", uuid: "Targaryen", firstName: "Daenerys", age: null },
        { id: "6", uuid: "Melisandre", firstName: null, age: 150 },
        { id: "7", uuid: "Clifford", firstName: "Ferrara", age: 44 },
        { id: "8", uuid: "Frances", firstName: "Rossini", age: 36 },
        { id: "9", uuid: "Roxie", firstName: "Harvey", age: 65 },
        { id: "0", uuid: "Snow", firstName: "Jon", age: 35 }
      
    ]
    
    const { user } = useSelector((state) => state)
      
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [currentLocation, setCurrentLocation] = useState("Start")
    const [locationToggleEnable, setLocationToggleEnable] = useState(true);

    const [panoramicID, setPanoramicID] = useState("password");
    const [directedFor, setDirectedFor] = useState( [""]);
    const [institutionID, setInstitutionID] = useState(user.selectedOrganization.uuid);
      
    var [getHotspots, {loading, error, data, called}] = GetPanoramicSessions(institutionID,panoramicID,directedFor);


    const [dataGridType, setDataGridType] = useState("hotspots")
    const [dataGridContent, setDataGridContent] = useState([])

    useEffect(() => {
        if (called && !loading) {
            var content = [] 


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
            

        }
    },[loading])

    const listHotspots = async () => { 
        setDataGridType("hotspots")
        getHotspots() 
     
    }  

    const listModels = async () => { 
        setDataGridType("models")
        getHotspots() 
     
    }  


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
 

    const selectHotspot = async (uuid) => { 
        console.log(uuid)

        props.message["execute"] = {
            requester: props.message["managerUUID"],
            responder: props.message["applicationUUID"],
            operation: "downloadHotspot",            
            params: {
                hotspotUUID: uuid
            },
          }

          props.sendMessage(JSON.stringify(props.message))   

          props.setState("loading")
      
    }
    
    const toggleLocation = async () => { 
        console.log(props.message)
        if (!locationToggleEnable)
            return
            
        console.log(currentLocation)
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

    useEffect(()=>{
        listHotspots()
    }, [])

    return (
      <Box sx={{ marginInline: "24px" }}>
        <Grid container>
            <Grid item xs={12}>
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
                        {currentLocation == "Start" ? 'Go To Lobby' : currentLocation == "Loading" ? "Loading..." :  "End Session" }
                    </Button>
                    </Box>
                </Box>
            </Grid>
       
            <Grid container>
                <Grid item xs={2}>
                    <Box
                        style={{
                            marginTop: "20px"
                        }}
                        display={"flex"}
                        height={"100%"}
                        flexDirection={"column"}
                    >
                        <Button
                            onClick={listHotspots}
                            type="submit"
                            color="secondary"
                            variant="contained"
                            style={{
                                maxWidth: "fit-content",
                                marginBottom: "12px"
                            }}
                        >
                            List Hotspot 360º Image
                        </Button>
            
                        <Button
                            onClick={listModels}
                            type="submit"
                            color="secondary"
                            variant="contained"
                            style={{
                                maxWidth: "fit-content"
                            }}
                        >
                            List 3D Based Scenaries
                        </Button>     
                    </Box>       

                </Grid>

                <Grid item xs={10}>
                    <Box
                        m="12px 0 0 0"
                        height="70vh"
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
                        {dataGridType == "hotspots" ?
                            <DataGrid
                                rows= { dataGridContent}
                                columns={columns}
                                components={{ Toolbar: GridToolbar }}
                                style={{
                                    width: "100%",
                                    maxWidth: "99.90%"
                                }}
                            />
                         : dataGridType == "models" &&
                            <h1>One day</h1>
                        }
                        
                    </Box>
                </Grid>
            </Grid>    
        </Grid>    
      </Box>
    );
  };
  
  export default VRSession_SelectMenu;