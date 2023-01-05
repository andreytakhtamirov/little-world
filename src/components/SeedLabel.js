import * as React from 'react';
import { createTheme } from "@mui/material";
import PropTypes from 'prop-types'

export default function SeedLabel(props) {
    SeedLabel.propTypes = {
        seedNumber: PropTypes.number,
    }
    const theme = createTheme({
        palette: {
            primary: {
                light: '#757ce8', main: '#1c516e', dark: '#002884', contrastText: '#fff',
            }
        },
        typography: {
            fontFamily: [
                'Arial',
            ].join(','),
        },
    });

    const style = {
        position: "absolute",
        fontSize: "12px",
        WebkitTextStroke: theme.palette.primary.dark,
        WebkitTextStrokeWidth: '0.4px',
        fontWeight: 900,
        textAlign: "center",
        left: "2%",
        bottom: '0%',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.primary.main,
    };

    if (!props.seedNumber) {
        return null;
    }

    return (
        <div>
            <p style={style}>
                World Seed: {props.seedNumber}
            </p>
        </div>
    );
}
