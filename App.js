import React from "react";
import Echo from "./Echo";
import { GiftedChat } from "react-native-gifted-chat";

fetch("http://localhost/csrf")
  .then(response => {
    return response.text().then(function(text) {
      return text;
    });
  })
  .then(csrfToken => {
    console.log(csrfToken);
    letChat(csrfToken);
  });

function letChat(csrfToken) {
  const echo = new Echo({
    broadcaster: "socket.io",
    host: "http://localhost:6001",
    csrfToken,
    auth: {
      headers: {
        Authorization: "Bearer blahblah"
      }
    }
  });

  echo.private("App.User.1").listen("ChatMessageWasReceived", e => {
    console.log(e);
  });
}

export default class App extends React.Component {
  state = {
    messages: []
  };

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
