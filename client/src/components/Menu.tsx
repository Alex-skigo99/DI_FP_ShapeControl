import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { lightGreen } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import React from 'react';
import Markdown from 'react-markdown'

interface MenuProps {
    text: string;
};

const Menu: React.FC<MenuProps> = ({ text }) => {
    return (
        <Card sx={{ minWidth: 800, backgroundColor: lightGreen[50]}} >
            <CardContent>
                <Typography variant="h5" component="div">
                    Menu
                </Typography>
                <Markdown>
                    {text}
                </Markdown>
            </CardContent>
        </Card>

    );
};

export default Menu;
