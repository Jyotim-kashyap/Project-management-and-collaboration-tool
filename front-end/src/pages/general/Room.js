import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import SprintPoker from '../../components/sprintPoker/SprintPoker';



function Room({socket}) {


  return (
    <>
      <SprintPoker socket={socket} />
    </>
  );
}

export default Room;
