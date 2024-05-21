import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, {DialogProps} from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import {useEffect, useState} from "react";
import Login from './Login';
import Signup from "./Signup";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function LoginModal(props: { flag: boolean, changeModal: any }) {

    console.log(props)

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(0);


    useEffect(() => {
        setOpen(props.flag)
    }, [props.flag])

    const handleClose = () => {
        props.changeModal(false)
        setOpen(false);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <React.Fragment>
            <Dialog
                fullWidth
                maxWidth={'md'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Have an Account?</DialogTitle>
                <DialogContent>
                    <Box sx={{width: '100%'}}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Log In" {...a11yProps(0)} />
                                <Tab label="Sign Up" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <Login changeModal={props.changeModal}/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Signup handleChange={handleChange}/>
                        </TabPanel>
                    </Box>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}