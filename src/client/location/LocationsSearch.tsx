import { useState, useEffect } from 'react';
import fetchData from '../common/fetch';
import useDebounce from '../common/useDebounce';

const LocationsSearch = () => {

    const manageQueryChange = async () => {
        if (canPerformQuery) {
            setLoading(true);
            setLocations([]);
            setLocations(await fetchData(`/location?q=${debouncedQuery}`));
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
                locations={locations}
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
        role="location-search-input"
        value={query}
        onChange={e => onChange(e.target.value)}
    />
);

const LocationsSearchMessage: React.FC<LocationSearchMessageProps> = ({
    loading, canPerformQuery, minQueryCharacters, locations
}) => (
    <div>{
        loading ?
            <em>Loading...</em> :
            canPerformQuery ?
                locations.length ?
                    '' :
                    'No locations found, please update your query to search again' :
                `Please type at least ${minQueryCharacters} characters to search`
    }</div>
);

const LocationSearchResults: React.FC<LocationSearchResultsProps> = ({
    locations
}) => (
    <ul>
        {
            locations.map(({ geonameid, name }) => (
                <li
                    role='location-search-result'
                    key={geonameid}>
                    {name}
                </li>
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
    locations: Location[];
};

interface LocationSearchResultsProps {
    locations: Location[];
};

interface Location {
    geonameid: number;
    name: string;
};

export default LocationsSearch;