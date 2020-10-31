import * as React from 'react';

const Icon = (props) => {
    const {
        iconName
    } = props;

    return (
        <i className={'fa fa-' + iconName}></i>
    )
}

export default Icon;
