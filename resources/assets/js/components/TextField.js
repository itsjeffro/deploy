import React from 'react';

const TextField = props => {
    const {
        id,
        label,
        onChange,
        name,
        type,
        value,
        placeholder
    } = props;

    return (
        <div className="form-group">
            {label ? <label htmlFor={id}>{label}</label> : ''}
            <input 
                className="form-control" 
                name={name} 
                onChange={onChange} 
                type={type || 'text'} 
                id={id}
                value={value}
                placeholder={placeholder}
            />
        </div>
    )
}

export default TextField;