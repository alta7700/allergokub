import {useState} from 'react';

const UseFetching = (callback) => {
    const [isLoading, setIsLoading] = useState(false)

    const fetching = async () => {
        setIsLoading(true)
        await callback()
        setIsLoading(false)
    }

    return [fetching, isLoading];
};

export default UseFetching;