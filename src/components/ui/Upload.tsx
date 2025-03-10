"use client"

import React from 'react';
import styled from 'styled-components';

const Upload = () => {
  return (
    <StyledWrapper className='mt-6'>
      <div className="input-div">
        <input className="input" name="file" type="file" />
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon"><polyline points="16 16 12 12 8 16" /><line y2={21} x2={12} y1={12} x1={12} /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input-div {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 100, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #000;
    box-shadow: 0px 0px 100px rgba(255, 140, 50, 1)  , inset 0px 0px 10px rgba(255, 140, 50, 1) ,0px 0px 5px rgba(255, 255, 100, 1) ;
    // animation: flicker 2s linear infinite;
  }

  .icon {
    color: rgba(255, 140, 50, 1);
    font-size: 2rem;
    cursor: pointer;
    // animation: iconflicker 2s linear infinite;
  }

  .input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer !important;
  }

  @keyframes flicker {
    0% {
      border: 2px solid rgb(1, 235, 252);
      box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
    }

    5% {
      border: none;
      box-shadow: none;
    }

    10% {
      border: 2px solid rgb(1, 235, 252);
      box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
    }

    25% {
      border: none;
      box-shadow: none;
    }

    30% {
      border: 2px solid rgb(1, 235, 252);
      box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
    }

    100% {
      border: 2px solid rgb(1, 235, 252);
      box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
    }
  }

  @keyframes iconflicker {
    0% {
      opacity: 1;
    }

    5% {
      opacity: 0.2;
    }

    10% {
      opacity: 1;
    }

    25% {
      opacity: 0.2;
    }

    30% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }`;

export default Upload;
