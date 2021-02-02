import React from 'react';

class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            on: false,
            startTime: 0,
            timeLeft: 25 * 60 * 1000
        };

        this.handleTaskTitleChange = this.handleTaskTitleChange.bind(this);
        this.handleTimerStart = this.handleTimerStart.bind(this);
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(), 1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState(
            { date: new Date() }
        );
    }

    endTime(startTime) {
        return startTime;
        //TODO:
        //return startTime.setMinutes(startTime.getMinutes() + 25);
    }

    handleTaskTitleChange(event) {
        this.setState({ taskTitle: event.target.value });
    }

    handleTimerStart(event) {
        alert('A task was started: ' + this.state.taskTitle);
        //this.startTimer();
        this.props.handleTimerStart(this.state.taskTitle, this.state.startTime, this.endTime(this.state.startTime));
        event.preventDefault();
    }

    startTimeTimer = () => {
        this.setState({
            on: true,
            timeLeft: this.state.timeLeft,
            startTime: this.state.timeLeft
        });
        this.timer = setInterval(() => {
            const newTime = this.state.timeLeft - 10;
            if (newTime >= 0) {
                this.setState({
                    timeLeft: newTime
                });
            } else {
                clearInterval(this.timer);
                this.setState({
                    on: false,
                    timeLeft: 25 * 60 * 1000
                });
                alert("Countdown ended");
            }
        }, 1000);
    };

    render() {
        const { date, on, timeLeft } = this.state;
        let seconds = ("0" + (Math.floor((timeLeft / 1000) % 60) % 60)).slice(-2);
        let minutes = ("0" + Math.floor((timeLeft / 60000) % 60)).slice(-2);
        //let hours = ("0" + Math.floor((timeLeft / 3600000) % 60)).slice(-2);

        return (
            <div class="container">
                <div class="row">
                    <div class="col-sm">
                        {date.toLocaleTimeString()}
                    </div>
                    <div class="col-sm">
                        {minutes} : {seconds}
                    </div>
                    <div class="col-sm">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="floatingInput" placeholder="What do you want to work on?" onChange={this.handleTaskTitleChange} />
                        </div>
                    </div>
                    <div class="col-sm">
                        {on === false && (
                            <button type="button" class="btn btn-primary" onClick={this.handleTimerStart}>startTime</button>
                        )}
                        {on === true && (
                            <button type="button" class="btn btn-primary" disabled>startTime</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Timer;
