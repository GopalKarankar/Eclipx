import React, { createContext, useReducer, useCallback } from 'react';

export const VideoContext = createContext();

const initialState = {
  videoList: null,
  currentVideo: null,
  loading: false,
  error: false,
};

const videoReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: false };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, currentVideo: action.payload };

    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: true };

    case 'LIKE':
      if (!state.currentVideo.likes.includes(action.payload)) {
        return {
          ...state,
          currentVideo: {
            ...state.currentVideo,
            likes: [...state.currentVideo.likes, action.payload],
            dislikes: state.currentVideo.dislikes.filter(
              (userId) => userId !== action.payload
            ),
          },
        };
      }
      return state;

    case 'DISLIKE':
      if (!state.currentVideo.dislikes.includes(action.payload)) {
        return {
          ...state,
          currentVideo: {
            ...state.currentVideo,
            dislikes: [...state.currentVideo.dislikes, action.payload],
            likes: state.currentVideo.likes.filter(
              (userId) => userId !== action.payload
            ),
          },
        };
      }
      return state;

    default:
      return state;
  }
};

export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  const fetchStart = useCallback(() => {
    dispatch({ type: 'FETCH_START' });
  }, []);

  const fetchSuccess = useCallback((video) => {
    dispatch({ type: 'FETCH_SUCCESS', payload: video });
  }, []);

  const fetchFailure = useCallback(() => {
    dispatch({ type: 'FETCH_FAILURE' });
  }, []);

  const like = useCallback((userId) => {
    dispatch({ type: 'LIKE', payload: userId });
  }, []);

  const dislike = useCallback((userId) => {
    dispatch({ type: 'DISLIKE', payload: userId });
  }, []);

  const value = {
    state,
    fetchStart,
    fetchSuccess,
    fetchFailure,
    like,
    dislike,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};
