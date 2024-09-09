import { useState, useEffect } from "react";
export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className={`connection-status ${!isOnline ? "offline" : ""}`}>
      {!isOnline && (
        <span>Network connection lost. Using cached version of app.</span>
      )}
    </div>
  );
}
