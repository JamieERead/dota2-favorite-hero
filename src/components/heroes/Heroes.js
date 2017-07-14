import React, { Component } from 'react';
import axios from 'axios';
import auth0 from 'auth0-js'
import { AUTH_CONFIG } from '../../Auth/auth0-variables';

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
    auth0 = new auth0.Management({
        domain: AUTH_CONFIG.domain,
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FVTVNRFV3TmtVeU56TXdOVUV4TnpneVJrWXdSVEV4TUVWQ05USkRNME5CT1RKRlJqRTBRUSJ9',
    });

    constructor(){
        super();
        this.state = {heroes: [], loading: true};
    }

    componentWillMount(){
        this.loadHeroes();
    }

    loadHeroes(){
        // var instance = axios.create({
        //     headers: {
        //         'Access-Control-Allow-Origin': '*',
        //         'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTION',
        //         'Access-Control-Allow-Headers': 'Content-Type, Accept'
        //     }
        // });
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

        // var instance = axios.create({
        //     headers: {
        //         "authorization": "Bearer ABCD",
        //         "content-type": "application/json"
        //     },
        // });


        // const user = this.auth0.getUser();
        // console.log(user)

        // const data = {
        //     client_id: AUTH_CONFIG.clientId,
        //     client_secret: 'JgCI-0vDuyBw7zYhfBfz1hzjtbF_t5mGFTa5X5HKar3bP11GNOdrv-zANN2rji7U',
        //     type: 'web_server',
        //     grant_type: 'client_credentials'
        // }
        //
        // const myInit = {
        //     method: 'POST',
        //     headers: {
        //         "content-type": "application/json"
        //     },
        //     mode: 'no-cors',
        //     cache: 'default',
        //     body: JSON.stringify(data)
        // };
        //
        // fetch('https://dota2fav.eu.auth0.com/oauth/token', myInit)
        //     .then(response => {
        //         console.log(response)
        //     })

        const myInit = {
            method: 'PATCH',
            headers: {
                // 'Access-Control-Allow-Origin': 'https://dota2fav.eu.auth0.com',
                // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
                "authorization": "Bearer " + localStorage.getItem('access_token'),
                "content-type": "application/json"
            },
            cache: 'default',
            body: {user_metadata: {heroes: [1, 2, 3]} }
        };

        fetch(`https://${AUTH_CONFIG.domain}/api/v2/users/5967ce404349fc3abb24697b`, myInit)
            .then(response => {
                console.log(response)
            })
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