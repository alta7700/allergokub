import {makeAutoObservable} from "mobx";
import AuthService from "../API/authService";

export default class AuthStore {

    isAuth = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)
            this.setAuth(true)
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
            return [600, {detail: 'Нет доступа к серверу'}]
        }
    }

    async register(email, password, password2) {
        try {
            const response =  await AuthService.registration(email, password, password2);
            return [response.status, response.data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            }
        }
    }

    async logout() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        this.setAuth(false)
    }

    async activateAccount(uid, token) {
        try {
            const response = await AuthService.activateAccount(uid, token)
            return response.status
        } catch(e) {
            if (e.response) {
                return e.response.status
            }
        }
    }

    async checkAuth() {
        localStorage.removeItem('access_token')
        const refresh = localStorage.getItem('refresh_token')
        if (refresh) {
            try {
                const response = await AuthService.checkAuth(refresh)
                localStorage.setItem('access_token', response.data.access)
                localStorage.setItem('refresh_token', response.data.refresh)
                this.setAuth(true)
            } catch(e) {
                
            }
        }
    }

    async sendEmailResetPassword(email) {
        try {
            const response = await AuthService.sendEmailResetPassword(email)
            let data = response.data ? response.data : {}
            return [response.status, data]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            } else {
                return [600, {'non_field_error': 'Неизвестная ошибка'}]
            }
        }
    }

    async resetPassword(uid, token, new_password, re_new_password) {
        try {
            const response = await AuthService.resetPassword(uid, token, new_password, re_new_password)
            return [response.status, response.data ? response.data : {}]
        } catch (e) {
            if (e.response) {
                return [e.response.status, e.response.data]
            } else {
                return [600, {'non_field_error': 'Неизвестная ошибка'}]
            }
        }
    }
}
