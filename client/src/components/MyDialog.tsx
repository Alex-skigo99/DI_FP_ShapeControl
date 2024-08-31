import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

interface myDialogProps {
    title: string,
    text: string,
    btnText: string,
    handleClose: () => void
}

export const MyDialog = (props: myDialogProps) => {
    const {title, text, btnText, handleClose} = props;

    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                {text}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>{btnText}</Button>
            </DialogActions>
      </Dialog>
  
    )

};