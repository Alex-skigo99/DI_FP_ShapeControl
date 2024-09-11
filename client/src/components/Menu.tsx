import React from 'react';
import Markdown from 'react-markdown'

interface MenuProps {
    text: string;
}

const Menu: React.FC<MenuProps> = ({ text }) => {
    // const [menu] = React.useState <string>(text);
    console.log('Menu-text: ', text);

    return (
        <Markdown>
            {text}
        </Markdown>
    );
};

export default Menu;
