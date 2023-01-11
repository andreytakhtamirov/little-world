import React from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { ThemeProvider, createTheme } from "@mui/material";

export default function ActionButtons({
    onUpClick, onDownClick, 
    onLeftClick, onRightClick,
    onStrikeClick }) {
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

    const moveButtonsStyle = {
        position: 'absolute',
        left: '10%',
        bottom: '20%',
        padding: 0,
    };

    const actionButtonStyle = {
        position: 'absolute',
        right: '10%',
        bottom: '0%',
        padding: 0,
    };

    const iconFontSize = {
        fontSize: 60,
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <div style={moveButtonsStyle}>
                    <IconButton
                        aria-label="move up"
                        onMouseDown={onUpClick}
                        touch={"true"}
                        disableFocusRipple={true}
                        disableRipple={true}
                        color={"primary"}>
                        <ArrowDropUpIcon style={iconFontSize} />
                    </IconButton>
                    <IconButton
                        aria-label="move down"
                        onClick={onDownClick}
                        touch={"true"}
                        disableFocusRipple={true}
                        disableRipple={true}
                        color={"primary"}>
                        <ArrowDropDownIcon style={iconFontSize} />
                    </IconButton>
                    <IconButton
                        aria-label="move left"
                        onClick={onLeftClick}
                        touch={"true"}
                        disableFocusRipple={true}
                        disableRipple={true}
                        color={"primary"}>
                        <ArrowLeftIcon style={iconFontSize} />
                    </IconButton>
                    <IconButton
                        aria-label="move right"
                        onClick={onRightClick}
                        touch={"true"}
                        disableFocusRipple={true}
                        disableRipple={true}
                        color={"primary"}>
                        <ArrowRightIcon style={iconFontSize} />
                    </IconButton>
                </div>
                <div style={actionButtonStyle}>
                <IconButton
                        aria-label="strike"
                        onClick={onStrikeClick}
                        touch={"true"}
                        disableFocusRipple={true}
                        disableRipple={true}
                        color={"primary"}>
                        <ContentCutIcon style={iconFontSize} />
                    </IconButton>
                </div>
            </ThemeProvider>
        </div>
    );
}
