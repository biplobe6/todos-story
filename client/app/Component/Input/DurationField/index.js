import React, { Component, createRef } from 'react';

const InputField = ({placeholder, name, value, onChange, onKeyPress, refHandler}) => {
  return (
    <input
      min="0"
      step="1"
      type="number"
      value={value}
      ref={refHandler}
      name={name}
      title={placeholder}
      onChange={onChange}
      onKeyDown={onKeyPress}
      placeholder={placeholder} />
  );
}

InputField.defaultProps = {
  refHandler: () => {},
}

class DurationField extends Component {
  constructor(props) {
    super(props);

    this.hourElem = createRef()
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);

    this.state = {
      hour: 0,
      min: 0,
      sec: 0,
      totalSec: 0,
    }
  }

  onKeyPress(e){
    if(e.key == 'Escape' && this.props.onClose){
      this.props.onClose({
        ...this.state,
        type: 'close'
      })
    }
    if(e.key == "Enter" && this.props.onSubmit){
      this.props.onSubmit({
        ...this.state,
        type: 'submit'
      })
    }
  }

  onChange(e){
    const {name} = e.target;
    const value = parseFloat(e.target.value)

    const time = {
      hour: this.state.hour,
      min: this.state.min,
      sec: this.state.sec,
      [name]: value,
      totalSec: 0,
    }
    time.totalSec = (time.hour * 3600) + (time.min * 60) + time.sec

    this.setState({
      [name]: value,
      totalSec: time.totalSec,
    })

    if(this.props.onChange){
      this.props.onChange({
        ...time,
      })
    }
  }

  format(timeInt){
    const time = {
      hour: 0,
      min: 0,
      sec: timeInt,
      totalSec: 0,
    }

    time.hour = parseInt(time.sec / 3600)
    time.sec = time.sec - (time.hour * 3600)
    time.min = parseInt(time.sec / 60)
    time.sec = time.sec - (time.min * 60)
    time.totalSec = (time.hour * 3600) + (time.min * 60) + time.sec

    return time
  }

  componentDidMount() {
    this.setState({
      ...this.format(this.props.duration)
    })
    this.hourElem.current.focus()
  }

  componentDidUpdate(prevProps, prevState) {
    const {duration} = this.props;
    if(prevProps.duration != duration){
      this.setState({
        ...this.format(duration)
      })
    }
  }

  render(){
    const {hour, min, sec} = this.state;
    return (
      <div className="duration-field">
        <InputField
          name="hour"
          value={hour}
          refHandler={this.hourElem}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          placeholder="Hour" />
        <InputField
          name="min"
          value={min}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          placeholder="Min" />
        <InputField
          name="sec"
          value={sec}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          placeholder="Sec" />
      </div>
    )
  }
}

export default DurationField
