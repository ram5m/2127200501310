// TrainListPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bearerToken } from "./config";

function TrainListPage() {
  const [trains, setTrains] = useState([]);
  function fetchNewBearerToken() {
    const tokenEndpoint = "http://104.211.219.98:80/train/auth";
    const headers = {
      "Content-Type": "application/json",
    };
    const requestBody = {
      companyName: "Train Central",
      clientID: "5d812b29-b174-4ac6-8abe-22663395c342",
      clientSecret: "coxpAQxuFkaowCKo",
      ownerName: "Praveen",
      ownerEmail: "2020ad0800@svce.ac.in",
      rollNo: "33",
    };

    return fetch(tokenEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        const token = data["access_token"]; // Assuming the response contains a "token" property

        return token;
      })
      .catch((error) => {
        console.log(error);
        // Handle any error that occurred during the request
        throw error;
      });
  }

  useEffect(() => {
    fetch("http://104.211.219.98:80/train/trains", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message && data.message.startsWith("token is expired")) {
          fetchNewBearerToken()
            .then((newToken) => {
              // Retry the fetch request with the new token
              fetch("http://104.211.219.98:80/train/trains", {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              })
                .then((response) => response.json())
                .then((data) => setTrains(data))
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        } else {
          setTrains(data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container">
      <h1>Train List</h1>
      <ul className="train-list">
        {trains.map((train) => (
          <li key={train.trainNumber} className="train-item">
            <Link to={`/train/${train.trainNumber}`} className="train-link">
              {train.trainName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrainListPage;
