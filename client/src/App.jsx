import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [data, setData] = useState([]);
  const [roomName,setRoomName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  const joinRoomHandler = (e) =>{
    e.preventDefault();
    socket.emit("join-room",roomName);

  }
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      setSocketId(socket.id);
    });

    socket.on("welcome", (s) => {
      // welcome come from server
      console.log(s);
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      setData((msg) => [...msg, data]);
    });
    return () => {
      socket.disconnect();
    };
  }, [setSocketId, setData]);
  console.log(data);

  return (
    <div>
      <Container maxWidth="sm">
        <Typography variant="h3" component="div" gutterBottom>
          Welcome to Dev
        </Typography>

        <Typography variant="h6" component="div" gutterBottom>
          {socketId}
        </Typography>

        <form onSubmit={joinRoomHandler}>
          <h5>Join Room</h5>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            id="outlined-basic"
            label="RoomJoin"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
          
        </form>
        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="outlined-basic"
            label="Message"
            variant="outlined"
          />
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            id="outlined-basic"
            label="Room"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
        <div>
          {data.map((data, idx) => {
            return <li key={idx}>{data}</li>;
          })}
        </div>
      </Container>
    </div>
  );
};

export default App;
