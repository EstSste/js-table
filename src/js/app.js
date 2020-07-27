//Core modules
import Nx from './core/Nx';
import NxHelpers from './core/NxHelpers';
import NxAlert from './core/NxAlert';
import NxPolyfills from './core/NxPolyfills.js';

// plugins
import LabelDynamic from './plugins/LabelDynamic'

// modules
import Table from './modules/Table'

window.nx = new Nx();

window.nx.helpers = new NxHelpers();

window.nx.alert = new NxAlert();
window.nx.polyfills = new NxPolyfills();

window.nx.addPlugin([
    new LabelDynamic()
]);

Nx.setup();

Table.build();