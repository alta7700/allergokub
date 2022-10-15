import {useState} from 'react';

const UseParamsFetching = (callback) => {
    const [isLoading, setIsLoading] = useState(false)

    const fetching = async ([...params]) => {
        setIsLoading(true)
        let result = await callback([...params])
        setIsLoading(false)
        return result
    }

    return [fetching, isLoading];
};

export default UseParamsFetching;