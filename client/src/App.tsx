import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [progress, setProgress] = useState<number | null>(null)
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
            //now set the query data with react query or use a state or whatever
            setUsers(endData)
            return;
          }
          const enc = new TextDecoder()
          //data is either a progress percentage or the final data
          const data = JSON.parse(enc.decode(value))
          if (typeof data === 'number')
            setProgress(data)
          endData = data
          // Continue reading
          read();
        });
      }
      read();
    })
  }, [])

  return (
    <div className='home-page'>
      <h1>Progress is {progress}</h1>
      {
        users.length && users.map((us: { username: string }, index) => {
          const username = us.username
          return (
            <div key={index}>{username}</div>
          )
        })
      }
    </div>
  )
}

export default App
