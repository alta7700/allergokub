import React, {useEffect, useState} from 'react';
import {textSplitter} from "../utils/CustomFunctions";
import {useMediaQuery} from "react-responsive";
import {useSwipeable} from "react-swipeable";

const MembersCarousel = ({members}) => {

    const isSlider = useMediaQuery({query: '(max-width: 650px)'});

    const [center, setCenter] = useState(0)
    const [line, setLine] = useState({})
    const [membersCircle, setMembersCircle] = useState({})
    const [swipe, setSwipe] = useState('')

    async function buildCircle() {
        let circle = {};
        let central = 1;
        let membersCount = Object.keys(members).length;
        for (let [memberPos, member] of Object.entries(members)) {
            memberPos = Number(memberPos)
            if (member.position === 0) {
                central = memberPos;
            }
            if (memberPos === 1) {
                circle[1] = [membersCount, 2];
            } else if (memberPos === membersCount) {
                circle[membersCount] = [membersCount - 1, 1];
            } else {
                circle[memberPos] = [memberPos - 1, memberPos + 1];
            }
        }
        setMembersCircle(circle);
        setCenter(central);
    }

    function get3Members(resetStyles) {
        let [left, right] = membersCircle[center]
        let leftE = document.getElementById(`member-${left}`)
        let centerE = document.getElementById(`member-${center}`)
        let rightE = document.getElementById(`member-${right}`)
        if (resetStyles) {
            leftE.style.transform = ``
            centerE.style.transform = ``
            rightE.style.transform = ``
        }
        return [leftE, centerE, rightE]
    }

    function swipeRight() {
        if (isSlider) {
            get3Members(true)
        }
        setCenter(membersCircle[center][0])
        setSwipe(' swipe-right')
    }

    function swipeLeft() {
        if (isSlider) {
            get3Members(true)
        }
        setCenter(membersCircle[center][1])
        setSwipe(' swipe-left')
    }

    function swiping(e) {
        if (isSlider) {
            let [leftE, centerE, rightE] = get3Members()
            let deltaRatio = e.absX * 0.5 / window.innerWidth
            deltaRatio = deltaRatio > 0.5 ? 0.5 : deltaRatio

            let deltaPercent = e.absX * 100 / window.innerWidth
            deltaPercent = deltaPercent < 100 ? deltaPercent * (e.deltaX < 0 ? -1 : 1)
                : e.deltaX < 0 ? -100 : 100

            leftE.style.transform = `translateX(${-100 + deltaPercent}%) scale(${0.5 + deltaRatio})`
            centerE.style.transform = `translateX(${deltaPercent}%) scale(${1 - deltaRatio})`
            rightE.style.transform = `translateX(${100 + deltaPercent}%) scale(${0.5 + deltaRatio})`

        }
    }

    const swipeHandlers = useSwipeable({
        onSwipedLeft: swipeLeft,
        onSwipedRight: swipeRight,
        onSwiping: swiping,
    })

    useEffect(() => {
        if (Object.keys(members).length > 0) {
            buildCircle()
        }
    }, [])

    useEffect(() => {
        if (Object.keys(membersCircle).length !== 0 && center !== 0) {
            let [left, right] = membersCircle[center];
            let preLeft = membersCircle[left][0];
            let postRight = membersCircle[right][1];
            let newLine = {};
            newLine[preLeft] = "pre-left";
            newLine[left] = "left";
            newLine[center] = "center";
            newLine[right] = "right";
            newLine[postRight] = "post-right";
            setLine(newLine)
        }
    }, [membersCircle, center])

    return (
        <>
            <div {...swipeHandlers} className='team-members'>
                {Object.entries(members).map(([position, member], i) =>
                    <div
                        id={`member-${position}`}
                        key={position}
                        className={`member ${
                            line[position]
                                ? line[position] + swipe
                                : 'hidden'
                        }`}
                        onClick={
                            line[position] === 'left'
                                ? swipeRight
                                : line[position] === 'right'
                                    ? swipeLeft
                                    : null
                        }
                    >
                        <div className="img-container">
                            <img src={member.image}/>
                        </div>
                        <div className='member-about'>
                            <p className='member-name'>{member.fio}</p>
                            <p className='member-post'>{member.post}</p>
                            <div className='member-description'>
                                {textSplitter(member.short_description).map(str =>
                                    <p key={str.id}>{str.text}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="members-underline">
                {Object.keys(members).map(position =>
                    <span
                        key={position}
                        className={Number(center) !== Number(position) ? '' : 'center'}
                    />
                )}
            </div>
        </>
    );
};

export default MembersCarousel;