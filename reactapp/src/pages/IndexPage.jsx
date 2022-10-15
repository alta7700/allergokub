import React, {useRef} from "react";
import TilesList from "../components/Articles/TilesList";
import {useEffect, useState} from "react";
import {TeamMembers, Article, Allergens as AllergoMetrAPI} from "../API/DjangoAPI";
import useFetching from "../hooks/useFetching";
import Loader from "../components/Loader";
import MembersCarousel from "../components/MembersCarousel";
import SelfAllergoMetr from "../components/AllergoMetr/SelfAllergoMetr";
import CommonAllergoMetr from "../components/AllergoMetr/CommonAllergoMetr";
import AdSideLine from "../components/AdSideLine";


const IndexPage = () => {

    const [tiles, setTiles] = useState([]);
    const [members, setMembers] = useState({});
    const [allergoRisk, setAllergoRisk] = useState({common_risk: {}, self_risk: {}, allergens: {}, user_allergens: []});

    const [fetchTiles, isTilesLoading] = useFetching(async () => {
        const tiles = await Article.Get('tiles');
        setTiles(tiles);
    });

    const [fetchMembers, isMembersLoading] = useFetching(async () => {
        const members = await TeamMembers.Get();
        let objMembers = {}
        let i = 1;
        for (let member of members) {
            objMembers[i] = member
            i++;
        }
        setMembers(objMembers);
    });

    const [fetchAllergoMetr, isAllergoMetrLoading] = useFetching(async () => {
        const risk = await AllergoMetrAPI.getGeneralRisk()
        setAllergoRisk(risk)
    });

    const ref = useRef(null)

    useEffect(() => {
        fetchAllergoMetr();
        fetchTiles();
        fetchMembers();
    }, []);

    return (
        <div className="content-with-ad">
            <div className='content index' id='content'>
                {(isAllergoMetrLoading || isTilesLoading || isMembersLoading)
                    ? <Loader/>
                    : <>
                        <div className="allergometr-group">
                            <CommonAllergoMetr
                                commonRisk={allergoRisk.common_risk}
                                allAllergens={allergoRisk.allergens}
                                actualDate={allergoRisk.actual_date}
                            />
                            <SelfAllergoMetr
                                selfRisk={allergoRisk.self_risk}
                                userAllergens={allergoRisk.user_allergens}
                                allAllergens={allergoRisk.allergens}
                                actualDate={allergoRisk.actual_date}
                            />
                        </div>
                        <TilesList tiles={tiles}/>
                        <MembersCarousel members={members}/>
                    </>
                }
            </div>
            <AdSideLine/>
        </div>
    );
};

export default IndexPage;