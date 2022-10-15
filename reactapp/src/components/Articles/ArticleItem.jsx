import React from 'react';
import {chooseBlock} from "./news_blocks/BlockMapping";

const ArticleItem = ({article}) => {

    return (
        <div className="article">
            <h1 className="article-title">{article.title}</h1>
            {article.show_cover
                ? <div className="article-cover">
                    <img src={article.cover} className="article-cover-img"/>
                </div>
                : <></>
            }
            {article.blocks.map(block =>
                <div key={block.id} className="article-block">
                    {block.hidden ? null : chooseBlock(block)}
                    {block.add_hr ? <hr className='shadow'/> : null}
                </div>
            )}
        </div>
    );
};

export default ArticleItem;