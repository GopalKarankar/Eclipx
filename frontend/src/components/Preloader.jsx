// Preloader.jsx
import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100vh;
  
  /* For centering */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d0d0d;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #444;
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const Preloader = () => {
  return (
    <LoaderWrapper>
      <Spinner />
    </LoaderWrapper>
  );
};

export default Preloader;
