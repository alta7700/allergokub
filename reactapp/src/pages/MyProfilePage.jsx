import React, {useContext, useEffect, useState} from 'react';
import useFetching from "../hooks/useFetching";
import {Allergens, User} from "../API/DjangoAPI";
import Loader from "../components/Loader";
import {Context} from "../index";
import {useHistory} from "react-router-dom";
import ProfileInfo from "../components/Profile/ProfileInfo";
import UserAllergensWidget from "../components/Profile/UserAllergensWidget";
import useParamFetching from "../hooks/useParamFetching";
import PasswordChangeForm from "../components/Profile/PasswordChangeForm";

const MyProfilePage = () => {

    const {auth} = useContext(Context)
    const router = useHistory()

    const [profile, setProfile] = useState({})
    const [allAllergens, setAllAllergens] = useState({})

    const [fetchProfile, isProfileLoading] = useFetching(async () => {
        const profileResponse = await User.getMe();
        const allergensData = await Allergens.getAllergensList();
        setProfile(profileResponse.data);
        setAllAllergens(allergensData);
    })

    const [updatePrivate, isPrivateUpdating] = useParamFetching(async ([first_name, last_name, age]) => {
        try {
            const profileResponse = await User.updatePrivateInfo(first_name, last_name, age)
            setProfile(profileResponse.data)
            return {result: 'success', text: 'Данные успешно сохранены'}
        } catch (e) {
            return {result: 'error', text: 'Не удалось сохранить данные'}
        }
    })

    const [updateAllergens, isAllergenUpdating] = useParamFetching(async (allergens) => {
        try {
            const profileResponse = await User.updateUserAllergens(allergens)
            setProfile(profileResponse.data)
            Allergens.generalRisk = null
            return {result: 'success', text: 'Аллергены успешно сохранены'}
        } catch (e) {
            if (e.response && e.response.status === 500) {
                return {result: 'error', text: 'Не удалось сохранить выбранные аллергены из-за ошибки сервера'}
            }
            return {result: 'error', text: 'Не удалось сохранить выбранные аллергены'}
        }
    })

    useEffect(() => {
        (async () => {
        if (auth.isAuth) {
            await fetchProfile()
        } else {
            router.replace('/', {loginModal: {form: 'login', initFormStatus: [' error-status', 'Для просмотра профиля необходимо авторизоваться']}})
        }})()
    }, [])

    return (
        <div className='content' id='content'>
            {isProfileLoading
                ? <Loader/>
                : <div className='profile-page'>
                    <ProfileInfo
                        userFields={profile}
                        updatePrivate={updatePrivate}
                        isPrivateUpdating={isPrivateUpdating}
                    />
                    <UserAllergensWidget
                        userAllergens={profile.allergens}
                        allAllergens={allAllergens}
                        updateAllergensFunc={updateAllergens}
                        isAllergenUpdating={isAllergenUpdating}
                    />
                    <PasswordChangeForm currentEmail={profile.email}/>
                    <div className='logout-btn' onClick={() => {
                        auth.logout();
                        router.push('/');
                        Allergens.generalRisk = null
                    }}>Выйти из аккаунта</div>
                </div>
            }
        </div>
    );
};

export default MyProfilePage;