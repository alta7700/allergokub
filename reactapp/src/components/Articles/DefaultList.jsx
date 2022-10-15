import React from 'react';
import {Link} from "react-router-dom";

const DefaultList = ({category, articles}) => {
    return (
        <div className={category}>
            {articles.map(article =>
                <Link key={article.id} to={`/${category}/${article.slug}/`} className={`${category}-item`}>
                    <img src={article.cover} className="item-img"/>
                    <div className="item-info">
                        <h2 className="item-title">{article.title}</h2>
                        <p className="item-date">{article.creation_date}</p>
                        <p className="item-description">{article.short_description}</p>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default DefaultList;