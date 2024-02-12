import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [progress, setProgress] = useState(0)
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('http://localhost:8080/stream', {
    }).then(res => {
      if (!res.body) {
        console.log("no body")
        return
      }
      let endData: any;
      const reader = res.body.getReader();
      // Read chunks of data
      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            console.log('Stream complete');
            console.log('end data is ', endData)
            //now set the query data with react query or use a state or whatever
            setUsers(endData)
            return;
          }
          const enc = new TextDecoder()
          //data is either a progress percentage or the final data
          const data = JSON.parse(enc.decode(value))
          setProgress(data)
          endData = data
          console.log(data)
          // Continue reading
          read();
        });
      }
      read();
    })
  }, [])
  return (
    <div className='home-page'>
      <h1>Progress is {typeof progress === 'number' && progress}</h1>
      {
        users.length && users.map((us: { username: string }, index) => {
          const username = us.username
          return (
            <div key={index}>{username ?? ""}</div>
          )
        })
      }


    </div>
  )
}

export default App
