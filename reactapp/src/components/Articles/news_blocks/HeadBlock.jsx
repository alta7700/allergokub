import React from 'react';
import {textSplitter} from "../../../utils/CustomFunctions";

const HeadBlock = ({block}) => {

    const strings = textSplitter(block.text, '\r\n');

    return (
        <div className='article-block-head'>
            {strings.map(H =>
                H ? <h2 key={H.id} style={block.textStyles}>{H.text}</h2> : null
            )}
        </div>
    );
};

export default HeadBlock;