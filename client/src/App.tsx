import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddUser from "./pages/AddUser";
import UserDetails from "./pages/UserDetails";
import NewReward from "./pages/NewReward";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/addUser" Component={AddUser} />
        <Route path="/:id" Component={UserDetails} />
        <Route path=":id/rewards/new" Component={NewReward}/>
      </Routes>
    </Router>
  );
};

export default App;
