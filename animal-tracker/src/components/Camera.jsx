import Webcam from "react-webcam";
import './Camera.css'

// props for camera
const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment"
};

function Camera() {

    const sendImageToBackend = async (imageSrc) => {
        console.log("success");
        if (!imageSrc) return;
        
    }

    return (
        <>
            <div className="camera-container">
                <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    width={720}
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
                            }}>
                            <i class="bi bi-circle"></i>
                        </button>
                    )}

                </Webcam>

            </div>        
        </>
    );

}

export default Camera;