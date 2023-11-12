import {CSSProperties, useEffect, useMemo, useState} from "react";
import {useStream} from "./useStream";
import {useRaf} from "./useRaf";
import QrScanner from "qr-scanner";

interface ScannerProps {
    onData: (data: string) => void;
}

export const Scanner = ({onData}: ScannerProps) => {
    const [ref, setRef] = useState<HTMLVideoElement | null>(null);

    const {stream, error} = useStream();

    useEffect(() => {
        if (ref) {
            ref.srcObject = stream;
        }
    }, [ref, stream]);

    useRaf(async () => {
        if (ref && stream) {
            try {
                const {data} = await QrScanner.scanImage(ref, {returnDetailedScanResult: true});
                onData(data);
            } catch (e) {
                // NOOP - QR code not recognized
            }
        }
    });

    const videoStyle = useMemo((): CSSProperties => ({
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
    }), []);

    return error
        ? <div style={{position: "absolute", inset: 0, top: "25vh"}}>
            <div>אתחול מצלמה נכשל</div>
            <div style={{marginTop: 10}}>בדקו את ההרשאות</div>
        </div>
        : <video
            ref={setRef}
            autoPlay={true}
            muted={true}
            style={videoStyle}
        />;
};
