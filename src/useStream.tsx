import {useEffect, useMemo, useState} from "react";

export const useStream = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState("");

    const streamPromise = useMemo(
        () => navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: {ideal: 4000},
                    facingMode: {ideal: 'environment'},
                },
                audio: false,
            })
            .then(
                (stream) => {
                    setStream(stream);
                    return stream;
                },
                (error) => {
                    setError(error);
                    return null;
                },
            ),
        []
    );

    useEffect(() => {
        return () => {
            streamPromise.then((stream) => {
                if (stream) {
                    for (const track of stream.getTracks()) {
                        track.stop();
                    }
                }
            });
        };
    }, [streamPromise]);

    return {stream, error};
};
