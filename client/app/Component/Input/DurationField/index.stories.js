import { storiesOf } from '@storybook/react';
import React, { Component } from 'react';

import "Styles/_duration-field.scss"
import DurationField from '.';



class App extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);

    this.state = {
      duration: 5430
    }
  }

  onChange(time){
    console.log(time)
    this.setState({
      duration: time.totalSec
    })
  }

  onChangeInput(e){
    const {value} = e.target;
    this.setState({
      duration: value
    })
  }

  onSubmit(e){
    console.log(e)
  }

  render(){
    const {duration} = this.state;
    return (
      <div>
        <h2>Duration Field</h2>
        <strong>Duration: </strong>
        <input
          type="number"
          min="0"
          step="1"
          value={duration}
          onChange={this.onChangeInput} />
        <hr/>
        <DurationField
          duration={duration}
          onChange={this.onChange}
          onClose={this.onSubmit}
          onSubmit={this.onSubmit} />
      </div>
    );
  }
}

storiesOf('Input Field/Duration', module)
  .add('default', () => (
    <App />
  ))
