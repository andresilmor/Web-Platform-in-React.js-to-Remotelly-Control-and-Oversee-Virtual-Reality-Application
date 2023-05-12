import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import TopBar from "./scenes/global/TopBar";
import SideBar from "./scenes/global/SideBar";

import Dashboard from "./scenes/dashboard";
import Login from "./scenes/login";
import { RequireAuth, useIsAuthenticated } from "react-auth-kit";


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
                  <Route path="/" element={
                    <RequireAuth loginPath="/login">
                      <Dashboard /> 
                    </RequireAuth>
                  } />

                  {!isAuthenticated() &&
                    <Route path="/login" element={<Login />} />
                  }
                  
                </Routes>
              </main>
              
            </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>

    </>);
}

export default App;
