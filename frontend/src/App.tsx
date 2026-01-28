import { useEffect, useRef, useState } from 'react'
import './App.css'


function App() {

  const [message, setMessage] = useState(["hi there"]);
  const msgRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
          type: "join",
          payload: {
            name: "bludsher",
            roomId: "34343"
          }
      }));
    }
      
    ws.onmessage = (event) => {
      console.log("message received");
      setMessage(prev => [...prev, event.data]);
    }

    return () => {
      ws.close();
    }
  },[]);

  function sendingMessage(e: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if(e.type === "keyup") {
      console.log("in here");
      const keyboardEvent = e as React.KeyboardEvent<HTMLButtonElement>;
      if(keyboardEvent.key !== "Enter") return;
    }
          console.log("out here");
    if(!msgRef.current?.value) return;
    const messageValue = msgRef.current.value;
    setMessage(prev => [...prev, messageValue]);
    console.log("sending message");
    const ws = wsRef.current;
    if(!ws) return;
    ws.send(JSON.stringify({
      type: "chat",
      payload: {
        name: "bludsher",
        msg: messageValue
      }
    }));
    msgRef.current.value = "";
  }

  return (
    <>
      <div className='bg-slate-900  w-screen h-screen'>
        <div className='text-white text-2xl flex justify-center font-bold p-4 font-sans'>Header</div>

        <div className='h-[85vh] flex flex-col gap-4 overflow-y-scroll pt-12 px-12 '>
          {message.map((msg, index) => {
            return <div key={index} className='text-white text-xl'>{msg}</div>
          })}
        </div>
        <div className='flex justify-center items-center pb-8'>
          <input ref={msgRef} className='w-[80vw] h-10 rounded-l-lg pl-4 border border-gray-600' placeholder='Enter your message...' onKeyUp={(e) => sendingMessage(e as any)} />
          <button className='bg-blue-500 text-white h-10 w-20 rounded-r-lg' onClick={(e) => sendingMessage(e)}>Send</button>
        </div>
      </div>

    </>
  )
}

export default App
