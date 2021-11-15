import React from 'react';
import socketClient from "socket.io-client";

const SERVER = "localhost:8080";

export class App extends React.Component {
    state = {
        socket: null,
        input_value: '',
        messages: []
    }
  
    componentDidMount() {
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = socketClient (SERVER);

        socket.on('connection', () => {
            console.log("%cNew user conected!", "color: orange")  
        });

        socket.on('message', message => {
            console.log("%cSend menssage!", "color: green");

            let messages = this.state.messages;
            messages.push(message);
            this.setState({ messages });
        });
        
        this.socket = socket;
    }

    send = () => {
        if (this.state.input_value && this.state.input_value !== '') {
            let text = this.state.input_value;
            
            this.socket.emit('send-message', {value: text});

            this.setState({ input_value: '' });
        }
    }

    handleInput = e => {
        this.setState({ input_value: e.target.value });
    }

    render() {
        return (
            <main>
                <ul>{
                    this.state.messages.map((item, index) => {
                        return <li key={index}> {item.value}</li>
                    })}
                </ul>

                <div>
                    <input type="text" onChange={this.handleInput} value={this.state.input_value} />
                    <button onClick={this.send}>Send</button>
                </div>
            </main>
        )
    }
}