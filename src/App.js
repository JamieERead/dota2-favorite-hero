import React, { Component } from 'react';
import logo from './logo.svg';
// import {HeroesList} from './components/heroes/Heroes';
import {HEROES} from './components/heroes/AllHeroes';
import './App.css';

function HeroItem(props) {
  console.log(props);
    return <li>{props.hero.name}</li>;
} 

function HeroesList(props) {
    const heroes = props.heroes;
    const listItems = heroes.map((hero) => 
        <HeroItem key={hero.id.toString()} hero={hero} />
    );
    return <ul>{listItems}</ul>;
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <HeroesList heroes={HEROES} />
      </div>
    );
  }
}

export default App;

