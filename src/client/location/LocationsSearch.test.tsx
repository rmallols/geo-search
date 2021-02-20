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
    }

    test('updates the input when the user starts to type', async () => {
        const { input, message } = setup();
        const messageText = 'Please type at least 3 characters to search';
        expect(input.value).toBe('');
        expect(message.textContent).toBe(messageText);
        fireEvent.change(input, { target: { value: 'le' } });
        expect(input.value).toBe('le');
        expect(message.textContent).toBe(messageText);
        act(() => jest.advanceTimersByTime(300));
    });

    test('x2', async () => {
        const { input, findAllByRole } = setup();

        fireEvent.change(input, { target: { value: 'lee' } });
        act(() => jest.advanceTimersByTime(1000));
        const listItems = await findAllByRole('location-search-result');
        const results = [
            jubileeShoalLocation.name, leedsCastleLocation.name
        ];
        expect(listItems).toHaveLength(results.length);

        listItems.forEach((listItem, index) => {
            expect(listItem.textContent).toBe(results[index])
        });
    });

    test('x3', async () => {
        const { input, findAllByRole } = setup();

        fireEvent.change(input, { target: { value: 'leed' } });
        act(() => jest.advanceTimersByTime(1000));
        const listItems = await findAllByRole('location-search-result');
        const results = [leedsCastleLocation.name];
        expect(listItems).toHaveLength(results.length);

        listItems.forEach((listItem, index) => {
            expect(listItem.textContent).toBe(results[index])
        });
    });
});