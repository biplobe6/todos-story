import React, { Component, Fragment } from 'react';
import DurationField from 'Component/Input/DurationField';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: ''
    }
  }

  format(intTime){
    let timeStr = ''
    let time = {
      day: 0,
      hour: 0,
      min: 0,
      sec: intTime,
    }

    const zPad = (num) => {
      if(num < 10){
        timeStr += '0'
      }
    }

    if(time.sec > 86399){
      time.day = parseInt(time.sec / 86400)
      timeStr += time.day + 'd'
      time.sec = time.sec - (time.day * 86400)
    }
    if(time.sec > 3599){
      time.hour = parseInt(time.sec / 3600)
      if(time.day){
        timeStr += ' '
      }
      zPad(time.hour)
      timeStr += time.hour + ':'
      time.sec = time.sec - (time.hour * 3600)
    }
    if(time.sec > 59){
      time.min = parseInt(time.sec / 60)
      zPad(time.min)
      timeStr += time.min + ':'
      time.sec = time.sec - (time.min * 60)
      zPad(time.sec)
      timeStr += time.sec
    } else if (time.hour){
      timeStr += "00:"
      zPad(time.sec)
      timeStr += time.sec
    } else if (time.sec) {
      timeStr += '00:'
      zPad(time.sec)
      timeStr += time.sec
    } else {
      timeStr += '00:00'
    }

    return timeStr
  }

  componentDidMount(){
    const {time} = this.props;
    this.setState({
      time: this.format(time)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.time != this.props.time){
      this.setState({
        time: this.format(this.props.time)
      })
    }
  }

  render(){
    const {time} = this.state;
    return (
      <span onClick={this.props.onClick}>
        {time}
      </span>
    )
  }
}

Clock.defaultProps = {
  onClick: () => {},
}


class Duration extends Component {
  constructor(props) {
    super(props);

    this.startCountdownInterval = this.startCountdownInterval.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.stopCountdownInterval = this.stopCountdownInterval.bind(this);
    this.stopCountdown = this.stopCountdown.bind(this);
    this.toggleEditView = this.toggleEditView.bind(this);
    this.onSubmitDurationEdit = this.onSubmitDurationEdit.bind(this);

    this.timer = null

    this.state = {
      counting: false,
      timeSpan: 0,
      busy: false,
      edit: false,
    }
  }

  componentDidMount() {
    const {todo} = this.props;
    this.setState({
      timeSpan: todo.time_span
    }, () => {
      if(todo.wip){
        this.startCountdownInterval()
      }
    })
  }

  componentWillUnmount() {
    this.stopCountdownInterval()
  }

  componentDidUpdate(prevProps, prevState) {
    const {todo} = this.props;
    if(prevProps.todo.time_span != todo.time_span){
      this.setState({
        timeSpan: todo.time_span
      })
    }
    if(prevProps.todo.wip != todo.wip){
      if(todo.wip){
        this.startCountdownInterval()
      } else {
        this.stopCountdownInterval()
      }
    }
  }

  startCountdownInterval(){
    if(this.state.busy) return;
    if(this.state.counting) return;

    this.setState({
      counting: true
    })

    this.timer = setInterval(() => {
      this.setState(({timeSpan}) => ({
        timeSpan: timeSpan + 1
      }))
    }, 1000)
  }

  startCountdown(){
    if(this.state.busy) return;
    if(this.state.counting) return;

    this.startCountdownInterval()
    this.props.startCountdown(this.props.todo.alias)
  }

  stopCountdownInterval(){
    if(this.state.busy) return;
    if(!this.timer) return;
    if(!this.state.counting) return;

    this.setState({
      counting: false
    })

    clearInterval(this.timer)
    this.timer = null;
  }

  stopCountdown(){
    if(this.state.busy) return;
    if(!this.timer) return;
    if(!this.state.counting) return;

    this.stopCountdownInterval()
    this.props.stopCountdown(this.props.todo.alias)
  }

  toggleEditView(){
    this.setState({
      edit: !this.state.edit
    })
  }

  onSubmitDurationEdit(e){
    this.setState({
      edit: false,
    })
    const {todo} = this.props;
    this.props.updateTodoData({
      alias: todo.alias,
      duration: e.totalSec,
    })
  }


  render() {
    const {todo} = this.props;
    const {counting, timeSpan, edit} = this.state;
    const remaining = (todo.duration - timeSpan)
    return (
      <Fragment>
        {counting ? (
          <span
            className="menu"
            title="Stop countdown"
            onClick={this.stopCountdown}>
            <i className="fa fa-pause-circle-o"></i>
          </span>
        ) : (
          <span
            className="menu"
            title="Start countdown"
            onClick={this.startCountdown}>
            <i className="fa fa-play-circle-o"></i>
          </span>
        )}
        <span className="menu clock duration">
          {edit ? (
            <DurationField
              onClose={this.toggleEditView}
              duration={todo.duration}
              onSubmit={this.onSubmitDurationEdit} />
          ) : (
            <Clock
              time={todo.duration}
              onClick={this.toggleEditView} />
          )}
        </span>
        {(timeSpan > 0) && (
          <Fragment>
            <span className="menu clock countdown">
              {(remaining < 0) && (
                '+'
              )}
              <Clock time={remaining > -1 ? remaining : remaining * -1} />
            </span>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default Duration;
