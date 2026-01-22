import React from "react";

function UserName({ content }) {
  return (
    <div
      style={{
        ...content,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <h2 style={{ fontSize: "24px", textAlign: "center", color: content.textColor }}>{content.name}</h2>
    </div>
  );
}

export default UserName;