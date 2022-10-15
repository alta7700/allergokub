import React, {useEffect, useState} from 'react';
import {Article} from "../API/DjangoAPI";
import useFetching from "../hooks/useFetching";
import Loader from "../components/Loader";
import {Link} from "react-router-dom";
import AdSideLine from "../components/AdSideLine";
import DefaultList from "../components/Articles/DefaultList";
import AllergensList from "../components/Articles/AllergensList";

const ArticlesListPage = ({category}) => {

    const [articles, setArticles] = useState([])
    const [fetchArticles, isArticlesLoading] = useFetching(async () => {
        const articles = await Article.Get(category);
        setArticles(articles)

    })

    useEffect(() => {
        fetchArticles();
    }, [category])

    return (
        <div className="content-with-ad">
            <div className='content' id='content'>
                {isArticlesLoading
                    ? <Loader/>
                    : category === 'allergens'
                        ? <AllergensList allergens={articles}/>
                        : <DefaultList articles={articles} category={category}/>
                }
            </div>
            <AdSideLine/>
        </div>
    );
};

export default ArticlesListPage;