import { useEffect, useRef, useState } from 'react'
import {  } from 'ws';
import './App.css'


    const ws = new WebSocket("ws://localhost:8080");

function App() {


  const [message, setMessage] = useState(["hi there"]);
  const msgRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
          type: "join",
          payload: {
            name: "bludsher",
            roomId: "34343"
          }
      }));
      
    ws.onmessage = (event) => {
      console.log("message received");
      setMessage(prev => [...prev, event.data]);
      console.log(message);
    }


    }
  },[]);

  return (
    <>
      <div className='bg-black w-screen h-screen'>

        <div className='h-[90vh] flex flex-col gap-4 overflow-y-scroll pt-12 px-12 '>
          {message.map((msg, index) => {
            return <div key={index} className='text-white text-xl'>{msg}</div>
          })}
        </div>
        <div className='flex justify-center items-center pb-8'>
          <input ref={msgRef} className='w-[80vw] h-10 rounded-l-lg pl-4 border border-gray-600' placeholder='Enter your message...' />
          <button className='bg-blue-500 text-white h-10 w-20 rounded-r-lg' onClick={() => {
            if(!msgRef.current?.value) return;
            setMessage(prev => [...prev, msgRef.current!.value]);
            console.log("sending message");
            // const ws = wsRef.current;
            if(!ws) return;
            console.log("ws is present, before onopen");
            // ws.onopen = () => {
              ws.send(JSON.stringify({
                type: "chat",
                payload: {
                  name: "bludsher",
                  msg: "hello"
                }
              }));
            // }
            
          }}>Send</button>
        </div>
      </div>

    </>
  )
}

export default App
