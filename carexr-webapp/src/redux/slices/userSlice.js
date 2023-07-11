import { createSlice } from "@reduxjs/toolkit";

const userInitialState =  {
        name: null,
        memberOf: [{
            name: null,
            uuid: null,
            role: null,
        }],
        selectedOrganization: {
            uuid: null,
            name: null,
            role: null
        },
   
}

const userSlice = createSlice({
    name: "user",
    initialState: userInitialState,
    reducers: {
        saveUser: (state, action) => {
            state.name = action.payload["name"];
            state.memberOf = action.payload["memberOf"];
            state.selectedOrganization = action.payload["selectedOrganization"];

        },
        resetUser: (state) => {
            state = null;
        },
        setActiveOrganization: (state, action) => {
            state.activeOrganization = action.payload["activeOrganization"];

        }

    },
});

export const { saveUser, resetUser, setActiveOrganization} = userSlice.actions;
export default userSlice.reducer;
