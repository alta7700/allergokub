import React from 'react';
import {siteUrl} from "../API/DjangoAPI";

const Logo3D = () => {
    return (
        <div className="logo3d">
            <div className="title">
                AllergoKub
            </div>
            <div className="cube">
                <div className="side front">
                    <img src={`${siteUrl}/static/images/cube/ksma.png`}/>
                </div>
                <div className="side back">
                    <img src={`${siteUrl}/static/images/cube/ksma.png`}/>
                </div>
                <div className="side top">
                    <img src={`${siteUrl}/static/images/cube/ksma.png`}/>
                </div>
                <div className="side bottom">
                    <img src={`${siteUrl}/static/images/cube/ksma.png`}/>
                </div>
                <div className="side left">
                    <img src={`${siteUrl}/static/images/cube/ksma.png`}/>
                </div>
                <div className="side right">
                    <img src={`${siteUrl}/static/images/cube/ksma.png`}/>
                </div>
            </div>
        </div>
    );
};

export default Logo3D;