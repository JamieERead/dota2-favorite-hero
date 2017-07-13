import React, { Component } from 'react';
import axios from 'axios';

function HeroItem(props) {
    const heroName = props.hero.name.replace('npc_dota_hero_', '');
    return(
        <li className="hero">
            <i className="star fa fa-star-o" aria-hidden="true" onClick={props.favoriteHero}></i>
            <img src={`http://cdn.dota2.com/apps/dota2/images/heroes/${heroName}_vert.jpg`} />
        </li>
    );
}

export default class HeroesList extends Component {
    constructor(){
        super();
        this.state = {heroes: [], loading: true};
    }

    componentWillMount(){
        this.loadHeroes();
    }

    loadHeroes(){
        axios.get('https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?key=3D7D20701E1BA0C6C66D11A76D95FA58')
            .then(({data}) => {
                this.setState({
                    heroes: data.result.heroes,
                    loading: false
                });
            })
            .catch(function(error) {
              console.log('Request failed', error)
            });

    }

    favoriteHero = () => {
        console.log('favoriteHero')
    }

    render() {
        const heroes = this.state.heroes;
        let listItems = [];
        if(!this.state.loading){
            listItems = heroes.map((hero) =>
                <HeroItem key={hero.id.toString()} hero={hero} favoriteHero={this.favoriteHero}/>
            );
        }
        return <ul className="heros">{listItems}</ul>;
    }
}

// export default HeroesList;