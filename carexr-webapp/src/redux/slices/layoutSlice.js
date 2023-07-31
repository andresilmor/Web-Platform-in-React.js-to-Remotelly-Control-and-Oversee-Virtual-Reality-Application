import { createSlice } from "@reduxjs/toolkit";

const layoutInitialState =  {
        currentSidebarSelection: "dashboard",
       
   
}

const layoutSlice = createSlice({
    name: "layout",
    initialState: layoutInitialState,
    reducers: {
        setSidebarSelection: (state, action) => {
            state.currentSidebarSelection = action.payload["selection"];
           
        },
        resetLayout: (state) => {
            state = layoutInitialState;
        },
      

    },
});

export const { setSidebarSelection, resetLayout} = layoutSlice.actions;
export default layoutSlice.reducer;
