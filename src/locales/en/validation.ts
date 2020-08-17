import validationMessages from 'vee-validate/dist/locale/en.json';

export default {
  messages: {
    ...validationMessages.messages,
    notIntegrationName: 'Catalog cannot have the same name as existing integrations'
  }
};
