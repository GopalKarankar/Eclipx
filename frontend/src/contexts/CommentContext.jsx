import React, { createContext, useReducer, useCallback } from 'react';

export const CommentContext = createContext();

const initialState = {
  comments: [],
  loading: false,
  error: false,
};

const commentReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: false };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, comments: action.payload };

    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: true };

    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };

    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment._id !== action.payload
        ),
      };

    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment
        ),
      };

    default:
      return state;
  }
};

export const CommentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, initialState);

  const fetchStart = useCallback(() => {
    dispatch({ type: 'FETCH_START' });
  }, []);

  const fetchSuccess = useCallback((comments) => {
    dispatch({ type: 'FETCH_SUCCESS', payload: comments });
  }, []);

  const fetchFailure = useCallback(() => {
    dispatch({ type: 'FETCH_FAILURE' });
  }, []);

  const addComment = useCallback((comment) => {
    dispatch({ type: 'ADD_COMMENT', payload: comment });
  }, []);

  const deleteComment = useCallback((commentId) => {
    dispatch({ type: 'DELETE_COMMENT', payload: commentId });
  }, []);

  const updateComment = useCallback((comment) => {
    dispatch({ type: 'UPDATE_COMMENT', payload: comment });
  }, []);

  const value = {
    state,
    fetchStart,
    fetchSuccess,
    fetchFailure,
    addComment,
    deleteComment,
    updateComment,
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};
