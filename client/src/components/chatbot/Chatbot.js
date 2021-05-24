import React, { Component } from "react";
import axios from "axios";
import Message from "./Message";
import Card from "./Card";

class Chatbot extends Component {
  // Creating react references to elements
  messagesEnd;
  chatInput;

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      showBot: false,
      botName: 'Chatbot'
    };

    //Binding event listeners
    this.toggleBot = this.toggleBot.bind(this);
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
  }

  resolveAfterXSeconds(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time * 1000);
    });
  }

  // Scroll to latest message
  componentDidUpdate() {
    if(this.state.showBot) {
      this.messagesEnd.scrollIntoView({ behaviour: "smooth" });
    }
    if (this.chatInput) {
      this.chatInput.focus();
    }
  }
  
  // Function to send text query to server
  async df_text_query(text) {
    let says = {
      speaks: "me",
      message: {
        text: {
          text
        }
      }
    };
    this.setState({
      messages: [...this.state.messages, says]
    });
    console.log(says)
  // Check Text Values
  switch(text) {
    // If
    case text = "set darkmode":
      // code block

      break;
    // If
    case text = "set lightmode":
      // code block

      break;
    // If
    default:
      // code block
      const res = await axios.post("/api/df_text_query", {
        text,
        userID: 1
      });
      // Give Res To UI
      res.data.fulfillmentMessages.forEach(message => {
        says = {
          speaks: "bot",
          message
        };
        this.setState({
          messages: [...this.state.messages, says]
        });
      });
    }
  };

  //Helper functions
  isNormalMessage(message) {
    return message.message && message.message.text && message.message.text.text;
  }

  isMessageCard(message) {
    return (
      message.message &&
      message.message.payload &&
      message.message.payload.fields &&
      message.message.payload.fields.cards
    );
  }

  // RENDER FUNCTIONS
  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }

  renderOneMessage(message, i) {
    if (this.isNormalMessage(message)) {
      return (
          <Message
            key={i}
            speaks={message.speaks}
            text={message.message.text.text}
          />
      );
    } else if (this.isMessageCard(message)) {
      return (
        <div key={i}>
          <div className="container">
            <div
              style={{
                height: 200,
                width:
                  message.message.payload.fields.cards.listValue.values.length * 150,
                paddingLeft: '12%'
              }}
            >
              {this.renderCards(
                message.message.payload.fields.cards.listValue.values
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  //Renders all the messages
  renderMessages(stateMessages) {
    if (stateMessages) {
      return stateMessages.map((message, i) => {
        return this.renderOneMessage(message, i);
      });
    }
    return null;
  }

  // Open/Close Message box
  toggleBot() {
    this.setState({ showBot: !this.state.showBot });
  }

  // EVENT LISTENERS
  _handleInputKeyPress(e) {
    if (e.key === "Enter" && e.target.value !== "") {
      this.df_text_query(e.target.value);
      e.target.value = "";
    }
  }

  render() {
    const { showBot, botName } = this.state;

    if (showBot) {
      return (
        <div
          style={{
            height: 500,
            width: 450,
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 1000
          }}
        >
          <nav>
            <div id="chatwindow-nav" className="nav-wrapper">
              <span>{ botName }</span>
              <span className="close" onClick={this.toggleBot}>x</span>
            </div>
          </nav>
          <div
            id="chatbot"
            style={{ height: '375px', width: "100%", overflow: "auto", backgroundColor: "white" }}
          >
            {this.renderMessages(this.state.messages)}
            <div
              ref={el => {
                this.messagesEnd = el;
              }}
              style={{ float: "left", clear: "both" }}
            />
          </div>
            <input
              type="text"
              ref={input => {
                this.chatInput = input;
              }}
              style={{
                paddingLeft: '1%',
                paddingRight: '1%',
                width: '98%',
                backgroundColor: "white",
                color: "#222222",
                borderTop: '1px solid lightgrey',
                marginBottom: 0
              }}
              placeholder="Start Talking to the bot!"
              onKeyPress={this._handleInputKeyPress}
            />
          
        </div>
      );
    } else {

      return (
        <div
          style={{
            width: 450,
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 1000
          }}
        >
          <nav onClick={this.toggleBot}>
            <div id="chatwindow-nav" className="nav-wrapper">
            </div>
          </nav>
        </div>
      );
    }
  }
}

export default Chatbot;