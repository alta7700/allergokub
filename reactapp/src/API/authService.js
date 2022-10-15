import api from "./DjangoAPI";

export default class AuthService {

    static async registration(email, password, password2) {
        return await api.post('auth/users/', {email, password, password2})
    }

    static async activateAccount(uid, token) {
        return await api.post(`auth/users/activation/`, {uid ,token})
    }

    static async login(email, password) {
        return await api.post('auth/jwt/create/', {email, password})
    }

    static async checkAuth(refresh) {
        return await api.post('auth/jwt/refresh/', {refresh})
    }

    static async sendEmailResetPassword(email) {
        return await api.post('auth/users/reset_password/', {email})
    }

    static async resetPassword(uid, token, new_password, re_new_password) {
        return await api.post('auth/users/reset_password_confirm/', {uid, token, new_password, re_new_password})
    }
}