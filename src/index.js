import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { makeMainRoutes } from './routes';

import 'bulma/css/bulma.css';
import './index.css';

const routes = makeMainRoutes();

ReactDOM.render(
    routes,
    document.getElementById('root')
);

registerServiceWorker();
