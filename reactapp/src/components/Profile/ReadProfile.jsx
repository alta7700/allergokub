import React from 'react';

const ReadProfile = ({userFields, allFields}) => {

    return (
        <div className="read-fields">
            {Object.entries(userFields).map(([fieldName, value], i) =>
                allFields[fieldName] && <React.Fragment key={fieldName}>
                        <p className='field-name'>{allFields[fieldName]}:</p>
                        <p className='field-value'>{value}</p>
                    </React.Fragment>
            )}
        </div>
    );
};

export default ReadProfile;