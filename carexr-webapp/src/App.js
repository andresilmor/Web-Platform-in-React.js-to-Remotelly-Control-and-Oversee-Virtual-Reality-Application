import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import TopBar from "./scenes/global/TopBar";
import SideBar from "./scenes/global/SideBar";

import Dashboard from "./scenes/dashboard";
import Login from "./scenes/login";

import QRCodeAuth from "./scenes/qrcode-auth";

import { RequireAuth, useIsAuthenticated } from "react-auth-kit";
import VRSession from "./scenes/vr-session";


function App() {
  const [theme, colorMode] = useMode(); 
  const isAuthenticated = useIsAuthenticated()
  //style={{marginInline: "40px", marginTop: "20px", marginBottom: "20px"}}
  return (<>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
            <div className="app">
              {isAuthenticated() &&
                <SideBar />

              }

              <main className="content" >
                
                {isAuthenticated() &&
                  <TopBar isAuthenticated={isAuthenticated()} />

                }
                
                <Routes>
                  
                  {isAuthenticated() && <>
                    <Route path="/" element={
                      <RequireAuth loginPath="/login">
                        <Dashboard /> 
                      </RequireAuth>
                    } />

                    <Route path="/qrcode-login" element={
                      <RequireAuth loginPath="/login">
                        <QRCodeAuth /> 
                      </RequireAuth>
                    } />
                    
                    <Route path="/vr-session" element={
                      <RequireAuth loginPath="/vr/session">
                        <VRSession /> 
                      </RequireAuth>
                    } />


                    <Route path="*" element={<Dashboard />} />
                    
                  </>}

                  {!isAuthenticated() && <>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Login />} />
                    
                  </>}

                  
                  
                </Routes>
              </main>
              
            </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>

    </>);
}

export default App;
