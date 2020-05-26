import common from './common';
// Views
import catalog from './views/catalog';
// Modals
import addCatalog from './modals/addCatalog';
import settings from './modals/settings';
import about from './modals/about';
import properties from './modals/properties';
import addCategory from './modals/addCategory';
import deleteCategory from './modals/deleteCategory';
import editCategory from './modals/editCategory';
import updater from './modals/updater';
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
  modals: {
    about: about,
    addCatalog: addCatalog,
    addCategory: addCategory,
    deleteCategory: deleteCategory,
    editCategory: editCategory,
    settings: settings,
    properties: properties,
    updater: updater
  },
  validations: validationMessages,
  views: {
    catalog: catalog
  },
};
