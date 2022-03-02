import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import TextNotifications from "./pages/TextNotifications/TextNotifications";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";


function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {/*{user ? <Home /> : <Login />}*/}
          <Home />
        </Route>
        <Route path="/login">
        {user ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/register">
          {/*{user ? <Redirect to="/" /> : <Register />}*/}
          <Register />
        </Route>
        <Route path="/TextNotifications">
          <TextNotifications />
        </Route>
        <Route path="/About">
          <About />
        </Route>
        <Route path="/Contact">
          <Contact />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
