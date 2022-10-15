import React, {useEffect, useState} from 'react';
import AllergensSelectBox from "./AllergensSelectBox";
import {removeArrayPart} from "../../utils/CustomFunctions";
import Loader from "../Loader";

const UserAllergensWidget = ({userAllergens, allAllergens, updateAllergensFunc, isAllergenUpdating}) => {

    const [unselectedAllergens, setUnselectedAllergens] = useState([])
    const [selectedAllergens, setSelectedAllergens] = useState([])
    const [activeAllergens, setActiveAllergens] = useState({selected: [], unselected: []})
    const [changeResult, setChangeResult] = useState({result: '', text: ''})

    useEffect(() => {
        resetAllergensSelector()
    }, [userAllergens])

    function Sort(a, b) {
        return Number(a) - Number(b)
    }

    function resetAllergensSelector() {
        if (allAllergens && userAllergens) {
            setSelectedAllergens(userAllergens.sort(Sort))
            let unselected = []
            for (let allergenID of (Object.keys(allAllergens))) {
                if (!(userAllergens.includes(allergenID))) {
                    unselected.push(allergenID)
                }
            }
            setUnselectedAllergens(unselected.sort(Sort))
        }
    }

    function setActive(activeKey) {
        return (e, allergenID) => {
            let newActive = {...activeAllergens}
            if (e.target.checked) {
                newActive[activeKey].push(allergenID)
            } else {
                newActive[activeKey] = newActive[activeKey].filter(i => i !== allergenID)
            }
            setActiveAllergens(newActive)
        }
    }

    function moveActive(mode) {
        if (mode === 'delete-all') {
            setSelectedAllergens([])
            setUnselectedAllergens([...selectedAllergens, ...unselectedAllergens].sort(Sort))
            setActiveAllergens({selected: [], unselected: [...activeAllergens.unselected]})
        } else if (mode === 'add-all') {
            setSelectedAllergens([...selectedAllergens, ...unselectedAllergens].sort(Sort))
            setUnselectedAllergens([])
            setActiveAllergens({selected: [...activeAllergens.selected], unselected: []})
        } else if (mode === 'delete') {
            if (activeAllergens.selected.length !== 0) {
                setSelectedAllergens(removeArrayPart(selectedAllergens, activeAllergens.selected).sort(Sort))
                setUnselectedAllergens([...unselectedAllergens, ...activeAllergens.selected].sort(Sort))
                setActiveAllergens({selected: [], unselected: [...activeAllergens.unselected]})
            }
        } else if (mode === 'add') {
            if (activeAllergens.unselected.length !== 0) {
                setSelectedAllergens([...selectedAllergens, ...activeAllergens.unselected].sort(Sort))
                setUnselectedAllergens(removeArrayPart(unselectedAllergens, activeAllergens.unselected).sort(Sort))
                setActiveAllergens({selected: [...activeAllergens.selected], unselected: []})
            }
        }
    }

    async function updateUserAllergens() {
        let isEqual = true
        let sortedSelected = selectedAllergens.sort(Sort)
        let sortedUserAllergens = userAllergens.sort(Sort)
        if (sortedSelected.length === sortedUserAllergens.length) {
            for (let i = 0; i !== sortedSelected.length; i++) {
                if (sortedSelected[i] !== sortedUserAllergens[i]) {
                    isEqual = false
                    break
                }
            }
        } else {isEqual = false}
        if (!isEqual) {
            let result = await updateAllergensFunc(selectedAllergens)
            setChangeResult(result)
        } else {
            setChangeResult({result:'error', text:'Список выбранных аллергенов не был изменен'})
        }
    }

    return (
        <>
            {isAllergenUpdating && <Loader/>}
            <div className='select-allergens-container'>
                <h2>Мои аллергены</h2>
                {changeResult.text && <span className={changeResult.result}>{changeResult.text}</span>}
                <div className="select-allergens">
                    <AllergensSelectBox
                        title={'Не выбрано'}
                        allAllergens={allAllergens}
                        list={unselectedAllergens}
                        onChange={setActive('unselected')}
                    />
                    <div className="left-right-btn">
                        <div className="button right-all" onClick={() => moveActive('add-all')}/>
                        <div className="button right" onClick={() => moveActive('add')}/>
                        <div className="button left" onClick={() => moveActive('delete')}/>
                        <div className="button left-all" onClick={() => moveActive('delete-all')}/>
                    </div>
                    <AllergensSelectBox
                        title={'Выбрано'}
                        allAllergens={allAllergens}
                        list={selectedAllergens}
                        onChange={setActive('selected')}
                    />
                </div>
                <div className="submit-row">
                    <div
                        className="button cancel"
                        onClick={resetAllergensSelector}
                    >
                        <p>Отменить</p>
                    </div>
                    <div
                        className="button submit"
                        onClick={updateUserAllergens}
                    >
                        <p>Сохранить</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserAllergensWidget;