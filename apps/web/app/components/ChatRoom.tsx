import axios from 'axios'
import React from 'react'

async function getChats(roomId:string){
   const response =  await axios.get(`http://localhost:3001/chats/${roomId}`)
   return response.data.messages;
}

const ChatRoom = async ({id}:{
    id: string
}) => {
    const messages = await getChats(id);

  return (
    <div>ChatRoom</div>
  )
}

export default ChatRoom