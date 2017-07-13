import React, { Component } from 'react';
import axios from 'axios';

function HeroItem(props) {
    const heroName = props.hero.name.replace('npc_dota_hero_', '');
    const heroId = props.hero.id;
    const iconClass = props.hero.favourite ? 'fa fa-star' : 'fa fa-star-o';
    return(
        <li className="hero">
            <i className={iconClass} aria-hidden="true" onClick={() => props.toggleFavouriteHero(heroId)}></i>
            <img src={`http://cdn.dota2.com/apps/dota2/images/heroes/${heroName}_vert.jpg`} />
        </li>
    );
}

class HeroesList extends Component {
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
                const heroes = data.result.heroes;
                heroes.forEach(hero => hero['favourite'] = false);
                this.setState({
                    heroes: heroes,
                    loading: false
                });
            })
            .catch(function(error) {
              console.log('Request failed', error)
            });
    }

    toggleFavouriteHero = (heroId) => {
        // API call to save
        const heroes = this.state.heroes.slice();
        let currentHero = heroes.find(hero => hero.id === heroId);
        currentHero.favourite = !currentHero.favourite;
        this.setState({heroes: heroes});
    };

    render() {
        const heroes = this.state.heroes;
        let listItems = [];
        if(!this.state.loading){
            listItems = heroes.map((hero) =>
                <HeroItem key={hero.id.toString()} hero={hero} toggleFavouriteHero={this.toggleFavouriteHero}/>
            );
        }
        return <ul className="heros">{listItems}</ul>;
    }
}

export default HeroesList;