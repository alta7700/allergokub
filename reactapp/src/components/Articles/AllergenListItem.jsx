import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Line} from "react-chartjs-2"
import {allergenTypesNum} from "../AllergoMetr/AllergoMetr";
import {getPointColor, getGradient} from "../../utils/getColor";
import {DateRangePicker} from "rsuite";
import {subDays} from "rsuite/cjs/utils/dateUtils";
import Loader from "../Loader";
import {Allergens} from "../../API/DjangoAPI";
import useParamFetching from "../../hooks/useParamFetching";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

const AllergenListItem = ({activeItem, setActiveItem, article}) => {

    const [concentrations, setConcentrations] = useState([])
    const allergen = article.current_allergen
    const units = allergenTypesNum[allergen.allergen_type].units
    const [dateRange, setDateRange] = useState([new Date(), new Date()])
    const {allowedRange} = DateRangePicker;
    const [fetchConcentrations, isConcentrationsLoading] = useParamFetching(async ([start, end]) => {
        let data = await Allergens.getDateRangeCalendar(allergen.id, start, end)
        setConcentrations(data)
    })

    useEffect(() => {
        setConcentrations(allergen.month_concentration ? allergen.month_concentration : [])
    }, [])
    useEffect(() => {
        if (concentrations.length > 0) {
            let [startY, startM, startD] = concentrations[0].date.split('-')
            let [endY, endM, endD] = concentrations[concentrations.length - 1].date.split('-')
            setDateRange([
                new Date(startY, startM, startD),
                new Date(endY, endM, endD),
            ])
        }
    }, [concentrations])


    let data = {
        datasets: [
            {
                data: concentrations,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBorderWidth: 0,
                pointHoverBorderWidth: 0,
                pointHoverBackgroundColor: context => getPointColor(context, allergen),
                lineTension: 0.2,
                borderColor: (context) => {
                    const {chart, dataset} = context;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) {return;}
                    return getGradient(ctx, chartArea, dataset.data, allergen);
                },
            },
        ]
    }

    const options = {
        aspectRatio: 2,
        responsive: true,
        animations: false,
        plugins:{
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    beforeTitle: () => 'Дата: ',
                    label: (context) => {
                        return ['Концентрация:', `${context.formattedValue} ${units}/м3`]
                    },
                }
            },
        },
        parsing: {
            xAxisKey: 'date',
            yAxisKey: 'value'
        },
        layout: {
            padding: 20
        },
        interaction: {
            mode: "index",
            intersect: false,
            displayColors: false,
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        }

    }

    return (
        <>
            {isConcentrationsLoading && <Loader/>}
            <div
                className={`allergen-article-item${activeItem === article.id ? ' active' : ''}`}
            >
                <div
                    className='item-info'
                    onClick={() => setActiveItem(article.id === activeItem ? -1 : article.id)}
                >
                    <div className="img-container">
                        <img src={article.cover}/>
                    </div>
                    <div className='item-info-base'>
                        <span className="title">{allergen.title}</span>
                        <div className="current-concentration">
                            <div className="point"><p>0</p></div>
                            <div className="point low"><p>{allergen.low}</p></div>
                            <div className="point middle"><p>{allergen.middle}</p></div>
                            <div className="point high"><p>{allergen.high}</p></div>
                            <div className="point very-high"><p>{`${allergen.very_high}+`}</p></div>
                            <div
                                className="point current"
                                style={{left: `${allergen.concentration.score}%`}}
                            >
                                <p>{allergen.concentration.absolute} {units}/м<sup><small>3</small></sup></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="item-info-detail">
                    <div className="line-chart">
                        <Line data={data} options={options} height={'300px'}/>
                        <div id={`date-range-container-allergen-${allergen.id}`} style={{position: "relative", zIndex:20}}>
                            <DateRangePicker
                                value={dateRange}
                                onChange={(e) => {
                                    setDateRange(e);
                                    fetchConcentrations([e[0], e[1]])
                                } }
                                disabledDate={allowedRange(new Date(2018, 4, 5), new Date())}
                                character='/'
                                placement={'topStart'}
                                format={'dd.MM.yyyy'}
                                cleanable={false}
                                container={document.getElementById(`date-range-container-allergen-${allergen.id}`)}
                                on
                                ranges={[
                                    {
                                        label: 'Прошлый месяц',
                                        value: [subDays(new Date(), 60), subDays(new Date(), 30)]
                                    },
                                    {
                                        label: 'Прошлый год',
                                        value: [new Date(new Date().getFullYear() - 1, 1), new Date(new Date().getFullYear(), 1)]
                                    },
                                    {
                                        label: 'Всё время',
                                        value: [new Date(2018, 4, 5), new Date()]
                                    }
                                ]}
                            />
                        </div>
                    </div>
                    <Link to={`/allergens/${article.slug}`}>Ботаническое описание</Link>
                </div>
            </div>
        </>
    );
};

export default AllergenListItem;