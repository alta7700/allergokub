import React, {useState} from 'react';
import ReadProfile from "./ReadProfile";
import EditingProfile from "./EditingProfile";
import Loader from "../Loader";

const ProfileInfo = ({userFields, updatePrivate, isPrivateUpdating}) => {

    const [isEditing, setIsEditing] = useState(false)

    const allFields = {
        email: "Email",
        first_name: "Имя",
        last_name: "Фамилия",
        age: "Возраст",
        date_joined: "Дата регистрации"
    }

    return (
        <>
            {isPrivateUpdating && <Loader/>}
            <div className='profile-block'>
                <div className="head">
                    <h3>Профиль</h3>
                    <div className='edit-switch'>
                        <p>Редактировать:</p>
                        <div className={`edit-box${isEditing ? ' editing' : ''}`} onClick={() => setIsEditing(!isEditing)}>
                            <span/>
                            <div className="layer"/>
                        </div>
                    </div>
                </div>
                {isEditing
                    ? <EditingProfile
                        userFields={userFields}
                        allFields={allFields}
                        updatePrivate={updatePrivate}
                        setIsEditing={setIsEditing}
                    />
                    : <ReadProfile userFields={userFields} allFields={allFields}/>
                }
            </div>
        </>

    );
};

export default ProfileInfo;