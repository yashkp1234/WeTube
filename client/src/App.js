import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import AuthRoute from "./util/AuthRoute";
import ReactNotification from "react-notifications-component";

import "semantic-ui-css/semantic.min.css";
import "react-notifications-component/dist/theme.css";
import "./App.css";

import { AuthProvider } from "./context/auth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";
import Room from "./pages/Room";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <ReactNotification />
          <MenuBar></MenuBar>
          <Container fluid className="full-container">
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <AuthRoute exact path="/room/:id" component={Room} />
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
