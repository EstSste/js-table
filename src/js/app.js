//Vendors
import elementClosest from 'element-closest';

//Next modules
import Nx from './core/Nx';
import NxPageLoad from './core/NxPageLoad';
import NxHelpers from './core/NxHelpers';
import NxPage from './core/NxPage';
import NxAlert from './core/NxAlert';
import NxCollapse from './core/NxCollapse';
import NxPolyfills from './core/NxPolyfills.js';

// modules
import Table from './modules/Table'

elementClosest(window);

window.nx = new Nx();

window.nx.helpers = new NxHelpers();
window.nx.onLoad = new NxPageLoad();
window.nx.nxCollapse = new NxCollapse();

window.nx.page = new NxPage();
window.nx.alert = new NxAlert();
window.nx.polyfills = new NxPolyfills();

window.nx.addPlugin([
]);

Table.build();