import React, { useState, useEffect } from "react";
import styled from "styled-components";
import socket from "../../socket";
import PropTypes from "prop-types";

const Dialog = ({ display }) => {
  const [messages, setMessages] = useState([]); //subtitle 받아오는 변수
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 가시성 상태

  useEffect(() => {
    socket.on("FE-stt-dialog", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // 컴포넌트가 언마운트될 때 소켓 연결을 해제
    return () => {
      socket.off("FE-stt-dialog");
    };
  }, []);

  const handleSummaryClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <DialogContainer style={{ display: display ? "flex" : "none" }}>
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
        <SummaryButtonContainer>
          <SummaryButton onClick={handleSummaryClick}>Summary</SummaryButton>
        </SummaryButtonContainer>
      </DialogContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>✖️</CloseButton>
            <ModalHeader>Summary</ModalHeader>
            <ModalBody>여기에 요약 내용을 입력하세요.</ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

Dialog.propTypes = {
  display: PropTypes.bool.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      ssender: PropTypes.string.isRequired,
      smsg: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const Timestamp = styled.div`
  margin-left: auto;
  font-size: 12px;
  color: gray;
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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
  flex: 1;
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

const SummaryButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: auto;
`;

const SummaryButton = styled.button`
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
  transition: all 0.2s ease-in-out;

  :hover {
    background-position: 100% 0;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;

  :hover {
    opacity: 0.6;
  }
`;

const ModalHeader = styled.h2`
  margin: 0;
  margin-bottom: 20px;
  font-family: "NunitoExtraBold";
`;

const ModalBody = styled.div`
  font-size: 16px;
`;

export default Dialog;
