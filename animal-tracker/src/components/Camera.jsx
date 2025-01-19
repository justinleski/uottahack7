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

        // Adjust constraints based on viewport size
        const newConstraints = {
            width: viewportWidth, // Use a max width of 1280
            height: viewportHeight, // Use a max height of 720
            facingMode: "environment",
        };

        setVideoConstraints(newConstraints);
    };

    useEffect(() => {
        updateVideoConstraints(); // Set initial constraints

        // Listen for viewport size changes
        window.addEventListener("resize", updateVideoConstraints);

        // Cleanup event listener
        return () => window.removeEventListener("resize", updateVideoConstraints);
    }, []);

    const sendImageToBackend = async (imageSrc) => {
        console.log("Image captured successfully!");
        if (!imageSrc) return;
        // Add logic for sending imageSrc to backend if needed
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
