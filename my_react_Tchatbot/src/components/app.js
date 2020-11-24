import React from 'react';
import Bot from './bot';
import Message from './message';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux'

import './app.css';

/**
 * App
 * @return {jsx} result
 */


const App = ({ data }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <ListItem className="botNameSelected">
          <ListItemText primary=
            {data.filter(bot => bot.checked===true).map(item => {
              return item.name;
            })}
          />
        </ListItem>
      </Grid>
      <Grid item xs={4}>
        <List aria-label="list of bot">
          <Bot/>
        </List>
      </Grid>
        <Grid item xs={8}>
          <Message botC={data.filter(bot => bot.checked===true)}/>
      </Grid>
    </Grid>
  )
}

//export default App 
const mapStateToProps = state => ({
  data: state.bot
})

export default connect(
  mapStateToProps
)(App)
