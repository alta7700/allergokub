import React from 'react';

const ImageBlock = ({block}) => {
    return (
        <div className='article-block-image'>
            <img src={block.images[0].image}/>
            <p style={block.textStyles}>{block.text}</p>
        </div>
    );
};

export default ImageBlock;