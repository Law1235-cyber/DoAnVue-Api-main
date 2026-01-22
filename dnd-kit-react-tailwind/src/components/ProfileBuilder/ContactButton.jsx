import React from "react";

function ContactButton({ content }) {
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
      <button
        style={{
          backgroundColor: content.buttonColor || "#007bff",
          color: content.buttonTextColor || "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {content.buttonText}
      </button>
    </div>
  );
}

export default ContactButton;
