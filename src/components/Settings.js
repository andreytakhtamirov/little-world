import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { ThemeProvider, createTheme } from "@mui/material";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import PropTypes from 'prop-types'
import * as Constants from "../properties/constants";

export default function Settings({ onChange }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    Settings.propTypes = {
        onChange: PropTypes.func,
    }

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
        position: 'absolute',
        top: 20,
        right: 20,
        width: "30%",
        minWidth: 100,
        maxWidth: 360,
        bgcolor: '#fff',
        border: '2px solid #000',
        p: 2,
    };

    const settingsIconStyle = {
        position: "absolute",
        right: 20,
        top: 20,
        padding: 0,
    };

    const iconFontSize = {
        fontSize: 40,
    };

    const resolutionSettingsStyle = {
        paddingTop: 10,
        marginLeft: 10,
    };

    function getCurrentResolution() {
        let resolutions = Constants.Page.ResolutionWidths;
        let resolutionWidth = Constants.Page.SetResolutionWidth;
        let resolutionValue = "";
        let index = resolutions.indexOf(resolutionWidth);
        switch (index) {
            case 0:
                resolutionValue = "ultra_low";
                break;
            case 1:
                resolutionValue = "low";
                break;
            case 2:
                resolutionValue = "medium";
                break;
            case 3:
                resolutionValue = "high";
                break;
            case 4:
                resolutionValue = "ultra";
                break;
            default:
                resolutionValue = "medium";
                break;
        }

        return resolutionValue;
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <IconButton
                    aria-label="game settings"
                    onClick={handleOpen}
                    style={settingsIconStyle}
                    touch={"true"}
                    disableFocusRipple={true}
                    disableRipple={true}
                    color={"primary"}>
                    <SettingsIcon style={iconFontSize} />
                </IconButton>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Settings
                        </Typography>
                        <FormControl style={resolutionSettingsStyle}>
                            <FormLabel id="resolution-group-label">Resolution</FormLabel>
                            <RadioGroup
                                aria-labelledby="resolution-group-label"
                                defaultValue={getCurrentResolution}
                                name="resolution-group"
                                onChange={onChange}>
                                <FormControlLabel value="ultra_low" control={<Radio />} label="Ultra Low" />
                                <FormControlLabel value="low" control={<Radio />} label="Low" />
                                <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                                <FormControlLabel value="high" control={<Radio />} label="High" />
                                <FormControlLabel value="ultra" control={<Radio />} label="Ultra" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Modal>
            </ThemeProvider>
        </div>
    );
}
