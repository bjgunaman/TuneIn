import React from 'react';
import classNames from 'classnames';
import './Chatbox.css';
const Message = (props) => {
    let location = '';
    let avatar = '';
    let server = '';
    console.log(props.message.username);
    console.log(props.username);
    if (props.message.username === props.username) {
        location = 'right';
        avatar = 'no-avatar';
        server = 'false';
    } else if (props.message.username === 'server') {
        location = 'center'
        avatar = 'no-avatar';
        server = 'server';
    }
    else {
        location = 'left'
        avatar = 'with-avatar';
        server = 'false'
    }

    const multClassNames = classNames({
        'single-message': true,
        'right': location === 'right',
        'left': location === 'left',
        'center': location === 'center',
        'server': server === 'server'
    });
    console.log(multClassNames);
    return (
        <div className={multClassNames}>
            <div className={avatar}></div>
            <div className="text">{props.message.textMessage}</div>
        </div>
    )
}

export default Message;