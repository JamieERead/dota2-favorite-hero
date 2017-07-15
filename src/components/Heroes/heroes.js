import React, { Component } from 'react';
import axios from 'axios';

function HeroItem(props) {
    const heroName = props.hero.name.replace('npc_dota_hero_', '');
    const heroId = props.hero.id;
    const iconClass = props.hero.favourite ? 'fa fa-star' : 'fa fa-star-o';
    return(
        <li className="hero">
            <i className={iconClass} aria-hidden="true" onClick={() => props.toggleFavouriteHero(heroId)}></i>
            <img src={`http://cdn.dota2.com/apps/dota2/images/heroes/${heroName}_vert.jpg`} alt={heroName} />
        </li>
    );
}

class HeroesList extends Component {
    constructor(){
        super();
        this.state = {
            user: {},
            heroes: [],
            loading: true
        };
    }

    componentWillMount(){
        this.loadHeroes();
    }

    loadHeroes(){
        let user = {};
        axios.get('/user/' + localStorage.getItem('user_id'))
            .then(_user => {
                user = _user.data;
                return axios.get('/heroes');
            })
            .then(({data}) => {
                const heroes = data.result.heroes;
                const favoriteHeroes = (user.user_metadata && user.user_metadata.heroes)
                                    ? user.user_metadata.heroes : [];
                const formattedHeroes = heroes.map(hero => {
                    hero['favourite'] = favoriteHeroes.indexOf(hero.id) !== -1;
                    return hero;
                });
                this.setState({
                    user: user,
                    heroes: formattedHeroes,
                    loading: false
                });
            })
            .catch(function(error) {
              console.log('Request failed', error)
            });
    }

    toggleFavouriteHero = (heroId) => {
        // set the state before the api call
        const heroes = this.state.heroes.slice();
        let currentHero = heroes.find(hero => hero.id === heroId);
        currentHero.favourite = !currentHero.favourite;
        this.setState({heroes: heroes});

        // get all current favourite heroes and call save
        const favoriteHeroes =  heroes.filter(hero => hero.favourite).map(hero => hero.id);
        this.saveHeroes(favoriteHeroes);
    };

    saveHeroes(favoriteHeroes){
        const payload = {
            userId: localStorage.getItem('user_id'),
            data: {user_metadata: {heroes: favoriteHeroes} },
        };
        axios.patch('/update-hero', payload)
            .catch(function(error) {
                console.log('Request failed', error)
            });
    }

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