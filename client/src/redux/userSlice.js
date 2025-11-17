// import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
    loading:false,
    error:false,
    isLoggedIn:false
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {

        loginStart:(state)=>{
            state.loading = true;
        },

        loginSuccess:(state, action)=>{
            state.loading = false;
            state.currentUser = action.payload;
            state.isLoggedIn = true;
        },

        loginFailure:(state)=>{
            state.loading = false;
            state.error= true;
            state.isLoggedIn = false;
        },

        login:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=false;
            state.isLoggedIn = false;
        },

        logout:(state)=>{
            state.currentUser= null;
            state.loading=false;
            state.error=false;
            state.isLoggedIn = false;
            localStorage.clear();
        },


        subscription:(state, action) => {

            // here, "action.payload" refers to "id" 

            const index = state.currentUser.subscribedUsers.findIndex(id => id === action.payload);
                
                // if exists
                if (index !== -1 ) {

                     state.currentUser.subscribedUsers.splice(index,1);

                // Does not exist
                } else {
                    state.currentUser.subscribedUsers.push(action.payload);

                }
        
            },


        saved:(state, action) => {

            // here, "action.payload" refers to "id" 

            const index = state.currentUser.savedVideos.findIndex(id => id === action.payload);
                
                // if exists
                if (index !== -1 ) {

                     state.currentUser.savedVideos.splice(index,1);

                // Does not exist
                } else {
                    state.currentUser.savedVideos.push(action.payload);

                }
        
        }

}
})

export const {login, loginStart, loginFailure, loginSuccess, logout, subscription, saved} = userSlice.actions;
export default userSlice.reducer;






