import React, { useContext, useState } from "react";
import { Menu, Segment } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";

import { AuthContext } from "../context/auth";
import CopyToClipboardButton from "../components/CopyToClipboardButton";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  const pathname = history.location.pathname;
  const path = pathname === "/" ? "home" : String(pathname.substr(1));
  const id = path.indexOf("room") > -1 ? path.split("/")[1] : false;
  const [activeItem, setActiveItem] = useState(path);

  const handleLogout = () => {
    setActiveItem("home");
    logout();
  };

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };
  let menuBar = "";

  if (user) {
    menuBar = (
      <Segment inverted attached className="menuBar">
        <Menu
          secondary
          inverted
          pointing
          size="massive"
          className="menuBar"
          position="right"
        >
          <Menu.Item
            name={user.username}
            active
            as={Link}
            to="/"
            icon="user circle"
          />
          <Menu.Menu position="right">
            {id ? (
              <Menu.Item>
                <CopyToClipboardButton id={id}></CopyToClipboardButton>
              </Menu.Item>
            ) : (
              <div></div>
            )}
            <Menu.Item name="logout" onClick={handleLogout} icon="x" />
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  } else {
    menuBar = (
      <Segment inverted attached className="menuBar">
        <Menu secondary inverted pointing size="massive" className="menuBar">
          <Menu.Item
            icon="home"
            name="home"
            active={activeItem === "home"}
            onClick={handleItemClick}
            as={Link}
            to="/"
          />
          <Menu.Menu position="right">
            <Menu.Item
              icon="arrow alternate circle right"
              name="login"
              active={activeItem === "login"}
              onClick={handleItemClick}
              as={Link}
              to="/login"
            />
            <Menu.Item
              icon="clipboard list"
              name="register"
              active={activeItem === "register"}
              onClick={handleItemClick}
              as={Link}
              to="/register"
            />
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  }

  return menuBar;
}

export default MenuBar;
