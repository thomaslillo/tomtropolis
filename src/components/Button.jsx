import React from 'react';

const Button = ({ name, href }) => {
    return (
        <a href={href}>
            <button>{name}</button>
        </a>
    );
};

export default Button;
