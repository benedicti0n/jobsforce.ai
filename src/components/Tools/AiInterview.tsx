"use client"

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Mic, MicOff, Send, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import MarkdownPreview from "@uiw/react-markdown-preview";
import axios from "axios";

const SERVER_URL = "wss://mock.jobsforce.ai/api/aimockinterview";

// Add Google Text-to-Speech API constants
const GOOGLE_TTS_API_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";
const GOOGLE_TTS_API_KEY = 'AIzaSyD8ye_G9waFG4-JhX0EK2tIvMiIDtyECwU';

const VoiceVisualizer = ({ isListening, className }) => {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <div className="relative w-20 h-20">
                {/* Outer ripple effect */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "transition-all duration-500",
                        isListening
                            ? ["animate-ping", "bg-sky-400/20", "scale-150"]
                            : "scale-100"
                    )}
                />

                {/* Middle pulse effect */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "transition-all duration-300",
                        isListening
                            ? ["bg-sky-400/30", "scale-125", "animate-pulse"]
                            : "scale-100"
                    )}
                />

                {/* Main orb */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r from-yellow-200 to-sky-400",
                        "transition-all duration-200 ease-in-out",
                        "flex items-center justify-center",
                        "shadow-lg",
                        isListening
                            ? ["scale-100", "opacity-100"]
                            : ["scale-95", "opacity-80"]
                    )}
                >
                    {isListening ? (
                        <div className="flex items-center justify-center space-x-1">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-1 bg-white rounded-full",
                                        "animate-sound-wave"
                                    )}
                                    style={{
                                        height: "16px",
                                        animationDelay: `${i * 0.1}s`,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <Mic className="w-7 h-7 text-white" />
                    )}
                </div>
            </div>
        </div>
    );
};

const SpeakingAnimation = () => {
    return (
        <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-1">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 bg-sky-600 rounded-full animate-bounce"
                        style={{
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: "1s",
                        }}
                    />
                ))}
            </div>
            <span className="text-sky-600 font-medium ml-2">AI Speaking...</span>
        </div>
    );
};

const RealtimeTranscription = ({ text }) => {
    if (!text) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-gray-200 border border-white/10">
                <span className="opacity-60">Listening: </span>
                {text}
                <span className="animate-pulse">▋</span>
            </div>
        </motion.div>
    );
};

const textToSpeech = async (text) => {
    try {
        const response = await axios.post(
            GOOGLE_TTS_API_URL + `?key=${GOOGLE_TTS_API_KEY}`,
            {
                input: { text },
                voice: { languageCode: "en-US", name: "en-US-Wavenet-D" },
                audioConfig: { audioEncoding: "MP3" },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Decode the base64 audio content
        const audioContent = response.data.audioContent;

        // Convert base64 to binary
        const byteCharacters = atob(audioContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the binary data
        const audioBlob = new Blob([byteArray], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        return audio;
    } catch (error) {
        console.error("Error converting text to speech:", error);
        return null;
    }
};

const AiInterview = () => {
    const wsRef = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 3;
    const recognitionRef = useRef(null);

    // WebSocket and connection states
    const [socket, setSocket] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [connectionError, setConnectionError] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
    const [feedbackReceived, setFeedbackReceived] = useState(false);

    // Step management
    const [currentStep, setCurrentStep] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isStartingInterview, setIsStartingInterview] = useState(false);
    const [isSendingResponse, setIsSendingResponse] = useState(false);

    // Interview content
    const [jobDescription, setJobDescription] = useState("");
    const [question, setQuestion] = useState("");
    const [feedback, setFeedback] = useState("");

    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
    const [shouldAnimateQuestion, setShouldAnimateQuestion] = useState(false);

    // Speech recognition states
    const [transcript, setTranscript] = useState("");
    const [listening, setListening] = useState(false);
    const [
        browserSupportsSpeechRecognition,
        setBrowserSupportsSpeechRecognition,
    ] = useState(true);
    const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true);
    const [audioLevel, setAudioLevel] = useState(0);

    const totalQuestions = 10;

    // Add a new loading state for reconnection
    const [isReconnecting, setIsReconnecting] = useState(false);

    // Add this to handle URL parameters
    const searchParams = useSearchParams();

    // Add this state near other state declarations
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    // Update useEffect to handle job description from URL
    useEffect(() => {
        const urlJobDescription = searchParams.get("jobDescription");
        if (urlJobDescription) {
            setJobDescription(decodeURIComponent(urlJobDescription));
        }
    }, [searchParams]);

    // Check for speech recognition support
    useEffect(() => {
        const checkSpeechRecognitionSupport = () => {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                setBrowserSupportsSpeechRecognition(false);
            }

            // Check if microphone is available
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(() => setIsMicrophoneAvailable(true))
                .catch(() => setIsMicrophoneAvailable(false));
        };

        checkSpeechRecognitionSupport();
    }, []);

    // Setup speech recognition
    const setupSpeechRecognition = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        // Add audio level detection
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                function updateAudioLevel() {
                    if (listening) {
                        analyser.getByteFrequencyData(dataArray);
                        const average =
                            dataArray.reduce((a, b) => a + b) / dataArray.length;
                        setAudioLevel(average / 128.0); // Normalize to 0-1
                        requestAnimationFrame(updateAudioLevel);
                    }
                }

                recognition.onstart = () => {
                    updateAudioLevel();
                };
            })
            .catch((err) => console.error("Error accessing microphone:", err));

        recognition.onresult = (event) => {
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + " ";
                }
            }

            if (finalTranscript) {
                setTranscript((prev) => prev + finalTranscript);
            }
        };

        recognition.onend = () => {
            if (listening) {
                recognition.start();
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            if (event.error === "not-allowed") {
                setIsMicrophoneAvailable(false);
            }
            setListening(false);
        };

        recognitionRef.current = recognition;
    };

    const startListening = () => {
        if (!recognitionRef.current) {
            setupSpeechRecognition();
        }

        try {
            recognitionRef.current.start();
            setListening(true);
        } catch (error) {
            console.error("Error starting speech recognition:", error);
        }
    };

    const stopListening = () => {
        try {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setListening(false);
        } catch (error) {
            console.error("Error stopping speech recognition:", error);
        }
    };

    const resetTranscript = () => {
        setTranscript("");
    };

    const setupWebSocket = () => {
        if (reconnectAttempts.current >= maxReconnectAttempts) {
            setConnectionError(true);
            return;
        }

        setIsReconnecting(true); // Show reconnecting state

        const ws = new WebSocket(`${SERVER_URL}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Connected to web socket server");
            setIsConnecting(false);
            setIsReconnecting(false); // Hide reconnecting state
            setConnectionError(false);
            reconnectAttempts.current = 0;
        };

        ws.onclose = (event) => {
            if (!event.wasClean && currentStep !== 3 && !feedbackReceived) {
                console.log("Connection lost. Attempting to reconnect...");
                reconnectAttempts.current += 1;
                setTimeout(setupWebSocket, 2000);
            }
            setIsConnecting(false);
        };

        ws.onerror = () => {
            setIsConnecting(false);
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            handleWebSocketMessage(data);
        };

        setSocket(ws);
    };

    useEffect(() => {
        setupWebSocket();
        setupSpeechRecognition();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (recognitionRef.current && listening) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const handleWebSocketMessage = async (data) => {
        switch (data.type) {
            case "question":
                if (currentQuestion >= totalQuestions) {
                    setIsGeneratingFeedback(true);
                    setLoadingMessage("Generating your feedback...");
                    socket.send(
                        JSON.stringify({
                            type: "generate_feedback",
                        })
                    );
                    return;
                }

                if (currentQuestion === 0) {
                    setLoadingMessage("Preparing your first question...");
                } else {
                    setLoadingMessage("Loading next question...");
                }

                setTimeout(async () => {
                    setQuestion(data.question);
                    setIsStartingInterview(false);
                    setCurrentQuestion((prev) => prev + 1);
                    setLoadingMessage("");

                    // Play the question audio
                    setIsPlayingAudio(true);
                    const audio = await textToSpeech(data.question);
                    if (audio) {
                        audio.onended = () => setIsPlayingAudio(false);
                        audio.play();
                    } else {
                        setIsPlayingAudio(false);
                    }
                }, 1500);
                break;

            case "feedback":
                setIsGeneratingFeedback(false);
                setFeedback(data.feedback);
                setFeedbackReceived(true);
                setIsSendingResponse(false);
                setCurrentStep(3);
                break;

            case "error":
                if (!feedbackReceived) {
                    setIsReconnecting(true); // Show reconnecting state instead of error
                }
                setLoadingMessage("");
                setIsGeneratingFeedback(false);
                break;

            default:
                console.log("Unknown message type:", data.type);
        }
    };

    const sendResponse = () => {
        if (socket && transcript.trim()) {
            setIsSendingResponse(true);
            setShouldAnimateQuestion(false);

            if (currentQuestion === totalQuestions) {
                setIsGeneratingFeedback(true);
                setLoadingMessage("Generating your feedback...");
                socket.send(
                    JSON.stringify({
                        type: "generate_feedback",
                        answer: transcript,
                        questionNumber: currentQuestion,
                    })
                );
            } else {
                setLoadingMessage("Processing your response...");
                socket.send(
                    JSON.stringify({
                        type: "response",
                        answer: transcript,
                        questionNumber: currentQuestion,
                    })
                );
            }

            resetTranscript();
            setIsSendingResponse(false);
        }
    };

    const startInterview = () => {
        if (socket && jobDescription.trim()) {
            setIsStartingInterview(true);
            setCurrentStep(2);
            setLoadingMessage("Starting the interview...");
            socket.send(
                JSON.stringify({
                    type: "start",
                    jobDescription,
                })
            );
        }
    };

    const startNewInterview = () => {
        setCurrentStep(1);
        setCurrentQuestion(0);
        setQuestion("");
        setFeedback("");
        setFeedbackReceived(false);
        resetTranscript();

        if (wsRef.current) {
            wsRef.current.close();
        }
        reconnectAttempts.current = 0;
        setupWebSocket();
    };

    if (!browserSupportsSpeechRecognition) {
        return (
            <Alert variant="destructive" className="max-w-2xl mx-auto m-4">
                <AlertDescription>
                    Your browser doesn't support speech recognition. Please use a modern
                    browser like Chrome.
                </AlertDescription>
            </Alert>
        );
    }

    if (!isMicrophoneAvailable) {
        return (
            <Alert variant="destructive" className="max-w-2xl mx-auto m-4">
                <AlertDescription>
                    Please allow microphone access to use the speech recognition feature.
                </AlertDescription>
            </Alert>
        );
    }

    const QuestionContent = () => (
        <div className="min-h-[120px] flex items-center justify-center w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {loadingMessage ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-8 space-y-4"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                        <p className="text-sky-600 font-medium">{loadingMessage}</p>
                    </motion.div>
                ) : isPlayingAudio ? (
                    <motion.div
                        key="speaking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-8 space-y-4"
                    >
                        <SpeakingAnimation />
                    </motion.div>
                ) : (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-sky-100 shadow-sm"
                    >
                        <p className="text-black text-lg font-medium">{question}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    if (isReconnecting && !feedbackReceived) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center space-y-4">
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Reconnecting...</h3>
                    <p className="text-gray-500">
                        Maintaining connection to ensure your interview progress is saved.
                    </p>
                </div>
            </div>
        );
    }

    const StepIndicator = ({ step, isActive, isCompleted }) => (
        <div className="flex items-center">
            <div
                className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                    }
      `}
            >
                {step}
            </div>
            {step < 3 && (
                <div
                    className={`w-24 h-1 mx-2 ${isCompleted ? "bg-green-500" : "bg-gray-200"
                        }`}
                />
            )}
        </div>
    );

    const renderFeedback = () => {
        if (!feedback) return null;

        const paragraphs = feedback.split("\n\n").filter((p) => p.trim());

        return (
            <div className="space-y-6">
                {paragraphs.map((paragraph, index) => {
                    const isHeading = paragraph.endsWith(":") && paragraph.length < 30;

                    return isHeading ? (
                        <h3
                            key={index}
                            className="text-lg font-semibold text-blue-700 mt-6"
                        >
                            {paragraph}
                        </h3>
                    ) : (
                        <p key={index} className="text-gray-700 leading-relaxed">
                            {paragraph}
                        </p>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto p-6 pt-24 space-y-8">
            <div className="flex justify-center mb-8">
                <StepIndicator
                    step={1}
                    isActive={currentStep === 1}
                    isCompleted={currentStep > 1}
                />
                <StepIndicator
                    step={2}
                    isActive={currentStep === 2}
                    isCompleted={currentStep > 2}
                />
                <StepIndicator
                    step={3}
                    isActive={currentStep === 3}
                    isCompleted={currentStep > 3}
                />
            </div>

            <AnimatePresence mode="wait">
                {currentStep === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-semibold">Enter Job Description</h2>
                        <div className="w-full items-start flex gap-4">
                            {jobDescription && <Button onClick={() => setJobDescription("")} variant="outline">
                                Edit Job Description
                            </Button>}{" "}
                            <Button
                                onClick={startInterview}
                                disabled={
                                    !jobDescription.trim() || isConnecting || isStartingInterview
                                }
                            >
                                {isStartingInterview ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Starting Interview...
                                    </>
                                ) : (
                                    "Start Interview"
                                )}
                            </Button>
                        </div>

                        {/* Show markdown preview if job description exists */}
                        {jobDescription ? (
                            <div className="space-y-4 h-80 overflow-y-auto">
                                <MarkdownPreview
                                    source={jobDescription}
                                    style={{
                                        padding: 16,
                                        borderRadius: 8,
                                        backgroundColor: "#f3f4f6",
                                        color: "#333",
                                        fontSize: 16,
                                        lineHeight: 1.5,
                                    }}
                                />
                            </div>
                        ) : (
                            <Textarea
                                placeholder="Enter the job description..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="w-full h-52"
                                disabled={isConnecting}
                            />
                        )}
                    </motion.div>
                )}

                {currentStep === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative min-h-[calc(100vh-100px)]"
                    >
                        <div className="text-center text-lg font-medium text-black mb-8">
                            Question {Math.min(currentQuestion, totalQuestions)} of{" "}
                            {totalQuestions}
                        </div>

                        <div className="relative bg-gradient-to-b from-yellow-50 to-sky-50 rounded-xl p-8 min-h-[400px] flex flex-col items-center shadow-xl border border-sky-100">
                            <VoiceVisualizer isListening={listening} className="mb-8" />

                            <div className="w-full">
                                <QuestionContent />
                            </div>

                            {transcript && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full max-w-2xl mx-auto mt-6"
                                >
                                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-black border border-sky-100 shadow-sm">
                                        {transcript}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sky-100 shadow-lg">
                            <div className="max-w-3xl mx-auto px-6 py-4">
                                <div className="flex justify-center space-x-4">
                                    <Button
                                        onClick={listening ? stopListening : startListening}
                                        variant="ghost"
                                        className={cn(
                                            "bg-gradient-to-r from-yellow-100 to-sky-100 hover:opacity-90 transition-colors",
                                            "rounded-full px-8 py-6 text-black",
                                            listening && "bg-sky-100 text-black"
                                        )}
                                    >
                                        {listening ? (
                                            <>
                                                <MicOff className="mr-2 h-5 w-5" />
                                                Stop Recording
                                            </>
                                        ) : (
                                            <>
                                                <Mic className="mr-2 h-5 w-5" />
                                                Start Recording
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={sendResponse}
                                        disabled={!transcript.trim() || isSendingResponse}
                                        variant="ghost"
                                        className={cn(
                                            "bg-gradient-to-r from-yellow-100 to-sky-100 hover:opacity-90 transition-colors",
                                            "rounded-full px-8 py-6 text-black",
                                            "disabled:opacity-50"
                                        )}
                                    >
                                        {isSendingResponse ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-5 w-5" />
                                                Send Response
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {currentStep === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-semibold text-center">
                            Interview Feedback
                        </h2>
                        <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-lg shadow-md border border-blue-100">
                            {isGeneratingFeedback ? (
                                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                    <p className="text-blue-600 font-medium">
                                        Generating your feedback...
                                    </p>
                                </div>
                            ) : (
                                <div className="prose max-w-none">{renderFeedback()}</div>
                            )}
                        </div>

                        {feedbackReceived && (
                            <Button
                                onClick={startNewInterview}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Start New Interview
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AiInterview;
