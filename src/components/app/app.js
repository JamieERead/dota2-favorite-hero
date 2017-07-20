import React, { Component } from 'react';
import './app.css';
import Heroes from '../heroes';
import NavBar from '../nav-bar';
import logo from './logo.png';

class App extends Component {

    goTo(route) {this.props.history.replace(`/${route}`)};
    login = () => this.props.auth.login();
    logout = () => this.props.auth.logout();

    render() {
        const { isAuthenticated } = this.props.auth;
        return (
            <div className="App">
                <NavBar isAuthenticated={isAuthenticated} logout={this.logout} />
                <div className="container">
                    {
                        isAuthenticated() && <Heroes />
                    }
                    {
                        !isAuthenticated() && (
                            <div className="has-text-centered">
                                <div><img style={{'max-width': '300px'}} src={logo} alt="Logo" /></div>
                                <a className="button is-primary" style={{cursor: 'pointer', 'margin-top': '30px'}} onClick={this.login.bind(this)}>Log In</a>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default App;

