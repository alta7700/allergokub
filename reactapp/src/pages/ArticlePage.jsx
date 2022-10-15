import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import ArticleItem from "../components/Articles/ArticleItem";
import useFetching from "../hooks/useFetching";
import Loader from "../components/Loader";
import {Article} from "../API/DjangoAPI";
import AdSideLine from "../components/AdSideLine";


const ArticlePage = ({category}) => {
    
    const params = useParams()
    const [article, setArticle] = useState({blocks: []})
    const [fetchArticleItem, isArticleItemLoading] = useFetching(async () => {
        const article = await Article.GetBySlug(params.slug, category);
        setArticle(article)
    })

    useEffect(() => {
        fetchArticleItem()
    }, [params.slug, category])

    return (
        <div className="content-with-ad">
            <div className='content' id='content'>
                {isArticleItemLoading
                    ? <Loader/>
                    : <ArticleItem article={article}/>}
            </div>
            <AdSideLine/>
        </div>
    );
};

export default ArticlePage;