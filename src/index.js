import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Navbar extends React.Component {
  render() {
    return (
      <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="logo192.png" alt="logo" width="30" height="30" class="d-inline-block align-top" />
              pomodoro
          </a>
        </div>
      </nav>
    )
  }
}

class Footer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <footer class="footer mt-auto py-3 bg-light">
        <div class="container">
          <span class="me-auto text-muted">Version: {this.props.version}</span>
        </div>
      </footer>
    )
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
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

  render() {
    return (
      <div>
        <h1>Welcome</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { version: "0.0.1" }
  }

  render() {
    return (
      <div>
        <Navbar />
        <Clock />
        <Footer version={this.state.version} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
