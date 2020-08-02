import common from './common';
// Views
import catalog from './views/catalog';
// Modals
import modals from './modals/';
// Context menus
import catalogContext from './context/catalog';
import modelContext from './context/model';
// Dropdown, hints
import DDMenu from './dropdowns/mainmenu';
import navbarHint from './hints/navbar';
// Validation
import fields from './fields';
import validationMessages from 'vee-validate/dist/locale/ru.json';

export default {
  common: common,
  context: {
    catalog: catalogContext,
    model: modelContext
  },
  dropdowns: {
    mainmenu: DDMenu
  },
  fields: fields,
  hints: {
    navbar: navbarHint
  },
  modals: modals,
  validations: validationMessages,
  views: {
    catalog: catalog
  },
};
