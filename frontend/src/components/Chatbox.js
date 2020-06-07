import React from 'react';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import './Chatbox.css';
let socket;
class Chatbox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            room: props.room,
            userInput: '',
            messages: [],
        }
        this.image = props.image
        socket = props.initSocket;//io('localhost:8080');
        this.sendMessage = this.sendMessage.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    async componentDidMount() {
        socket.emit('joining', {username: this.state.username, room: this.state.room, image: this.image});
        socket.on('serverMessage', (receivedMessage) => {
            this.setState({messages: [...this.state.messages, receivedMessage]});
        })
        socket.on('broadcastedMessage', (receivedMessage) => {
            this.setState({messages: [...this.state.messages, receivedMessage]});
        })
    }


    componentDidUnmount() {
        socket.emit('disconnect-user')
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
       const listOfMessages = this.state.messages.map( (message, index) => {
            return (
                <div key={index}>
                    <Message image={this.image} message={message} username={this.state.username}/>
                </div>
            );
       });
       return (
            <div className="chat-box">
               <div className="chatbox-header-123">
                    <div className="chatbox-title-456">Chat</div>
                    <div className="close-chatbox-213" onClick={() => {this.props.hideChat()}}>x</div>
                </div> 
                <div className="messages-list">
                    {listOfMessages}
                </div> 
                <div className="user-input-box">
                    <input
                        className="user-input" 
                        onChange={(e) => this.setState({message: e.target.value})}
                        onKeyPress={(e) => e.key === 'Enter' ? this.sendMessage(e) : null}
                        value={this.state.message} 
                    ></input>
                    <FontAwesomeIcon id="send-button" icon={faLocationArrow} size="1x" onClick={e => this.sendMessage(e)} />
                </div>
            </div>
       );
    }
}

export default Chatbox;