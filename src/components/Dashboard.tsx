import { Button } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
type dashboardProps = {
  updateClickDrawerCount: () => void;
};
const Dashboard: React.FC<dashboardProps> = ({ updateClickDrawerCount }) => {
  const [initial, setInitial] = useState("");
  useEffect(() => {
    async function fetchInitial() {
      try {
        console.log("why not enter fetchInital");
        const data = await axios.get(
          "http://5da37f13a6593f0014079ea8.mockapi.io/api/v1/initial"
        );
        console.log("after axios", data);
        setInitial(data.data);
      } catch (error) {
        setInitial(error);
      }
    }
    fetchInitial();
  }, []);

  const handleOnClick = () => {
    setInitial("click the button");
    updateClickDrawerCount();
  };
  return (
    <>
      <div data-testid="initial">{initial}</div>
      <Button data-testid="dashboard-click-button" onClick={handleOnClick}>
        Click
      </Button>
    </>
  );
};

export default Dashboard;
