import React from "react";

const DynamicGreeting = ({ userName = "User" }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard_title_area">
      <h2>{getGreeting()}, {userName}!</h2>
      <p className="text">We are glad to see you again!</p>
    </div>
  );
};

export default DynamicGreeting; 