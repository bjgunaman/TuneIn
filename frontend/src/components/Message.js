import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './Chatbox.css';
import { string } from 'prop-types';
const Message = (props) => {
    let location = '';
    let avatar = '';
    let server = '';
    let image = '';
   // let [color, setColor] = useState(props.color)
    console.log(props.message.username);
    console.log(props.username);
    //console.log(props.color)
    console.log("COLOUR MESSAGE: ",props.message.userColor)
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
    console.log(props.image);
    if(props.image != '') {
        image = props.image;
        console.log("Image: ",image)
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
            <div className={avatar} style={{backgroundColor: props.message.userColor}}><img className="profileImage" src={image.toString()}/></div>
            <div className="text">{props.message.textMessage}</div>
        </div>
    )
}

export default Message;