import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Tiny spinner that adapts to parent size if needed
const TinyLoader = styled.div`
  width: ${(props) => props.size || "14px"};
  height: ${(props) => props.size || "14px"};

  /* For centering */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);


  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  animation: ${spin} 0.5s linear infinite;
  display: inline-block;
`;

export default function SmallLoader({ size }) {

  return <TinyLoader size={size} />;

}
