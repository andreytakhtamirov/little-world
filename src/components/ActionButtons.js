import * as React from 'react';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { ThemeProvider, createTheme } from "@mui/material";

export default function ActionButtons({ playButton, onPlayClick, refreshButton, onRefreshClick }) {
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
        transform: "translate(-50%, -50%)",
        left: '50%',
        bottom: '0px',
        padding: 0,
    };

    const iconFontSize = {
        fontSize: 60,
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <div style={style}>
                    {/* <IconButton
                        ref={playButton}
                        aria-label="start game"
                        onClick={onPlayClick}
                        touch={"true"}
                        disableFocusRipple={true}
                        disableRipple={true}
                        color={"primary"}>
                        <PlayArrowOutlinedIcon style={iconFontSize} />
                    </IconButton> */}
                    <IconButton
                        ref={refreshButton}
                        aria-label="refresh world"
                        onClick={onRefreshClick}
                        touch={"true"}
                        disableFocusRipple={true}
                        disableRipple={true}
                        color={"primary"}>
                        <RefreshRoundedIcon style={iconFontSize} />
                    </IconButton>
                </div>
            </ThemeProvider>
        </div>
    );
}
