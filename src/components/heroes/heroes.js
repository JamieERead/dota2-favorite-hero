import React, { Component } from 'react';
import axios from 'axios';

class FavouriteFilterBar extends Component {
    constructor(props){
        super(props);
    }

    handleFilterChange = (value) => {
        this.props.onFavouriteFilterChange(value);
    };

    render(){
        const filterList = [
            {id: 'all', name: 'ALL'},
            {id: 'not-favourite', name: 'NOT STARED'},
            {id: 'favourite', name: 'STARED'}
        ];

        let filters = [];

        const currentFilter = this.props.favouriteFilter;
        filterList.forEach(filter => {
            const className = filter.id === currentFilter ? 'selected' : '';
            filters.push(<a key={filter.id} onClick={() => this.handleFilterChange(filter.id)} className={className}>{filter.name}</a>);
        });

        return (
            <div className="favourite-filter-bar">{filters}</div>
        )
    }

}

function HeroItem(props) {
    const heroName = props.hero.name.replace('npc_dota_hero_', '');
    const heroNameFormatted = props.hero.name.replace('npc_dota_hero_', '').replace('_', '');
    const heroId = props.hero.id;
    const iconClass = props.hero.favourite ? 'fa fa-star' : 'fa fa-star-o';
    return(
        <li className="hero">
            <i className={iconClass} aria-hidden="true" onClick={() => props.toggleFavouriteHero(heroId)}></i>
            <img src={`http://cdn.dota2.com/apps/dota2/images/heroes/${heroName}_vert.jpg`} alt={heroName} />
            <span className='hero-name'>{heroNameFormatted}</span>
        </li>
    );
}

class Heroes extends Component {
    constructor(){
        super();
        this.state = {
            favouriteFilter: 'all', // all, stared, not-stared
            user: {},
            heroes: [],
            loading: true
        };
    }

    componentWillMount(){
        this.loadHeroes();
    }

    loadHeroes(){
        Promise.all([
            axios.get('/user/' + localStorage.getItem('user_id')),
            axios.get('/heroes')
        ])
        .then(([_user, _heroes]) => {
            const heroes = _heroes.data.result.heroes;
            const user = _user.data;
            const favoriteHeroes = (user.user_metadata && user.user_metadata.heroes)
                                ? user.user_metadata.heroes : [];

            heroes.sort((a, b) => {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

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
        const payload = {user_metadata: {heroes: favoriteHeroes} };
        axios.patch('/update-hero/' + localStorage.getItem('user_id'), payload)
            .catch(function(error) {
                console.log('Request failed', error)
            });
    }

    handleFavouriteFilter = (selectedFilter) => {
        this.setState({
            favouriteFilter: selectedFilter
        });
    };

    render() {
        const heroes = this.state.heroes;
        const favouriteFilter = this.state.favouriteFilter;
        let heroesToDisplay = [];

        function keepHero(hero){
            let keep = false;
            switch(favouriteFilter) {
                case 'all':
                    keep = true;
                    break;
                case 'not-favourite':
                    keep = !hero.favourite;
                    break;
                case 'favourite':
                    keep = hero.favourite;
                    break;
                default:
                    keep = false;
                    break;
            }
            return keep;
        }

        if(!this.state.loading){
            heroesToDisplay = heroes.map(hero => {
                return keepHero(hero) && (<HeroItem key={hero.id.toString()} hero={hero} toggleFavouriteHero={this.toggleFavouriteHero}/>);
            })
        }

        return (
            <div>
                <FavouriteFilterBar
                    favouriteFilter={this.state.favouriteFilter}
                    onFavouriteFilterChange={this.handleFavouriteFilter}
                />
                <ul className="heros">{heroesToDisplay}</ul>
            </div>
        );
    }
}

export default Heroes;