import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Dialog = ({ display, finalTranscript, sender }) => {
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    if (finalTranscript) {
      // 새로운 finalTranscript 값을 이전 값과 함께 병합하여 새 배열로 업데이트
      setTranscripts((prevTranscripts) => [
        ...prevTranscripts,
        finalTranscript,
      ]);
    }
  }, [finalTranscript]);

  return (
    <DialogContainer style={{ display: display ? "block" : "none" }}>
      <DialogHeader>📁 Dialog 📁</DialogHeader>
      {/* 최신 finalTranscript 값만 표시 */}
      {transcripts.length > 0 && (
        <FinalTranscriptContainer>
          <div>{sender} : </div>
          <p>{transcripts[transcripts.length - 1]}</p>
        </FinalTranscriptContainer>
      )}
      <SummaryButton>Summary</SummaryButton>
    </DialogContainer>
  );
};

const DialogContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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

// const ChatContainer = styled.div`
//   flex: 1;
//   margin-left: 20px; // 비디오와 채팅 컨테이너 사이의 간격 조정
// `;

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

const FinalTranscriptContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  margin: 30px 20px 0px;
  font-size: 15px;
  font-weight: 500;

  > div {
    font-family: "NunitoExtraBold";
    color: gray;
    margin-right: 10px;
  }

  > p {
    //font-size: 15px;
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
