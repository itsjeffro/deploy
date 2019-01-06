import React from 'react';

const TextField = props => {
    const {
        id,
        label,
        onChange,
        name,
        type,
        value
    } = props;

    return (
        <div>
            {label ? <label htmlFor={id}>{label}</label> : ''}
            <input 
                className="form-control" 
                name={name} 
                onChange={onChange} 
                type={type || 'text'} 
                id={id}
                value={value}
            />
        </div>
    )
}

export default TextField;