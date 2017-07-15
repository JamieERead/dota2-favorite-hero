import React, { Component } from 'react';

class NavBar extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <nav className="navbar">
                <div id="navMenuExample" className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                {
                                    this.props.isAuthenticated() && (
                                        <p className="control">
                                            <a className="button is-primary" onClick={() => this.props.logout()}>
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
        )
    }
}

export default NavBar;