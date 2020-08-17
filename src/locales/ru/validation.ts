import validationMessages from 'vee-validate/dist/locale/ru.json';

export default {
  messages: {
    ...validationMessages.messages,
    notIntegrationName: 'Каталог не может иметь такое же название, как у существующих интеграций'
  }
};
