import React, { Component } from 'react';
import './app.css';
import HeroesList from '../Heroes/heroes';

class App extends Component {
    goTo(route) {
        this.props.history.replace(`/${route}`)
    }

    login() {
        this.props.auth.login();
    }

    logout() {
        this.props.auth.logout();
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        return (
            <div className="App">
                <nav className="navbar ">
                    <div id="navMenuExample" className="navbar-menu">
                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="field is-grouped">
                                    {
                                        !isAuthenticated() && (
                                            <p className="control">
                                                <a className="button is-primary" onClick={this.login.bind(this)}>
                                                    <span>Log in</span>
                                                </a>
                                            </p>
                                        )
                                    }
                                    {
                                        isAuthenticated() && (
                                            <p className="control">
                                                <a className="button is-primary" onClick={this.logout.bind(this)}>
                                                    <span>Log Out</span>
                                                </a>
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="container">
                    {
                        isAuthenticated() && <HeroesList/>
                    }
                    {
                        !isAuthenticated() && (
                            <h4>
                                You are not logged in! Please{' '}
                                <a
                                    style={{cursor: 'pointer'}}
                                    onClick={this.login.bind(this)}
                                >
                                    Log In
                                </a>
                                {' '}to continue.
                            </h4>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default App;

