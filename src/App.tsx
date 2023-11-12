import {useRef, useState} from "react";
import {Scanner} from "./Scanner";
import {Button} from "./Button";

const padding = 20;

export const App = () => {
    const [scanning, setScanning] = useState(false);

    const [data, setData] = useState<(string | undefined)[]>([]);
    const dataStr = data.join("");
    const isReady = data.length !== 0 && data.every((s) => s !== undefined);

    const cancelTimeoutRef = useRef<NodeJS.Timeout | undefined>();
    const updateCancelTimeout = () => {
        if (cancelTimeoutRef.current) {
            clearTimeout(cancelTimeoutRef.current);
        }

        cancelTimeoutRef.current = setTimeout(() => setScanning(false), 60000);
    };

    return <div style={{
        position: "fixed",
        inset: 0,
        textAlign: "center",
        fontSize: "24px",
    }}>
        {scanning && <Scanner onData={(qrData) => {
            updateCancelTimeout();

            // eslint-disable-next-line no-control-regex
            const match = qrData.match(/^(\d+)\/(\d+):/);
            if (!match) {
                return;
            }

            const [wholeMatch, indexMatch, countMatch] = match;
            const index = Number(indexMatch) - 1;
            const count = Number(countMatch);
            const dataStr = qrData.substring(wholeMatch.length);

            const newData: typeof data = data.length === count
                ? data
                : Array(count).fill(undefined);
            newData[index] = dataStr;
            setData([...newData]);

            if (newData.every((s) => s !== undefined)) {
                setScanning(false);
            }
        }}/>}

        <div style={{
            position: "absolute",
            top: padding,
            left: padding,
            right: padding,
        }}>
            {!scanning && isReady && <>
                <textarea
                    value={dataStr}
                    readOnly={true}
                    style={{
                        width: "100%",
                        height: "50vh",
                        resize: "none",
                        boxSizing: "border-box",
                        borderRadius: 7,
                        padding: 10,
                        marginBottom: padding / 2,
                    }}
                />

                <Button onClick={() => navigator.clipboard.writeText(dataStr)}>
                    Copy text
                </Button>
            </>}

            {scanning && data.length !== 0 && <div style={{
                display: "flex",
                flexDirection: "row",
                gap: padding / 2,
                width: "100%",
            }}>
                {data.map((value, index) => <div
                    key={index}
                    style={{
                        width: "100%",
                        background: `rgba(${value === undefined ? "128, 0, 0" : "0, 192, 0"}, 0.5)`,
                        color: "#fff",
                        padding: padding / 2,
                    }}
                >
                    {value === undefined ? index + 1 : "✓"}
                </div>)}
            </div>}
        </div>

        <div style={{
            position: "absolute",
            bottom: padding,
            left: padding,
            right: padding,
        }}>
            {!scanning && <Button onClick={() => {
                updateCancelTimeout();
                setData([]);
                setScanning(true);
            }}>
                Start scanning
            </Button>}

            {scanning && <Button onClick={() => setScanning(false)}>
                Stop
            </Button>}
        </div>
    </div>;
};
