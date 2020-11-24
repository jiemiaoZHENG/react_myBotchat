import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  FormGroup, 
  FormControlLabel
} from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import store from '../../store'
import './index.css';
import { taskBot } from './actions'

const Bot = ({ data }) => {
  return (
    <div className="Bot">
      <FormGroup>
        {data.map(item => <Item
          key={item.id}
          item={item}
        />)}
      </FormGroup>
    </div>
  )
}
  
class Item extends Component {
  constructor() {
    super()

    this.dispatch = store.dispatch
    this.onHandleClick = this.onHandleClick.bind(this)
  }

  onHandleClick() {
    const { id } = this.props.item

    this.dispatch(taskBot(id))
  }

  render() {
    const { item } = this.props
    const { name, fname } = item

    return <FormControlLabel
      control={
        <ListItem button 
          onClick={this.onHandleClick}>
          <ListItemAvatar>
      <Avatar id="botAvatar">{fname}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={name} />
        </ListItem>
      }
    />
  }
}

const mapStateToProps = state => ({
  data: state.bot
})

export default connect(
  mapStateToProps
)(Bot)