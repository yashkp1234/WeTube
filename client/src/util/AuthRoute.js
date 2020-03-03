import React, { useContext } from "react";
import { Route, useHistory } from "react-router-dom";

import { AuthContext } from "../context/auth";

function AuthRoute({ component: Component, ...rest }) {
  const history = useHistory();
  const locs = history.location.pathname;;
  const { user } = useContext(AuthContext);
  const login_register =
    user !== null && (locs.includes("login") || locs.includes("register"));
  const room = !user && locs.includes("room");
  if (login_register || room) {
    history.push("/");
  }


  return (
    <Route
      {...rest}
      render={props =>
          <Component {...props} />
      }
    ></Route>
  );
}

export default AuthRoute;
