import React, {useState} from 'react';
import {getRiskLevel} from "../../utils/CustomFunctions";

const Description = ({mode, risk, Detail, actualDate}) => {

    const [showDetail, setShowDetail] = useState(false)

    return (
        <div className='description'>
            <span>{actualDate}</span>
            <span><b>{mode}</b> уровень споро-пыльцевой продукции - {getRiskLevel(risk)}</span>
            <div className="more" onClick={() => setShowDetail(!showDetail)}>{showDetail ? 'Скрыть' :'Подробнее'}</div>
            <div className={`detail-container${showDetail ? '' : ' hidden'}`}>
                {Detail}
            </div>
        </div>
    );
};

export default Description;