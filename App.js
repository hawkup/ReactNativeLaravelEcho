import React from "react";
import Echo from "./Echo";
import { GiftedChat } from "react-native-gifted-chat";

export default class App extends React.Component {
  state = {
    messages: []
  };

  letChat(csrfToken) {
    const echo = new Echo({
      broadcaster: "socket.io",
      host: "http://localhost:6001",
      csrfToken,
      auth: {
        headers: {
          Authorization: "Bearer token"
        }
      }
    });

    echo.private("App.User.1").listen("ChatMessageWasReceived", e => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [
          {
            _id: 2,
            text: e.chatMessage.message,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "React Native",
              avatar: "https://facebook.github.io/react/img/logo_og.png"
            }
          }
        ])
      }));
    });
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://facebook.github.io/react/img/logo_og.png"
          }
        }
      ]
    });

    fetch("http://localhost/csrf")
      .then(response => {
        return response.text().then(function(text) {
          return text;
        });
      })
      .then(csrfToken => {
        this.letChat(csrfToken);
      });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1
        }}
      />
    );
  }
}
