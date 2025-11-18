import React, { createContext, useReducer, useCallback } from 'react';

export const UserContext = createContext();

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
  isLoggedIn: false,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: false };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
        isLoggedIn: true,
        error: false,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: true,
        isLoggedIn: false,
      };

    case 'LOGIN':
      return {
        currentUser: null,
        loading: false,
        error: false,
        isLoggedIn: false,
      };

    case 'LOGOUT':
      localStorage.clear();
      return {
        currentUser: null,
        loading: false,
        error: false,
        isLoggedIn: false,
      };

    case 'SUBSCRIPTION':
      if (!state.currentUser) return state;
      const subIndex = state.currentUser.subscribedUsers.findIndex(
        (id) => id === action.payload
      );
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          subscribedUsers:
            subIndex !== -1
              ? state.currentUser.subscribedUsers.filter(
                  (id) => id !== action.payload
                )
              : [...state.currentUser.subscribedUsers, action.payload],
        },
      };

    case 'SAVED':
      if (!state.currentUser) return state;
      const saveIndex = state.currentUser.savedVideos.findIndex(
        (id) => id === action.payload
      );
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          savedVideos:
            saveIndex !== -1
              ? state.currentUser.savedVideos.filter(
                  (id) => id !== action.payload
                )
              : [...state.currentUser.savedVideos, action.payload],
        },
      };

    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const loginStart = useCallback(() => {
    dispatch({ type: 'LOGIN_START' });
  }, []);

  const loginSuccess = useCallback((user) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  }, []);

  const loginFailure = useCallback(() => {
    dispatch({ type: 'LOGIN_FAILURE' });
  }, []);

  const login = useCallback(() => {
    dispatch({ type: 'LOGIN' });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const subscription = useCallback((userId) => {
    dispatch({ type: 'SUBSCRIPTION', payload: userId });
  }, []);

  const saved = useCallback((videoId) => {
    dispatch({ type: 'SAVED', payload: videoId });
  }, []);

  const value = {
    state,
    loginStart,
    loginSuccess,
    loginFailure,
    login,
    logout,
    subscription,
    saved,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
