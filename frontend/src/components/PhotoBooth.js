import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PhotoBooth = ({ setCapturedImages }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setImages] = useState([]);
  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    startCamera();
  
    const handleVisibilityChange = () => {
        if (!document.hidden) {
            startCamera();
        }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Start Camera
  const startCamera = async () => {
    try {
        if (videoRef.current && videoRef.current.srcObject) {
            return; 
        }
        const constraints = {
          video: {
              facingMode: "user",
              width: { ideal: 1920 }, 
              height: { ideal: 1080 },
              frameRate: { ideal: 30 } 
          }
      };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.error("Error playing video:", err));

            videoRef.current.style.transform = "scaleX(-1)";
            videoRef.current.style.objectFit = "cover"; 
        }
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
  };

  // Countdown to take 4 pictures automatically
  const startCountdown = () => {
    if (capturing) return;
    setCapturing(true);
  
    let photosTaken = 0;
    const newCapturedImages = [];
  
    const captureSequence = async () => {
        if (photosTaken >= 4) {
            setCountdown(null);
            setCapturing(false);

            try {
                setCapturedImages([...newCapturedImages]);
                setImages([...newCapturedImages]);

                setTimeout(() => {
                    navigate("/preview");
                }, 200);
            } catch (error) {
                console.error("Error navigating to preview:", error);
            }
            return;
        }

        let timeLeft = 3;
        setCountdown(timeLeft);

        const timer = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);

            if (timeLeft === 0) {
                clearInterval(timer);
                const imageUrl = capturePhoto();
                if (imageUrl) {
                    newCapturedImages.push(imageUrl);
                    setImages((prevImages) => [...prevImages, imageUrl]);
                }
                photosTaken += 1;
                setTimeout(captureSequence, 1000);
            }
        }, 1000);
    };

    captureSequence();
  };

  // Capture Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
        const context = canvas.getContext("2d");

        const targetWidth = 1280;
        const targetHeight = 720;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const videoRatio = video.videoWidth / video.videoHeight;
        const targetRatio = targetWidth / targetHeight;
        
        let drawWidth = video.videoWidth;
        let drawHeight = video.videoHeight;
        let startX = 0;
        let startY = 0;

        if (videoRatio > targetRatio) {
            drawWidth = drawHeight * targetRatio;
            startX = (video.videoWidth - drawWidth) / 2;
        } else {
            drawHeight = drawWidth / targetRatio;
            startY = (video.videoHeight - drawHeight) / 2;
        }

        // Flip canvas for mirroring
        context.save();
        context.filter = filter !== 'none' ? filter : 'none';
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(
            video,
            startX, startY, drawWidth, drawHeight,  
            0, 0, targetWidth, targetHeight        
        );
        context.restore();

        return canvas.toDataURL("image/png");
    }
};

  return (
    <div className="photo-booth">
            {countdown !== null && <h2 className="countdown animate">{countdown}</h2>}

    <div className="photo-container">
      <div className="camera-container">
        <video ref={videoRef} autoPlay className="video-feed" style={{ filter }} />
        <canvas ref={canvasRef} className="hidden" />
      </div>

        <div className="preview-side">
          {capturedImages.map((image, index) => (
            <img key={index} src={image} alt={`Captured ${index + 1}`} className="side-preview" />
          ))}
        </div>
      </div>
      
      <div className="controls">
        <button onClick={startCountdown} disabled={capturing}>
          {capturing ? "Capturing..." : "Start Capture :)"}
        </button>
      </div>

      <p className="filter-prompt">Choose a filter before starting capture!</p>

      <div className="filters">
        <button onClick={() => setFilter("none")} disabled={capturing}>No Filter</button>
        <button onClick={() => setFilter("grayscale(100%)")} disabled={capturing}>Grayscale</button>
        <button onClick={() => setFilter("sepia(100%)")} disabled={capturing}>Sepia</button>
        <button onClick={() => setFilter("grayscale(100%) contrast(120%) brightness(110%) sepia(30%) hue-rotate(10deg) blur(0.4px)")} disabled={capturing}>Vintage</button>
        <button onClick={() => setFilter("brightness(130%) contrast(105%) saturate(80%) blur(0.3px)")} disabled={capturing}>Soft</button>
      </div>


    </div>
  );
};

export default PhotoBooth;
