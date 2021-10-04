import common from './common';
// Views
import catalog from './views/catalog';
import favorites from './views/favorites';
// Modals
import modals from './modals/';
// Context menus
import catalogContext from './context/catalog';
import categoryContext from './context/category';
import modelContext from './context/model';
// Dropdown, hints
import download from './dropdowns/download';
import DDMenu from './dropdowns/mainmenu';
import hints from './hints';
// Validation
import fields from './fields';
import validationMessages from './validation';

import notifications from './notifications';

export default {
  common: common,
  context: {
    catalog: catalogContext,
    category: categoryContext,
    model: modelContext
  },
  dropdowns: {
    download: download,
    mainmenu: DDMenu
  },
  fields: fields,
  hints: hints,
  modals: modals,
  notifications: notifications,
  validations: validationMessages,
  views: {
    catalog: catalog,
    favorites: favorites
  }
};
