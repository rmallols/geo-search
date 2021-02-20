# Geo Search App

This project showcases the integration of a locations API with
a React app, using SQLite as the persistency layer.

It displays a text box and fetches the matching locations via REST API,
when the number of typed characters is >= 3.
A debounce mechanism has been included to avoid excessive requests to the backend.
A loading message is displayed while results are being retrieved.

The app supports client side [routing](https://reactrouter.com/) in 
preparation for upcoming features (e.g. new views, redirection logic, etc).

The project tries to follow best coding practises defined by 
[React](https://reactjs.org/docs/getting-started.html) and
[AirBnB](https://github.com/airbnb/javascript).

## Tech stack
#### Frontend (bootstrapped with [Create-react-app](create-react-app.dev/))
* HTML
* CSS
* JavaScript
* React
* TypeScript

#### Backend
* Node
* Express
* SQLite connector

#### Database
* SQLite

## Installing dependencies
`npm i`

## Running the app
`npm start`

## Testing the app
`npm test`

## Proposed changes
#### Frontend
1. Improve bookmarking by persisting search queries on the URL
(e.g. `http://localhost?q=lee`).
1. Add a CSS preprocessor (e.g. with [Sass](https://sass-lang.com/)).
2. Improve the UI by adding some context and styling for mobile & desktop.
2. Extend unit test coverage (e.g. for the `fetch` component).
3. Add E2E test coverage (e.g. [Cypress](https://www.cypress.io/)).
4. Add Visual Regression test coverage (e.g. with 
[Playwright](https://github.com/microsoft/playwright)
).
5. Introduce [Prettier](https://prettier.io/) to ensure and automatically 
format the code base according to the team's styling guidelines.

### Backend
1. Introduce TypeScript and test coverage.
2. Optimise payload size by replacing the naming-based location structure 
with a serialised sequences, e.g. from: 
`{ geonameid: 1, name: 'Jubilee Shoal' }` to `[1, 'Jubilee Shoal']`

### Database
1. Externalise/decouple the database from the backend.