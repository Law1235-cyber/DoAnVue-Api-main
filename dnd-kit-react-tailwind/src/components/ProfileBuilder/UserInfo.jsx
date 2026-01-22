import React from "react";

function UserInfo({ content }) {
  return (
    <div
      style={{
        ...content,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "4px",
        padding: "16px",
      }}
    >
      <h3 style={{ fontSize: "16px", textAlign: "center", color: content.textColor }}>{content.location}</h3>
      <p style={{ fontSize: "12px", textAlign: "center", color: "gray" }}>
        {content.bio}
      </p>
    </div>
  );
}

export default UserInfo;