import React from 'react';
import io from 'socket.io-client';

let socket;
class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            room: '',
            userInput: '',
            messages: ''
        }
        socket = io('localhost:8888');
    }
    componentDidMount() {
        this.setState({username: 'Lmao'});
        this.setState({room: '100'});

        socket.emit('joining', {username: this.state.username, room: this.state.room});
        socket.emit('broadcastMessage', (receivedMessage) => {
            this.setState([...this.state.messages, receivedMessage]);
        })
    }

    componentWillUnmount() {
        socket.emit('disconnect')
        socket.off(); //disconnect
    }

    sendMessage(event) {
        event.preventDefault();
        if (this.state.message) {
            socket.emit('sendMessage', this.state.message);
            this.setState({message: ''});
        }
    }

    render() {
        <div className="outer-box">
            <div className="inner-box">
                <div className="chat-header"></div>
                <div className="message-box"></div>
                <div className="user-input"></div>
            </div>
        </div>
    }
}