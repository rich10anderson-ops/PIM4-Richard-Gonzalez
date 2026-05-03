import React from 'react';

export interface ButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button type="button" onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
