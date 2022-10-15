import React, {useContext} from 'react';
import AllergoMetr from "./AllergoMetr";
import {Context} from "../../index";
import Description from "./Description";
import {getRiskLevel} from "../../utils/CustomFunctions";
import {allergenTypesNum} from "./AllergoMetr";

const SelfAllergoMetr = ({selfRisk, userAllergens, allAllergens, actualDate}) => {

    const {auth} = useContext(Context)

    function getAllergenDetail(itemID) {
        let item = allAllergens[itemID]
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
            <AllergoMetr percents={selfRisk.current_risk}/>
            {!auth.isAuth && userAllergens.length === 0
                ? <div className="blur-allergometr">
                    <span>Мы не можем посчитать Ваш личный риск.</span>
                    {auth.isAuth
                        ? <span>Необходимо выбрать свои аллергены в личном кабинете</span>
                        : <span>Необходимо авторизоваться</span>
                    }
                </div>
                : <Description mode={'Личный'} risk={selfRisk.current_risk} actualDate={actualDate} Detail={
                    <>
                        <div>
                            {selfRisk.max_scores
                                ? <span>Основные аллергены: {selfRisk.max_scores}</span>
                                : <span>Для Вас воздух чист, можете дышать полной грудью</span>
                            }
                        </div>
                        <div className='levels'>
                            <span>Уровни продукции:</span>
                            <ul>
                                {userAllergens.map(itemID =>
                                    <React.Fragment key={itemID}>
                                        {getAllergenDetail(itemID)}
                                    </React.Fragment>
                                )}
                            </ul>
                        </div>
                    </>
                }/>
            }
        </div>
    );
};

export default SelfAllergoMetr;