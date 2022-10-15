import React from 'react';
import {Link} from "react-router-dom";

const TilesList = (props) => {

    return (
        <div className="tiles">
            {props.tiles.map(tile =>
                <Link key={tile.id} to={`/index/${tile.slug}/`} className="tile-item">
                    <img src={tile.cover} className="item-img"/>
                    <div className="item-info">
                        <h2 className="item-title">{tile.title}</h2>
                        <hr className="item-hr-line"/>
                        <p className="item-date">Обновлено: {tile.update_date}</p>
                        <p className="item-description">{tile.short_description}</p>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default TilesList;