import IndexPage from "../pages/IndexPage";
import ArticlesListPage from "../pages/ArticlesListPage";
import ArticlePage from "../pages/ArticlePage";
import AccountActivation from "../components/AccountActivation";
import MyProfilePage from "../pages/MyProfilePage";
import ResetPassword from "../components/ResetPassword";
import NotFound from "../pages/NotFound";
import ContactsPage from "../pages/ContactsPage";


const Routes = [
    {id: 0, path: '/', component: IndexPage, exact: true, props: {}},
    {id: 2, path: '/index/:slug', component: ArticlePage, exact: true, props: {category: 'tiles'}},
    {id: 3, path: '/news/', component: ArticlesListPage, exact: true, props: {category: 'news'}},
    {id: 4, path: '/news/:slug', component: ArticlePage, exact: true, props: {category: 'news'}},
    {id: 5, path: '/projects/', component: ArticlesListPage, exact: true, props: {category: 'projects'}},
    {id: 6, path: '/projects/:slug', component: ArticlePage, exact: true, props: {category: 'projects'}},
    {id: 7, path: '/allergens/', component: ArticlesListPage, exact: true, props: {category: 'allergens'}},
    {id: 8, path: '/allergens/:slug', component: ArticlePage, exact: true, props: {category: 'allergens'}},
    {id: 9, path: '/contacts', component: ContactsPage, exact: true, props: {}},
    {id: 10, path: '/profile/', component: MyProfilePage, exact: true, props: {}},
    {id: 11, path: '/activate/:uid/:token/', component: AccountActivation, exact: true, props: {}},
    {id: 12, path: '/password_reset/:uid/:token/', component: ResetPassword, exact: true, props: {}},
    {id: 13, path: '/not-found/', component: NotFound, exact: true, props: {}},
]

export default Routes