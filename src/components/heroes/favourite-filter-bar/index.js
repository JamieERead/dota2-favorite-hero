import React, { Component } from 'react';

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

export default FavouriteFilterBar;