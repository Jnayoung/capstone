import React, { useEffect } from 'react';
import socket from '../../socket';

const Result = (props) => {
    const roomId = props.match.params.roomId;

    useEffect(() => {

        socket.on('FE-click-pop', ({ error }) => {
            if (!error) {

                props.history.push(`/result/${roomId}`);
            } else {
                console.log("result error");
            }
        });
    }, [props.history]);
    return (
        <div>
            <h1>Room Number : {roomId}</h1>
        </div>
    );
}

export default Result;