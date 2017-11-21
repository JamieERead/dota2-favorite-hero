import React, { Component } from 'react';
import './app.css';
import NavBar from '../nav-bar';

export default class App extends Component {

    render() {
        return (
            <div className="App">
                <NavBar />
                <div className="container">
                </div>
            </div>
        );
    }
}


