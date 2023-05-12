import { createSlice } from "@reduxjs/toolkit";

const userInitialState =  {
        name: null,
        memberOf: [{
            name: null,
            uuid: null,
            role: null,
            selected: null
        }],
   
}

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: "",
        memberOf: [{
            name: "",
            uuid: "",
            role: "",
            selected: ""
        }],
   
},
    reducers: {
        saveUser: (state, action) => {
            console.log("yo ", action.payload)
            state.name = action.payload["name"];
            console.log("yo ", state.name)
        },
        resetUser: (state) => {
            state = null;
        },
    },
});

export const { saveUser, resetUser} = userSlice.actions;
export default userSlice.reducer;
