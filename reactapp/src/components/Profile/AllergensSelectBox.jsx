import React from 'react';

const AllergensSelectBox = ({allAllergens, list, title, onChange}) => {
    return (
        <div className="allergens-select-group">
            <span>{title}</span>
            <div className="select-box">
                {list.map(itemID =>
                    <label key={itemID}>
                    <input
                        id={`profile-allergen-${itemID}`}
                        type='checkbox'
                        onChange={e => onChange(e, itemID)}
                    />
                        {allAllergens[itemID].title}
                    </label>
                )}
            </div>
        </div>
    );
};

export default AllergensSelectBox;