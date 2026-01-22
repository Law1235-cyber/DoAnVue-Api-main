import React from "react";

function SocialLinks({ content }) {
  return (
    <div
      style={{
        ...content,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: "8px",
        padding: "16px",
      }}
    >
      <a href={content.facebookUrl} style={{ fontSize: "12px", color: "blue" }}>Facebook</a>
      <a href={content.twitterUrl} style={{ fontSize: "12px", color: "blue" }}>Twitter</a>
      <a href={content.instagramUrl} style={{ fontSize: "12px", color: "blue" }}>Instagram</a>
    </div>
  );
}

export default SocialLinks;