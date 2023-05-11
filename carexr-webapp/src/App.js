import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import TopBar from "./scenes/global/TopBar";
import SideBar from "./scenes/global/SideBar";

import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Invoices from "./scenes/invoices";
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Bar from "./scenes/bar";
import Pie from "./scenes/pie";
import Line from "./scenes/line";
import Geography from "./scenes/geography";

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
              
              <TopBar isAuthenticated={isAuthenticated()} />
              <Routes>
                <Route path="/" element={
                <RequireAuth loginPath="/login">
                  <Dashboard /> 
                </RequireAuth>} />

                <Route path="/team" element={
                <RequireAuth loginPath="/login">
                  <Team /> 
                </RequireAuth>} />

                <Route path="/contacts" element={
                <RequireAuth loginPath="/login">
                  <Contacts /> 
                </RequireAuth>} />

                <Route path="/invoices" element={
                <RequireAuth loginPath="/login">
                  <Invoices /> 
                </RequireAuth>} />

                <Route path="/form" element={
                <RequireAuth loginPath="/login">
                  <Form /> 
                </RequireAuth>} />
                
                <Route path="/calendar" element={
                <RequireAuth loginPath="/login">
                  <Calendar /> 
                </RequireAuth>} />

                <Route path="/faq" element={
                <RequireAuth loginPath="/login">
                  <FAQ /> 
                </RequireAuth>} />

                <Route path="/bar" element={
                <RequireAuth loginPath="/login">
                  <Bar /> 
                </RequireAuth>} />

                <Route path="/pie" element={
                <RequireAuth loginPath="/login">
                  <Pie /> 
                </RequireAuth>} />

                <Route path="/line" element={
                <RequireAuth loginPath="/login">
                  <Line /> 
                </RequireAuth>} />

                <Route path="/geography" element={
                <RequireAuth loginPath="/login">
                  <Geography /> 
                </RequireAuth>} />
                
                <Route path="/login" element={<Login />} />

              </Routes>
            </main>
            
          </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>

    </>);
}

export default App;
