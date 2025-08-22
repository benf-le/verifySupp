import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Collection } from '../types/common';
import { apiGet } from '../utils/apiUtils';

export const useCollections = (fetchOnMount: boolean = true) => {
    const [cookies] = useCookies(['AuthToken']);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [collectionsMap, setCollectionsMap] = useState<{[key: string]: string}>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCollections = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiGet<Collection[]>('/collections', cookies.AuthToken);
            setCollections(data);

            // Create map for quick lookup
            const map = data.reduce((acc, collection) => {
                acc[collection.id] = collection.name;
                return acc;
            }, {} as {[key: string]: string});
            setCollectionsMap(map);

        } catch (error) {
            console.error('Error fetching collections:', error);
            setError(error instanceof Error ? error.message : 'Lỗi khi tải collections');
            setCollections([]);
            setCollectionsMap({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchOnMount && cookies.AuthToken) {
            fetchCollections();
        }
    }, [fetchOnMount, cookies.AuthToken]);

    return {
        collections,
        collectionsMap,
        loading,
        error,
        refetch: fetchCollections
    };
};
