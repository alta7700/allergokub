import React from 'react';

const Loader = () => {

    return (
        <div className='loader'>
            <div className="blobs">
                <div className="blob top"/>
                <div className="blob bottom"/>
                <div className="blob left"/>
                <div className="blob move"/>
            </div>
        </div>
    );
};

export default Loader;