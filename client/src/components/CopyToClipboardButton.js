import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Popup, Menu, Icon } from "semantic-ui-react";

const CopyToClipboardButton = ({ id }) => {
  const [copied, setCopied] = useState(false);
  function handleClose() {
    setTimeout(function() {
      setCopied(false);
    }, 3000);
  }

  return (
    <div>
      <CopyToClipboard
        text={id}
        onCopy={(text, result) => {
          setCopied(true);
          handleClose();
        }}
      >
        <Menu.Item className={"copyClip"} style={{ color: "white" }}>
          <Icon name="clipboard"></Icon>
          Copy Room ID
        </Menu.Item>
      </CopyToClipboard>
      <Popup
        inverted
        content="Room ID Copied!"
        on="click"
        open={copied}
        onOpen={() => {
          setCopied(true);
          handleClose();
        }}
        onClose={() => setCopied(false)}
        trigger={<div></div>}
        offset="0, 5px"
        position="bottom center"
      />
    </div>
  );
};

export default CopyToClipboardButton;
