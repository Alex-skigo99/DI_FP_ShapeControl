import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export interface FormDialogData {
    kcalAmount: number, 
    foodsPrefer: string
};
interface DialogProps {
    open: boolean;
    kcalAmount: number;
    onClose: (data?: FormDialogData) => void;
};

const FormDialog: React.FC<DialogProps> = ({open, kcalAmount, onClose}) => {
    const [formData, setFormData] = React.useState <FormDialogData>({ kcalAmount: kcalAmount, foodsPrefer: 'no' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    // Handle dialog close (on Cancel or outside click)
    const handleCancel = () => {
        onClose();
    };
    // Handle form submission (on OK button click)
    const handleSubmit = () => {
        onClose(formData);
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
          <DialogTitle>Enter Your Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
                Please enter total menu calories and your food preferences
            </DialogContentText>
            <TextField
              margin="dense"
              type='number'
              label="Kcal amount"
              name="kcalAmount"
              fullWidth
              variant="outlined"
              value={formData.kcalAmount}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Must have foods"
              name="foodsPrefer"
              fullWidth
              variant="outlined"
              value={formData.foodsPrefer}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>OK</Button>
          </DialogActions>
        </Dialog>
      ); 
}

export default FormDialog;