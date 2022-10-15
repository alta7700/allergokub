import React from 'react';

const VideoBlock = ({block}) => {
    return (
        <div className='article-block-video' dangerouslySetInnerHTML={{__html: block.text}}/>
    );
};

export default VideoBlock;