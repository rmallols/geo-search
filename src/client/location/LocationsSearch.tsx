import { useState, useEffect } from 'react';
import useDebounce from '../common/useDebounce';

const LocationsSearch = () => {

    const fetchLocations = async () => {
        const response = await fetch(`/location?q=${debouncedQuery}`);
        return response.json();
    };

    const manageQueryChange = async () => {
        if (canPerformQuery) {
            setLoading(true);
            setLocations([]);
            setLocations(await fetchLocations());
            setLoading(false);
        } else {
            setLocations([]);
        }
    };

    const [query, setQuery] = useState<string>('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const debouncedQuery: string = useDebounce(query);

    const minQueryCharacters: number = 3;
    const canPerformQuery: boolean = (
        debouncedQuery.length >= minQueryCharacters
    );

    useEffect(() => {
        manageQueryChange();
    }, [debouncedQuery]);

    return (
        <>
            <LocationSearchInput query={query} onChange={setQuery} />
            <LocationsSearchMessage
                loading={loading}
                canPerformQuery={canPerformQuery}
                minQueryCharacters={minQueryCharacters}
            />
            <LocationSearchResults locations={locations} />

        </>
    );
};

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
    query, onChange
}) => (
    <input
        type="text"
        placeholder="Search locations..."
        value={query}
        onChange={e => onChange(e.target.value)}
    />
);

const LocationsSearchMessage: React.FC<LocationSearchMessageProps> = ({
    loading, canPerformQuery, minQueryCharacters
}) => (
    <div>{
        loading ?
            <em>Loading...</em> :
            canPerformQuery ?
                '' :
                `Please type at least ${minQueryCharacters} to search`
    }</div>
);

const LocationSearchResults: React.FC<LocationSearchResultsProps> = ({
    locations
}) => (
    <ul>
        {
            locations.map(({ geonameid, name }) => (
                <li key={geonameid}>{name}</li>
            ))
        }
    </ul>
);

interface LocationSearchInputProps {
    query: string;
    onChange: (query: string) => void;
};

interface LocationSearchMessageProps {
    loading: boolean;
    canPerformQuery: boolean;
    minQueryCharacters: number;
};

interface LocationSearchResultsProps {
    locations: Location[];
};

interface Location {
    geonameid: number;
    name: string;
};

export default LocationsSearch;