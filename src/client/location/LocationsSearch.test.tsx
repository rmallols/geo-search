import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import LocationsSearch from './LocationsSearch';

describe('LocationSearch', () => {

    const londonLocation = { geonameid: '1', location: 'London' };
    const hiltonLocation = { geonameid: '2', location: 'Hilton' };
    const server = setupServer(
        rest.get('/location', (req, res, ctx) => (
            res(ctx.json([londonLocation]))
        ))

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
        fireEvent.change(input, { target: { value: 'lo' } });
        expect(input.value).toBe('lo');
        expect(message.textContent).toBe(messageText);
        act(() => jest.advanceTimersByTime(300));
    });

    test('x2', async () => {
        const { input, findByRole, getAllByRole } = setup();

        fireEvent.change(input, { target: { value: 'lon' } });
        act(() => jest.advanceTimersByTime(1000));
        const listItems = await findByRole('location-search-result');
        expect(listItems).toBeInTheDocument()

        // const x = getAllByRole('location-search-result')
        // titleElements.forEach((titleElement, index) => {
        //     expect(titleElement.textContent).toBe(companies[index]);            
        // });  

        // x.forEach((item, index) => {
        //     console.log(item);
        // });
    });
});