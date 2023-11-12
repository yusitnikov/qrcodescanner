import {useRef, useState} from "react";
import {Scanner} from "./Scanner";

export const App = () => {
    const [scanning, setScanning] = useState(false);

    const cancelTimeoutRef = useRef<NodeJS.Timeout | undefined>();
    const updateCancelTimeout = () => {
        if (cancelTimeoutRef.current) {
            clearTimeout(cancelTimeoutRef.current);
        }

        cancelTimeoutRef.current = setTimeout(() => setScanning(false), 60000);
    };

    return <div style={{position: "fixed", inset: 0}}>
        {!scanning && <button
            type={"button"}
            onClick={() => {
                updateCancelTimeout();
                setScanning(true);
            }}
        >
            Start scanning
        </button>}

        {scanning && <>
            <Scanner onData={(data) => {
                updateCancelTimeout();

                console.log("Got data!", data);
            }}/>

            <button
                type={"button"}
                onClick={() => setScanning(false)}
                style={{
                    position: "absolute",
                }}
            >
                Stop
            </button>
        </>}
    </div>;
};
