import axios from "axios";
import AuthService from "./authService";

export const siteUrl = 'http://allergokub.ru'
// export const siteUrl = 'http://127.0.0.1:8000'
const apiUrl = siteUrl + '/api/'

const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFTOKEN',
})

api.interceptors.request.use((config) => {
    let accessToken = localStorage.getItem('access_token')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    if (error.response.status === 401) {
        const refresh = localStorage.getItem('refresh_token');
        const data = error.response.data;
        if (data.code) {
            if (data.code === "token_not_valid" && refresh) {
                if (data.detail === "Token is invalid or expired") {
                    localStorage.removeItem('refresh_token');
                } else if (data.detail === "Given token not valid for any token type") {
                    const response = await AuthService.checkAuth(refresh);
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);
                    return api.request(error.config);
                }
            }
        }
    }
    throw error;
})


async function getData(url, params) {
    const response = await api.get(url, params ? {params: params} : {});
    return response.data;
}

export class User {

    static profile = null

    static userBaseURL = 'auth/users/'

    static async getMe() {
        if (!this.profile) {
            this.profile = await api.get(this.userBaseURL + 'me/')
        }
        return this.profile
    }

    static async updateUserAllergens(allergens) {
        this.profile = null
        this.profile = await api.patch(this.userBaseURL + 'me/', {allergens})
        return this.profile
    }

    static async updatePrivateInfo(first_name, last_name, age) {
        this.profile = null
        this.profile = await api.patch(this.userBaseURL + 'me/', {first_name, last_name, age})
        return this.profile
    }

    static async changePassword(current_password, new_password, re_new_password) {
        try {
            let response = await api.post(this.userBaseURL + 'set_password/', {current_password, new_password, re_new_password})
            return [response.status, response.data ? response.data : {}]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [600, {'non_field_error': 'Неизвестная ошибка'}]
        }
    }
}

export class Article {
    static articlesList = {}
    static articlesByID = {}
    static articlesBySlug = {}

    static articleURL = 'articles/'

    static async Get(category) {
        if (!this.articlesList[category]) {
            this.articlesList[category] = await getData(this.articleURL + `list/?category=${category}`);
        }
        return this.articlesList[category]
    }

    static async GetByID(articleID, category) {
        if (!this.articlesByID[articleID]) {
            this.articlesByID[articleID] = await getData(`${this.articleURL}detail/${articleID}/?category=${category}`);
        }
        return this.articlesByID[articleID]
    }

    static async GetBySlug(articleSlug, category) {
        if (!this.articlesBySlug[articleSlug]) {
            this.articlesBySlug[articleSlug] = await getData(`${this.articleURL}detail/${articleSlug}/?category=${category}`);
        }
        return this.articlesBySlug[articleSlug]
    }
}

export class TeamMembers {

    static teamList = null

    static teamMembersURL = 'team/'

    static async Get() {
        if (!this.teamList) {
            this.teamList = await getData(this.teamMembersURL);
        }
        return this.teamList
    }
}

export class Allergens {

    static AllergensURL = 'allergens/'

    static generalRisk = null;
    static allergens = null;

    static async getAllergensList() {
        if (!this.allergens) {
            this.allergens = await getData(this.AllergensURL + 'list/')
        }
        return this.allergens
    }

    static async getGeneralRisk() {
        if (!this.generalRisk) {
            this.generalRisk = await getData(this.AllergensURL + 'allergometr/')
        }
        return this.generalRisk
    }

    static async getDateRangeCalendar(allergen, start, end) {
        return await getData(this.AllergensURL + 'calendar/', {
            allergen: allergen,
            start: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
            end: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
        })
    }
}

export default api;