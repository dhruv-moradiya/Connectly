import { Button } from "@/components/ui/button";
import { Mic, Pause, Play, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const AudioRecordButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRecordingInterface, setShowRecordingInterface] = useState(false);

  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationIdRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const playbackSourceRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Draw visualizer bars
  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const barWidth = 3;
    const gap = 2;
    const shift = barWidth + gap;

    // Scroll existing content left
    const imageData = ctx.getImageData(
      shift,
      0,
      canvas.width - shift,
      canvas.height
    );
    ctx.putImageData(imageData, 0, 0);

    // Clear the rightmost area
    ctx.clearRect(canvas.width - shift, 0, shift, canvas.height);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let avg = sum / bufferLength;
    let barHeight = Math.max(3, (avg / 255) * (canvas.height * 0.7));

    // Draw new bar
    let y = (canvas.height - barHeight) / 2;
    ctx.fillStyle = isRecording ? "#ef4444" : "#22c55e";
    ctx.fillRect(canvas.width - barWidth - 1, y, barWidth, barHeight);
  };

  // Animation loop
  const animate = () => {
    if (!isAnimatingRef.current) return;

    drawVisualizer();
    animationIdRef.current = requestAnimationFrame(animate);
  };

  // Start animation
  const startAnimation = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    animate();
  };

  // Stop animation
  const stopAnimation = () => {
    isAnimatingRef.current = false;
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Start recording
  const startRecording = async () => {
    try {
      console.log("Starting recording...");

      // Get microphone access
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Create audio context and analyzer
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      const source = audioContextRef.current.createMediaStreamSource(
        streamRef.current
      );
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      console.log("Audio context created, starting visualizer...");

      // Start recording
      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("Recording stopped");
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(blob);
        audioRef.current.src = audioUrl;
        setHasRecording(true);

        // Clean up recording stream
        streamRef.current.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start(100);

      // Update UI and start animation
      setIsRecording(true);
      setShowRecordingInterface(true);
      clearCanvas();
      startAnimation();

      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    console.log("Stopping recording...");

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    stopAnimation();
    setIsRecording(false);
  };

  // Setup playback analyzer
  const setupPlayback = async () => {
    try {
      console.log("Setting up playback...");

      // Create fresh audio context for playback
      if (audioContextRef.current) {
        try {
          await audioContextRef.current.close();
        } catch (e) {
          console.log("Previous context already closed");
        }
      }

      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      // Disconnect previous source
      if (playbackSourceRef.current) {
        try {
          playbackSourceRef.current.disconnect();
        } catch (e) {
          console.log("Previous source already disconnected");
        }
      }

      // Create new source
      playbackSourceRef.current =
        audioContextRef.current.createMediaElementSource(audioRef.current);
      playbackSourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      console.log("Playback setup complete");
      return true;
    } catch (error) {
      console.error("Error setting up playback:", error);
      return false;
    }
  };

  // Toggle playback
  const togglePlayback = async () => {
    if (!audioRef.current || !hasRecording) return;

    try {
      if (isPlaying) {
        console.log("Pausing playback");
        audioRef.current.pause();
        stopAnimation();
        setIsPlaying(false);
      } else {
        console.log("Starting playback");

        // Setup fresh analyzer for playback
        const success = await setupPlayback();
        if (!success) {
          console.error("Failed to setup playback");
          return;
        }

        // Resume audio context if needed
        if (audioContextRef.current.state === "suspended") {
          await audioContextRef.current.resume();
        }

        // Start playing and animation
        clearCanvas();
        startAnimation();
        await audioRef.current.play();
        setIsPlaying(true);

        console.log("Playback started");
      }
    } catch (error) {
      console.error("Error during playback:", error);
    }
  };

  // Reset everything
  const resetRecording = () => {
    console.log("Resetting...");

    stopAnimation();

    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current.src = "";
      }
    }

    setShowRecordingInterface(false);
    setHasRecording(false);
    setIsRecording(false);
    setIsPlaying(false);
    clearCanvas();
  };

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      console.log("Audio started playing");
      setIsPlaying(true);
      startAnimation();
    };

    const handlePause = () => {
      console.log("Audio paused");
      setIsPlaying(false);
      stopAnimation();
    };

    const handleEnded = () => {
      console.log("Audio ended");
      setIsPlaying(false);
      stopAnimation();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative">
      {!showRecordingInterface ? (
        <button
          type="button"
          onClick={startRecording}
          className="size-8 rounded-full hover:bg-accent flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          <Mic size={20} />
        </button>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 mx-4">
            {/* Status indicator */}
            <div className="text-center mb-4">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isRecording
                    ? "bg-red-100 text-red-700"
                    : isPlaying
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {isRecording && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                {isRecording
                  ? "Recording..."
                  : isPlaying
                  ? "Playing..."
                  : "Ready"}
              </div>
            </div>

            {/* Visualizer */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <canvas
                ref={canvasRef}
                width={320}
                height={80}
                className="w-full h-20 bg-white rounded border"
              />
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              {isRecording ? (
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  className="border-red-200 hover:bg-red-50"
                >
                  <Square className="w-4 h-4 fill-red-500 text-red-500" />
                  Stop
                </Button>
              ) : hasRecording ? (
                <>
                  <Button
                    onClick={togglePlayback}
                    variant="outline"
                    className="border-green-200 hover:bg-green-50"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 text-green-600" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-green-600 text-green-600" />{" "}
                        Play
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetRecording}
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <Mic className="w-4 h-4 text-blue-600" />
                    New
                  </Button>
                </>
              ) : (
                <div className="text-gray-500 text-sm">Processing...</div>
              )}
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default AudioRecordButton;
