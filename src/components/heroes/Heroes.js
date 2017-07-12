import React, { Component } from 'react';

function HeroItem(props) {
    return <li>{props.hero}</li>;
} 

function HeroesList(props) {
    const heroes = props.heroes;
    const listItems = heroes.map(hero => {
        <HeroItem key={hero.id.toString()} hero={hero} />
    });
    return <ul>{listItems}</ul>;
}

export default HeroesList;