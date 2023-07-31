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


import { DataGrid,GridToolbar, GridColDef, GridApi, GridCellValue } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";


import { useSelector } from "react-redux";

const VRSession_Panel = props => {


    
    const { user } = useSelector((state) => state)
      
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
 
    const [panoramicID, setPanoramicID] = useState("password");
    const [directedFor, setDirectedFor] = useState( [""]);
    const [institutionID, setInstitutionID] = useState(user.selectedOrganization.uuid);
  

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
                            //value={age}
                            //onChange={handleChange}
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
                        <FormControl  sx={{ marginLeft: 4 }}>
                            <Button
                                type="submit"
                                color="secondary"
                                variant="contained"
                                style={{
                                    marginTop: "2px",
                                    height: "100%"
                                }}
                                //onClick={connectSession}
                            >
                                Start
                            </Button>
                        </FormControl>
                    </Box>
                </Grid>
             
                <Grid item xs={3}>
                    <h2>Historic</h2>
                </Grid>
            </Grid>
        </Grid>    
      </Box>
    );
  };
  
  export default VRSession_Panel;