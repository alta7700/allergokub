import React from 'react';
import AllergoMetr, {allergenTypesNum} from "./AllergoMetr";
import Description from "./Description";
import {getRiskLevel} from "../../utils/CustomFunctions";

const CommonAllergoMetr = ({commonRisk, allAllergens, actualDate}) => {

    function getAllergenDetail(item) {
        if (!item || item.score === 0) {
            return <></>
        }
        let risk = getRiskLevel(Math.round(item.score * 100/ 4), true)
        return <li>
            {item.title} - {risk}({item.abs_concentration}{allergenTypesNum[item.allergen_type].units}/м<sup><small>3</small></sup>)
        </li>
    }

    return (
        <div className='allergometr-container'>
            <AllergoMetr percents={commonRisk.current_risk}/>
            <Description mode={'Общий'} risk={commonRisk.current_risk} actualDate={actualDate} Detail={
                <>

                    <div>
                        {commonRisk.max_scores
                            ? <span>Основные аллергены: {commonRisk.max_scores}</span>
                            : <span>Воздух чист от аллергенов</span>
                        }
                    </div>
                    <div className='levels'>
                        <span>Уровни продукции:</span>
                        <ul>
                            {Object.entries(allAllergens).map(([itemID, item], i) =>
                                <React.Fragment key={itemID}>
                                    {getAllergenDetail(item)}
                                </React.Fragment>
                            )}
                        </ul>
                    </div>
                </>
            }/>
        </div>
    );
};

export default CommonAllergoMetr;