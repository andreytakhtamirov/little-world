import * as React from 'react';
import { createTheme } from "@mui/material";

export default function Heading() {
    const theme = createTheme({
        palette: {
            primary: {
                light: '#757ce8', main: '#1c516e', dark: '#002884', contrastText: '#fff',
            }, secondary: {
                light: '#ff7961', main: '#f44336', dark: '#ba000d', contrastText: '#000',
            },
        },
        typography: {
            fontFamily: [
                'Arial',
            ].join(','),
        },
    });

    const style = {
        position: "absolute",
        fontSize: "11px",
        WebkitTextStroke: theme.palette.primary.dark,
        WebkitTextStrokeWidth: '0.4px',
        opacity: 0.5,
        fontWeight: 900,
        transform: "translate(50%, 50%) scale(4)",
        textAlign: "center",
        right: "50%",
        top: '7%',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.primary.main,
    };

    return (
        <div>
            <p style={style}>
                In Your Own Little World!
            </p>
        </div>
    );
}
