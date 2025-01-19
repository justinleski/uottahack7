import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import './Camera.css';

function Camera() {
    const [videoConstraints, setVideoConstraints] = useState({
        width: 1280,
        height: 720,
        facingMode: "environment",
    });

    const updateVideoConstraints = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const newConstraints = {
            width: viewportWidth,
            height: viewportHeight,
            facingMode: "environment",
        };

        setVideoConstraints(newConstraints);
    };

    useEffect(() => {
        updateVideoConstraints();

        window.addEventListener("resize", updateVideoConstraints);
        return () => window.removeEventListener("resize", updateVideoConstraints);
    }, []);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by your browser."));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => reject(error)
                );
            }
        });
    };

    const sendImageToBackend = async (imageSrc) => {
        try {
            const location = await getLocation();
            const { latitude, longitude } = location;

            const response = await fetch(imageSrc);
            const blob = await response.blob(); // Convert base64 imageSrc to a Blob

            const formData = new FormData();
            formData.append("image", blob, "photo.jpg"); // Set filename as "photo.jpg"
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);

            const result = await fetch("/user/post", {
                method: "POST",
                body: formData,
            });

            if (result.ok) {
                console.log("Image and location sent successfully!");
            } else {
                console.error("Failed to send data to the backend.");
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    return (
        <div className="camera-container">
            <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
            >
                {({ getScreenshot }) => (
                    <button
                        className="camera-button"
                        onClick={() => {
                            const imageSrc = getScreenshot();
                            if (imageSrc) {
                                sendImageToBackend(imageSrc);
                            }
                        }}
                    >
                        <i className="bi bi-circle"></i>
                    </button>
                )}
            </Webcam>
        </div>
    );
}

export default Camera;