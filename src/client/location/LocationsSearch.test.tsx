import { render, fireEvent, act } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import LocationsSearch from './LocationsSearch';

describe('LocationSearch', () => {

    const jubileeShoalLocation = { geonameid: 1, name: 'Jubilee Shoal' };
    const leedsCastleLocation = { geonameid: 2, name: 'Leeds Castle' };
    const mockQueries: MockQueries = {
        'lee': [jubileeShoalLocation, leedsCastleLocation],
        'leed': [leedsCastleLocation],
    };
    interface MockQueries {
        [key: string]: MockQuery[]
    };
    interface MockQuery {
        geonameid: number;
        name: string;
    }
    const server = setupServer(
        rest.get('/location', (req, res, ctx) => {
            const query: string = req.url.searchParams.get('q') || '';
            return res(ctx.json(mockQueries[query] || []));
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    });

    const setup = () => {
        const utils = render(<LocationsSearch />);
        const input = utils.getByRole('location-search-input');
        const message = utils.getByRole('location-search-message');
        return { input, message, ...utils };
    };

    const debounceTypedText = () => act(() => jest.advanceTimersByTime(300));

    test('updates the input when the user starts to type', async () => {
        const { input, message } = setup();

        // by default, the search input is empty and a cta text is displayed
        const messageText = 'Please type at least 3 characters to search';
        expect(input.value).toBe('');
        expect(message.textContent).toBe(messageText);

        // when some text with < 3 characters is entered
        fireEvent.change(input, { target: { value: 'le' } });
        expect(input.value).toBe('le');
        debounceTypedText();

        // then no search is triggered yet, and the cta text remains
        expect(message.textContent).toBe(messageText);
        debounceTypedText();
    });

    [
        {
            query: 'lee',
            expectedLocations: [
                jubileeShoalLocation.name, leedsCastleLocation.name
            ]
        },
        {
            query: 'leed',
            expectedLocations: [leedsCastleLocation.name]
        }
    ].forEach(({ query, expectedLocations }) => {

        test([
            `displays "${expectedLocations.join(', ')}"`,
            `when the query "${query}" is entered`
        ].join(' '), async () => {
            const { input, findAllByRole } = setup();

            // given we enter a valid query
            fireEvent.change(input, { target: { value: query } });
            debounceTypedText();

            // when the results are displayed
            const listItems = await findAllByRole('location-search-result');

            // they match the expected ones
            expect(listItems).toHaveLength(expectedLocations.length);
            listItems.forEach((listItem, index) => {
                expect(listItem.textContent).toBe(expectedLocations[index]);
            });
        });
    });
});