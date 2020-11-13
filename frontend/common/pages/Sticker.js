import React from 'react'
import styled from 'styled-components'
import { InstantRemixing, FeedSdk } from '@withkoji/vcc'

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: transparent;
  color: #fafafa;

  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`;

const Wrapper = styled.div`
  position: relative;
  width: 95%;
  height: 95%;

  border: 2px solid ${props => props.color};
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const MessageWrapper = styled.div`  
    position: relative;
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
`;

const Message = styled.div`
  width: 100%;
  padding: 0 12px;
  margin: 8px 0;
  font-size: 14px;
`;

const Body = styled.div`
    font-size: 16px;
    font-weight: normal;
    line-height: 1.1;
`;

const Name = styled.div`
    font-weight: bold;
`;

const InputWrapper = styled.div`
    position: relative;
    outline: none;
    border: 0;
    
    width: 100%;
    border-top: 2px solid ${props => props.color};

    form{
      display: flex;
    }
    
    input{
      border: 0;
      outline: none;
      width: 100%;
      padding: 0 8px;
      font-size: 18px;
    }

    button{
      outline: none;
      border: 0;
      color: #FFFFFF;
      background-color: ${props => props.color};
      font-size: 18px;
      height: 100%;
      width: auto;
      padding: 8px 16px;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.1s ease;

      &:active{
        transform: translateY(4px);
      }
    }
`;

class SceneRouter extends React.Component {
  instantRemixing = new InstantRemixing();
  dispatch = this.props.dispatch;
  messagesEnd = React.createRef();

  state = {
    theme: this.instantRemixing.get(['general', 'theme']),
    isLoading: true,
    message: "",
    name: "Anon"
  }


  componentDidMount() {
    // Initialize the FeedSdk
    this.feed = new FeedSdk();
    this.feed.load();
  }

  scrollToBottom = () => {
    this.messagesEnd.current.scrollIntoView({ behavior: "smooth" })
  }

  onChange = (e) => {
    this.setState({ message: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault();

    if (this.state.message === "") return;

    const message = {
      text: this.state.message,
      name: this.state.name
    }

    this.dispatch.emitEvent('new_message', (message));

    this.setState({ message: "" })
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  render() {
    const {
      theme,
    } = this.state;

    let themeColors = {
      'default': '#2D2F30',
      'red': '#EB5757',
      'orange': '#F2994A',
      'yellow': '#FCBA04',
      'green': '#27AE60',
      'blue': '#2D9CDB',
      'violet': '#BB6BD9',
      'rainbow1': '#9063F4',
      'rainbow2': '#938DCE'
    };
    const color = theme ? themeColors[theme] : '#2D2F30'

    return (
      <Container

      >
        <Wrapper
          color={color}
        >

          <MessageWrapper

          >
            {this.props.messages.map((message, i) => {
              return (
                <Message
                  key={i}
                >
                  <Name>{message.name}:</Name>
                  <Body>{message.text}</Body>
                </Message>
              )
            })}

            <div ref={this.messagesEnd} />
          </MessageWrapper>




          <InputWrapper
            color={color}
          >
            <form
              onSubmit={(e) => this.onSubmit(e)}
            >
              <input
                value={this.state.message}
                onChange={(e) => this.onChange(e)}
              />
              <button
                onClick={(e) => this.onSubmit(e)}
              >
                {"Send"}
              </button>
            </form>
          </InputWrapper>



        </Wrapper>

      </Container>
    );
  }
}

export default SceneRouter;
