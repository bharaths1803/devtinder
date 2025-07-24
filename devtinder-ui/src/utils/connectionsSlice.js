import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    addConnections: (state, action) => {
      return action.payload;
    },
    removeConnections: (state, action) => {
      return null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addConnections, removeConnections } = connectionsSlice.actions;

export default connectionsSlice.reducer;
