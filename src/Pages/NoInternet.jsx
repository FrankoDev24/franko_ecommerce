import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import NoInternetVector from "../assets/NoInternet.png"; // Add a vector image in the assets folder

const NoInternetPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null; // Don't display anything if online
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-green-100 ">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <img
          src={NoInternetVector}
          alt="No Internet"
          className="w-40 mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Connection Lost</h2>
        <p className="text-gray-500 mb-4">
          Oops! It seems you're not connected to the internet. Please check your
          connection.
        </p>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Retry
        </Button>
      </div>
    </div>
  );
};

export default NoInternetPage;
