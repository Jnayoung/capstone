import React, { useState, useEffect } from "react";
import styled from "styled-components";
import socket from "../../socket";
import PropTypes from "prop-types";

const Dialog = ({ display }) => {
  const [messages, setMessages] = useState([]); //subtitle 받아오는 변수

  useEffect(() => {
    socket.on("FE-stt-dialog", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // 컴포넌트가 언마운트될 때 소켓 연결을 해제
    return () => {
      socket.off("FE-stt-dialog");
    };
  }, []);

  return (
    <DialogContainer style={{ display: display ? "block" : "none" }}>
      <DialogHeader>📁 Dialog 📁</DialogHeader>
      <TranscriptList>
        {messages.map((message, index) => (
          <FinalTranscriptContainer key={index}>
            <div>{message.ssender} :</div>
            <p>{message.smsg}</p>
            <Timestamp>
              {new Date(message.timestamp).toLocaleString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </Timestamp>
          </FinalTranscriptContainer>
        ))}
      </TranscriptList>
      <SummaryButton>Summary</SummaryButton>
    </DialogContainer>
  );
};

Dialog.propTypes = {
  display: PropTypes.bool.isRequired,
};

const Timestamp = styled.div`
  margin-left: auto;
  font-size: 12px;
  color: gray;
`;

const DialogContainer = styled.div`
  display: flex;
  align-items: center;
  //justify-content: center;
  position: relative;
  flex-direction: column;
  width: 25%;
  height: 100%;
  background-color: whitesmoke;
  transition: all 0.5s ease;
  border-radius: 10px;
  overflow: hidden;
  padding: 0 10px;
`;

const DialogHeader = styled.div`
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  font-size: 20px;
  color: black;
  background-color: white;
  font-family: "NunitoExtraBold";
  border: 1.3px solid #999999;
  border-radius: 8px;
`;

const TranscriptList = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 10px;
`;

const FinalTranscriptContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
  font-size: 15px;
  font-weight: 500;

  > div {
    font-family: "NunitoExtraBold";
    color: gray;
    margin-right: 5px;
  }

  > p {
    margin-left: 5px;
    color: black;
  }
`;

const SummaryButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  margin: 20px;
  height: 55px;
  text-align: center;
  border: none;
  background-size: 300% 100%;
  font-family: "NunitoExtraBold";

  border-radius: 50px;
  -o-transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;

  text-align: center;

  :hover {
    background-position: 100% 0;
    -o-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }

  :focus {
    outline: none;
  }

  background-image: linear-gradient(
    to right,
    #29323c,
    #485563,
    #2b5876,
    #4e4376
  );
  box-shadow: 0 2px 10px 0 rgba(45, 54, 65, 0.75);
`;

export default Dialog;
