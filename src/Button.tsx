import {CSSProperties, ReactNode} from "react";

interface ButtonProps {
    children?: ReactNode;
    onClick?: () => void;
    style?: CSSProperties;
}

export const Button = ({children, onClick, style}: ButtonProps) => <button
    type={"button"}
    onClick={onClick}
    style={{
        fontSize: "inherit",
        padding: "10px 20px",
        minWidth: 200,
        border: "none",
        outline: "none",
        borderRadius: 7,
        background: "#48f",
        color: "#fff",
        cursor: "pointer",
        ...style,
    }}
>
    {children}
</button>;
