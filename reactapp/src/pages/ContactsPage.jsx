import React from 'react';
import {YMaps, Map, Placemark, ZoomControl} from "react-yandex-maps";
import AdSideLine from "../components/AdSideLine";

const ContactsPage = () => {

    const KubGMU = [45.015186, 38.974478]
    const mapData = {
        center: KubGMU,
        zoom: 11,
    };

    return (
        <div className='content' id='content'>
            <div className="contacts">
                <div className="info">
                    <h1>Контакты</h1>
                    <div className="communication">
                        <p>E-mail: support@allergokub.ru</p>
                        <p>E-mail: support@allergokub.ru</p>
                    </div>
                    <div className="address">
                        <p>ФГБОУ ВО "Кубанский государственный медицинский университет" МЗ РФ</p>
                        <p>350011, Россия, Краснодар, ул. Седина, д. 4</p>
                    </div>
                </div>
                <YMaps query={{lang: 'ru_RU'}}>
                    <Map defaultState={mapData} width={'inherit'} height={'inherit'} className='map'>
                        <Placemark geometry={KubGMU} />
                        <ZoomControl/>
                    </Map>
                </YMaps>
            </div>
        </div>
    );
};

export default ContactsPage;