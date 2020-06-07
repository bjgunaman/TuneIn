import React from 'react';
import classNames from 'classnames';
import './Chatbox.css';

const Message = (props) => {
    let location = '';
    let avatar = '';
    let server = '';
    let image = '';

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

    if (props.message.image) {
        image = props.message.image;
    } else {
        image = '';
    }

    const multClassNames = classNames({
        'single-message': true,
        'right': location === 'right',
        'left': location === 'left',
        'center': location === 'center',
        'server': server === 'server'
    });
    
    return (
        <div className={multClassNames}>
            <div className={avatar} style={{backgroundColor: props.message.userColor}}><img className="profileImage" src={image.toString()}/></div>
            <div className="text">{props.message.textMessage}</div>
        </div>
    )
}

export default Message;