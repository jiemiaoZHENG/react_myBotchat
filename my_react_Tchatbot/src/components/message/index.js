import React, { Component, createRef, useState } from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import {
  FormGroup
} from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Input from '@material-ui/core/Input';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import YouTube from 'react-youtube';

import store from '../../store'
import { taskMessage } from './actions'
import './index.css';

var socket = io("http://localhost:3000",{transports: ['websocket']});

const scrollDiv = createRef();
const scrollSmoothHandler = () => {
  scrollDiv.current.scrollIntoView({ behavior: "smooth" });
};

const dispatch = store.dispatch;
socket.on('message_content', function(msg){
  dispatch(taskMessage(msg.group, msg.content));
  scrollSmoothHandler();
});

socket.on('youtube_content', function(msg){
  dispatch(taskMessage(msg.group, msg.content));
  scrollSmoothHandler();
});

socket.on('localtime', function(msg){
  dispatch(taskMessage(msg.group, msg.content));
  scrollSmoothHandler();
});

socket.on('meteo_content', function(msg){
  dispatch(taskMessage(msg.group, msg.content));
  scrollSmoothHandler();
});

socket.on('imdb_content', function(msg){
  dispatch(taskMessage(msg.group, msg.content));
  scrollSmoothHandler();
});

const Message = ({ dataMessage }) => {
  const [idSession, setIdSession] = useState("0");
  socket.on('session_id', function(id){
    setIdSession(id);
  });
  return (
    <div className="container">
      <div className="row" id="containerList">
        <List id="messageList">
          <FormGroup>
              {dataMessage.map(itemMsg => {        
                  return (<MessageItem
                    key={itemMsg.content}
                    itemMsg={itemMsg}
                    idSession={idSession}
                    />)
              })}
              <ListItem id="lastItem" ref={scrollDiv}/>
          </FormGroup>
        </List>
        <InputItem idSession={idSession}/>
      </div>
    </div>
  )
}

class MessageItem extends Component {
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  render() {
    const { itemMsg } = this.props
    const { group } = itemMsg
    const idSession = this.props.idSession
    const { content } = itemMsg

    if (group === idSession){
      return <FormControl>
          <ListItem class="msgUser">
            <div class="card-right">
            <Card >
              <Typography>{content}
              </Typography>
            </Card></div>
            <div class="avatar-right"><Avatar/></div>
          </ListItem>
        </FormControl>
    }else if (group === "youtube"){
      const opts = {
        height: '280',
        width: '470',
        playerVars: {
          autoplay: 1,
        },
      };
      return <FormControl>
            <Card>
            <Avatar/>
            {content.map(item => {        
                return (<ListItem>
                  <CardContent>
                    <Typography paragraph>{item.title}</Typography>
                    <Typography>
                      <YouTube videoId={item.url} opts={opts} onReady={this._onReady} />
                    </Typography>
                  </CardContent>
                </ListItem>
              )}
            )}
            </Card>
        </FormControl>
    }else if (group === "meteo"){
      return  <FormControl>
                <Avatar/>
                <ListItem>
                  <Card id="meteo_card">
                    <CardHeader title={content[0].cityName} subheader={content[0].localtime} />
                    <CardContent id="meteo_content">
                      <Typography paragraph variant="h3" component="h2">{content[0].temperature}°C</Typography>
                      <Typography paragraph>{content[0].weather_descriptions}</Typography>
                      <Typography paragraph>{content[0].region}</Typography>
                      <Typography paragraph>{content[0].country}</Typography>
                    </CardContent>
                  </Card> 
                </ListItem>
              </FormControl>
    }else if (group === "imdb"){
      return <FormControl>
            <Card>
            <Avatar/>
            {content.map(item => {        
                return (<ListItem>
                  <CardMedia image={item.urlImg} />
                  <CardContent id="meteo_content">
                    <Typography paragraph variant="h5">{item.title} | {item.year} | {item.type}</Typography>
                    <img src={item.urlImg} alt={item.title}/>
                  </CardContent>
                </ListItem>
              )}
            )}
            </Card>
        </FormControl>
    }else{
      return <FormControl>
          <ListItem>
              <Avatar/>
            <Card>
              <Typography>{content}
              </Typography>
            </Card> 
          </ListItem>
        </FormControl>
    }
  }
}

class InputItem extends Component {

  constructor() {
    super()
    this.state = {value:'', idUser:'555'}
    this.keyPress = this.keyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  keyPress(event){
    if(event.keyCode === 13 && this.state.value !== ""){
      const group = this.props.idSession;
      socket.emit('message_send', { content: this.state.value, group: group});
      this.setState({value:""});
      scrollSmoothHandler();
    }
  } 
  
  render() {
    
    return (
      <FormControl fullWidth id="messageInput">
        <Input value={this.state.value} onKeyDown={this.keyPress} onChange={this.handleChange} placeholder="Envoyer un message"/>
      </FormControl>
    );
  }
}

const mapStateToProps = state => ({
  dataBot: state.bot,
  dataMessage: state.message
})

export default connect(
  mapStateToProps
)(Message)