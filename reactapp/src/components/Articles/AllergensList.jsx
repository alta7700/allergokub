import React, {useState} from 'react';
import AllergenListItem from "./AllergenListItem";

const AllergensList = ({allergens}) => {

    const [activeItem, setActiveItem] = useState(-1)

    return (
        <div className={'allergens-articles'}>
            {allergens.map(article =>
                <AllergenListItem
                    key={article.id}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    article={article}
                />
            )}
        </div>
    );
};

export default AllergensList;