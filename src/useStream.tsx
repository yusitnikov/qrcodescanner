import {useEffect, useState} from "react";

export const useStream = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: {ideal: 4000},
                    facingMode: {ideal: 'environment'},
                },
                audio: false,
            })
            .then(setStream, setError)
    }, []);

    useEffect(() => {
        return () => {
            if (stream) {
                for (const track of stream.getTracks()) {
                    track.stop();
                }
            }
        };
    }, [stream]);

    return {stream, error};
};
