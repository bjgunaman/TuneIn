import React from 'react';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { fas } from '@fortawesome/free-solid-svg-icons';
import './Chatbox.css';
let socket;
class Chatbox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            room: '',
            userInput: '',
            messages: []
        }
        console.log("ez clap")
        socket = props.initSocket;//io('localhost:8080');
        console.log("socket:",socket);
        this.sendMessage = this.sendMessage.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    async componentDidMount() {
        await this.setState({username: 'Lmao'});
        await this.setState({room: '100'});
        //console.log(this.state.username);
        socket.emit('joining', {username: this.state.username, room: this.state.room});
        //console.log("joining");
        socket.on('serverMessage', (receivedMessage) => {
            this.setState({messages: [...this.state.messages, receivedMessage]});
        })
        socket.on('broadcastedMessage', (receivedMessage) => {
            console.log("received Message:")
            console.log(receivedMessage);
            this.setState({messages: [...this.state.messages, receivedMessage]});
            console.log('broadcastMessage');
            console.log(this.state.messages);
        })
        //console.log(this.state.username);
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
                    <Message message={message} username={this.state.username}/>
                </div>
            );
       });
       return (
            <div className="chat-box">
               <div className="chatbox-header-123">
                    <div className="chatbox-title-456">Chat</div>
                    <div className="close-chatbox-213">x</div>
                </div> 
                <div className="messages-list">
                    <ScrollToBottom >
                        {listOfMessages}
                    </ScrollToBottom>
                </div> 
                <div className="user-input-box">
                    <input
                        className="user-input" 
                        onChange={(e) => this.setState({message: e.target.value})}
                        onKeyPress={(e) => e.key === 'Enter' ? this.sendMessage(e) : null}
                        value={this.state.message} 
                    ></input>
                    <div id="send-button" onClick={e => this.sendMessage(e)}>send</div>
                </div>
            </div>
       );
    }
}

export default Chatbox;