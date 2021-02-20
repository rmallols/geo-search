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
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    const setup = () => {
        const utils = render(<LocationsSearch />);
        const input = utils.getByRole('location-search-input');
        return { input, ...utils };
    };

    // There's a well known limitation on react-testing-library where
    // it reports a warning while testing components that haven't been
    // fully flushed (e.g. because of an in-progress debouncing
    // as it is the here). We can mitigate the issue by artifically
    // advancing time arbitrarily - which won't affect the performance
    // of the test at all, as we are using fake timers
    // https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    const debounceTypedText = () => act(() => jest.advanceTimersByTime(300));

    test('updates the input when the user starts to type', async () => {
        const { input, findByText } = setup();

        // by default, the search input is empty and a cta text is displayed
        const messageText = 'Please type at least 3 characters to search';
        expect(input.value).toBe('');
        await findByText(messageText);

        // when some text with < 3 characters is entered
        fireEvent.change(input, { target: { value: 'le' } });
        expect(input.value).toBe('le');
        debounceTypedText();

        // then no search is triggered yet, and the cta text remains
        await findByText(messageText);

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

    test('displays a message when the query returns no results', async () => {
        const { input, findByText } = setup();

        const messageText = (
            'No locations found, please update your query to search again'
        );

        // when we force a query that doesn't yield any results
        fireEvent.change(input, { target: { value: 'leee' } });

        // then the "no results" message will be displayed
        await findByText(messageText);
    });
});