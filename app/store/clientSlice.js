import { createSlice } from "@reduxjs/toolkit";

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    list: [],
    lastFetched: null,
  },
  reducers: {
    setClients: (state, action) => {
      state.list = action.payload || [];
      state.lastFetched = Date.now();
    },
    clearClients: (state) => {
      state.list = [];
      state.lastFetched = null;
    },
  },
});

export const { setClients, clearClients } = clientsSlice.actions;
export default clientsSlice.reducer;
