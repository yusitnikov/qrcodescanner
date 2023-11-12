import {useCallback, useEffect, useRef} from "react";

export const useRaf = (callback: () => void | Promise<void>) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const runningRef = useRef(true);
    useEffect(() => {
        return () => {
            runningRef.current = false;
        };
    }, [runningRef]);

    const request = useCallback(() => {
        requestAnimationFrame(async () => {
            try {
                await callbackRef.current();
            } finally {
                if (runningRef.current) {
                    request();
                }
            }
        });
    }, [callbackRef, runningRef]);
    useEffect(request, [request]);
};
