import React from 'react';
import {chooseBlock} from "./BlockMapping";

const ContainerBlock = ({block}) => {

    return (
        <div className={`article-block-container${block.horizontal ? ' horizontal' : ''}`}>
            {block.nested_blocks.map(bl =>
                <div key={bl.id} className="article-block">
                    {bl.hidden ? null : chooseBlock(bl)}
                    {bl.add_hr ? <hr/> : null}
                </div>
            )}
        </div>
    );
};

export default ContainerBlock;