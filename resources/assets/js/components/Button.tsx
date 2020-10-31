import * as React from 'react';

const Button = (props) => {
    const {
        color,
        onClick,
        style
    } = props;

    return (
        <button 
            type="button" 
            className={'btn btn-' + (color ? color : 'default')} 
            onClick={onClick}
            style={style}
        >
            {props.children}
        </button>
    )
}

export default Button;