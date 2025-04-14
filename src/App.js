// App.js
import React, { useState } from "react";
import Login from "./Login";
import MainApp from "./MainApp";

function App() {
  const [user, setUser] = useState(null);

  return user ? (
    <MainApp loggedInUser={user} />
  ) : (
    <Login onLoginSuccess={setUser} />
  );
}

export default App;
