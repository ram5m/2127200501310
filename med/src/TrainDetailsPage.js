// TrainDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bearerToken } from "./config";
// Import the CSS file

function TrainDetailsPage() {
  const { id } = useParams();
  const [train, setTrain] = useState(null);
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
        const token = data.access_token; // Assuming the response contains a "token" property
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
              fetch(`http://104.211.219.98:80/train/trains/${id}`, {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              })
                .then((response) => response.json())
                .then((data) => setTrain(data))
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        } else {
          setTrain(data);
        }
      })
      .catch((error) => console.log(error));
  }, [id]);

  if (!train) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="train-details">Train Details</h1>
      <h2 className="train-name">{train.trainName}</h2>
      <p className="train-price">
        Price: Sleeper {train.price.sleeper} Rs ||| AC {train.price.AC} Rs
      </p>
      <p className="train-departure">
        Departure: {train.departureTime.Hours} Hrs {train.departureTime.Minutes}{" "}
        Mns {train.departureTime.Seconds} Sec
      </p>
      <p className="train-delayed">Delayed By {train.delayedBy}</p>
    </div>
  );
}

export default TrainDetailsPage;
