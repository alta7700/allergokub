import React from 'react';
import {textSplitter} from "../../../utils/CustomFunctions";

const TextBlock = ({block}) => {

    const pars = textSplitter(block.text, '\r\n');

    return (
        <div className='article-block-text'>
            {pars.map(par =>
                par ? <p key={par.id} style={block.textStyles} dangerouslySetInnerHTML={{__html: par.text}}/> : null
            )}
        </div>
    );
};

export default TextBlock;