import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import './Camera.css';

function Camera() {
    const [videoConstraints, setVideoConstraints] = useState({
        width: 1280,
        height: 720,
        facingMode: "environment",
    });

    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState("Recognising the animal...");
    const [popupImage, setPopupImage] = useState(null);
    const [canClosePopup, setCanClosePopup] = useState(false);

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
            setPopupImage(imageSrc);
            setShowPopup(true);
            setPopupText("Recognising the animal...");
            setCanClosePopup(false);
            const location = await getLocation();
            const { latitude, longitude } = location;

            // Set popup image and show the popup
 

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
                const data = await result.json();
                setPopupText(data.message || "No message received");
                setCanClosePopup(true);
            } else {
                setPopupText(data.message || "An error occurred. Please try again.");
                setCanClosePopup(true);
            }
        } catch (error) {
            console.error("Error sending data:", error);
            setPopupText("An error occurred. Please try again.");
            setCanClosePopup(true);
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
                        id="camera-button-main"
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

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>{popupText}</p>
                        {popupImage && (
                            <img
                                src={popupImage}
                                alt="Captured"
                                style={{ width: "100%", height: "auto", marginTop: "10px" }}
                            />
                        )}
                        {canClosePopup && (
                            <button
                                className="close-button"
                                onClick={() => setShowPopup(false)}
                            >
                                &#10006; {/* Cross icon */}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Camera;