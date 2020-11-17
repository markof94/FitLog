import React from 'react'
import styled from 'styled-components'
import { InstantRemixing, FeedSdk } from '@withkoji/vcc'
import SettingsIcon from '@material-ui/icons/Settings'
import Linkify from 'react-simple-linkify'
import PersonIcon from '@material-ui/icons/Person'

const Container = styled.div`
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

  ${props => props.disabled && `
    pointer-events: none;
  `}
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
  margin: 10px 0;
  font-size: 14px;

  ${props => props.isSameUserAsBefore && `
    margin-top: -4px;
  `}
  
`;

const Name = styled.div`
    font-weight: bold;
    opacity: 0.65;
    font-size: 15px;
    line-height: 1.1;
    margin-bottom: 2px;

    ${props => props.isCurrentUser && `
      color: ${props.color};
    `}
`;

const Body = styled.div`
    font-size: 16px;
    font-weight: normal;
    line-height: 1.05;

    a{
      &:visited{
        color: inherit;
      }
      
      &:link{
        color: inherit;
      }
    }

    ${props => props.isCurrentUser && `
      color: ${props.color};
      opacity: 0.85;
    `}
`;

const NameEdit = styled.input`
    font-weight: bold;
    outline: none;
    border: 1px dashed rgba(255, 255, 255, 0.35);
    border-radius: 5px;
    padding: auto 6px;
    color: inherit;
    font-family: inherit;
    font-size: 16px;
    pointer-events: auto;
    background: transparent;
   
`;

const BodyEdit = styled(NameEdit)`
    font-size: 16px;
    font-weight: normal;
    line-height: 1.1;
    margin-top: 8px;
    width: 100%;
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
`;

const NameInputContainer = styled.div`
    position: absolute; 
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NameInputWrapper = styled.div`
    div{
      font-size: 20px;
      color: #FFFFFF;
      text-align: center;
      margin-bottom: 4px;
    }

    input{
        margin-bottom: 4px;
        border: 0;
        outline: none;
        width: 100%;
        padding: 0 8px;
        font-size: 18px;
        border-radius: 4px;
        padding: 8px;
    }
`;

const Button = styled.div`
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
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;

      &:active{
        transform: translateY(4px);
      }

      svg{
        color: inherit;
        font-size: 18px;
      }
`;

const OnlineLabel = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  left: 28px;
  top: 0;
  padding: 0;
  background: ${props => props.color};
  z-index: 0;
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 0 0 4px 0;

  svg{
    font-size: 18px;
    margin-right: 4px;
  }
`;

function isLocalStorageAvailable() {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

let isStorageAvailable = false;

class Chatbox extends React.Component {
  instantRemixing = new InstantRemixing();
  dispatch = this.props.dispatch;
  messagesEnd = React.createRef();
  nameInput = React.createRef();

  state = {
    theme: this.instantRemixing.get(['general', 'theme']),
    isLoading: true,
    message: "",
    name: "Anonymous",
    tempName: "Anonymous",
    showNameInput: false,
    hasSetName: false,
    welcomeName: "",
    welcomeMessage: ""
  }

  componentDidMount() {
    isStorageAvailable = isLocalStorageAvailable();

    let name = "Anonymous";

    if (isStorageAvailable) {
      const storageName = localStorage.getItem("name");
      if (storageName && storageName !== "") name = storageName;
    }

    this.setState({
      welcomeName: this.instantRemixing.get(['general', 'welcomeName']),
      welcomeMessage: this.instantRemixing.get(['general', 'welcomeMessage']),
      name
    })
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

  onChangeWelcomeName = (welcomeName) => {
    if (welcomeName.length > 40) return;
    this.setState({ welcomeName })
  }

  onChangeWelcomeMessage = (welcomeMessage) => {
    if (welcomeMessage.length > 150) return;
    this.setState({ welcomeMessage })
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  onChangeName = (tempName) => {
    if (tempName.length > 40) return;
    this.setState({ tempName })
  }

  onSubmitName = (e) => {
    e.preventDefault();
    const oldName = this.state.name;
    const name = this.state.tempName;
    if (name === "") return;

    this.setState({ showNameInput: false, hasSetName: true, name })
    this.dispatch.emitEvent('name_change', ({ oldName, newName: name }))

    if (isStorageAvailable) localStorage.setItem("name", name)
  }

  render() {
    const {
      theme,
      isRemix,
      onSet,
      usersOnline,
      messages
    } = this.props;

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

    const color = theme ? themeColors[theme] : '#2D2F30';

    return (
      <Container
        color={color}
        disabled={isRemix}
      >
        <MessageWrapper

        >
          {messages.map((message, i) => {
            const isCurrentUser = message.name === this.state.name && this.state.name !== "Anonymous";
            const isSameUserAsBefore = (i > 0) && (messages[i - 1].name === message.name) && message.name !== "Anonymous";

            if (isRemix) {
              return (
                <Message
                  key={i}
                >
                  <div style={{ marginBottom: "8px" }}>{"Welcome message"}</div>
                  <NameEdit
                    value={this.state.welcomeName}
                    type={"text"}
                    placeholder={"Name (optional)"}
                    onBlur={() => onSet('welcomeName', this.state.welcomeName)}
                    onChange={(e) => this.onChangeWelcomeName(e.target.value)}
                  />
                  <BodyEdit
                    value={this.state.welcomeMessage}
                    type={"text"}
                    placeholder={"Message"}
                    onBlur={() => onSet('welcomeMessage', this.state.welcomeMessage)}
                    onChange={(e) => this.onChangeWelcomeMessage(e.target.value)}
                  />
                </Message>
              )
            } else {
              return (
                <Message
                  key={i}
                  isSameUserAsBefore={isSameUserAsBefore}
                >
                  {
                    message.name !== "" && !isSameUserAsBefore &&
                    <Name
                      isCurrentUser={isCurrentUser}
                      color={color}
                    >
                      {`${message.name}:`}
                    </Name>
                  }

                  <Body
                    isCurrentUser={isCurrentUser}
                    color={color}
                    style={
                      message.name === "" ?
                        {
                          fontStyle: 'italic'
                        } : {}
                    }
                  >
                    <Linkify>
                      {message.text}
                    </Linkify>
                  </Body>

                </Message>
              )
            }
          })}

          <div ref={this.messagesEnd} />
        </MessageWrapper >

        <InputWrapper
          color={color}
        >
          <form
            onSubmit={(e) => this.onSubmit(e)}
          >
            <input
              value={this.state.message}
              onChange={(e) => this.onChange(e)}
              placeholder={"Type your message..."}
            />
            <Button
              onClick={(e) => this.onSubmit(e)}
              color={color}
            >
              {"Send"}
            </Button>
          </form>
        </InputWrapper>

        {
          !isRemix &&
          <Button
            color={color}
            onClick={() => { this.setState({ showNameInput: true }, () => this.nameInput.current.select()) }}
            style={{
              position: 'absolute',
              left: '0',
              top: '0',
              bottom: 'auto',
              height: 'auto',
              borderRadius: '4px 0 4px 0',
              padding: '8px'
            }}
          >
            <SettingsIcon />
          </Button>
        }

        {
          this.state.showNameInput &&
          <NameInputContainer>
            <NameInputWrapper>
              <form
                onSubmit={(e) => { this.onSubmitName(e) }}
              >
                <input
                  value={this.state.tempName}
                  onChange={(e) => this.onChangeName(e.target.value)}
                  ref={this.nameInput}
                />
                <Button
                  color={color}
                  onClick={(e) => { this.onSubmitName(e) }}
                  style={{
                    borderRadius: "4px"
                  }}
                >
                  {"Set Name"}
                </Button>
              </form>

            </NameInputWrapper>
          </NameInputContainer>
        }

        {
          !isRemix &&
          <OnlineLabel
            color={color}
          >
            <PersonIcon />
            {usersOnline}
          </OnlineLabel>
        }
      </Container >
    );
  }
}

export default Chatbox;
