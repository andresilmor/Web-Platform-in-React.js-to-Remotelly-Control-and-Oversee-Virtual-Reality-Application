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

const VRSession_Loading = props => {


    
    const { user } = useSelector((state) => state)
      
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
 
    const [panoramicID, setPanoramicID] = useState("password");
    const [directedFor, setDirectedFor] = useState( [""]);
    const [institutionID, setInstitutionID] = useState(user.selectedOrganization.uuid);
  
    useEffect(() => {
        if (props.message == null)
          return
     
        if (props.message["state"] == "running") {
            console.log(props.message)
        
            // -------------------------------------------------------------

            if (props.message["execute"] != null) {
        

                //-----------------------------------------------------------------------

                if (props.message["execute"]["return"] != null) {
                    console.log("3")
                    switch (props.message["execute"]["operation"]) {
                        
                        //------------------------------------------------------------------
                        case "downloadHotspot":
                            if (props.message["execute"]["return"]["loaded"] == true) {
                                console.log("here ----")
                                let data = {
                                    "base64": props.message["execute"]["return"]["imageBase64"],
                                    "mapping": props.message["execute"]["return"]["mapping"],
                                    "exerciseEnvUUID": props.message["execute"]["return"]["exerciseEnvUUID"],
                                    "imageHeight": props.message["execute"]["return"]["imageHeight"],
                                    "imageWidth": props.message["execute"]["return"]["imageWidth"]
                                }
                                props.setPanoramicData(data)
                                props.setState("running")
                            }

                            break;
                        //------------------------------------------------------------------

                    }
                }

            }
            
        }
  
        
    }, [props.message]);

    return (
      <Box sx={{ marginInline: "24px" }}>
        <Grid container>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header
                        title="VR Session"
                        subtitle="The session is being loaded and prepared in the VR application."
                    />
        
                </Box>
            </Grid>
            <Grid item xs={12}>
                <h1>Loading...</h1>
            </Grid>
        </Grid>    
      </Box>
    );
  };
  
  export default VRSession_Loading;