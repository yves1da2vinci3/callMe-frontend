import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomeScreen } from "./pages/HomeScreen";
import { RoomScreen } from "./pages/RoomScreen";
import { io } from "socket.io-client";
import { apiUrl } from "./config/apiUrl";

const socket = io(`${apiUrl}`);
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen socket={socket} />} />
        <Route path="/room/roomId:" element={<RoomScreen socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
