<template>
  <div class="tab tab--sync">
    <h1>Синхронизация</h1>
    <div class="tab__block tab__block--account">
      <img
        src="/assets/integrations/wide/meshhouse.svg"
        alt="MeshHouse logo"
      >
      <h2>Зарегистрируйте аккаунт MeshHouse, чтобы получить доступ к следующим возможностям:</h2>
      <ul>
        <li>Синхронизация настроек между компьютерами</li>
        <li>
          Удаленный доступ с телефона до компьютера:
          <ul>
            <li>Просмотр локальных каталогов (в режиме "только для чтения")</li>
            <li>Использование включенных интеграций</li>
          </ul>
        </li>
      </ul>
      <ValidationObserver
        ref="form"
        tag="form"
      >
        <b>Войти в аккаунт</b>
        <ValidationProvider
          v-slot="{ errors }"
          name="email"
          class="input-group"
          rules="required|email"
        >
          <label>E-mail</label>
          <input
            v-model="form.email"
            type="email"
            class="input"
            placeholder="example@meshhouse.art"
            required
          >
          <span class="input__message">
            {{ errors[0] }}
          </span>
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          name="password"
          class="input-group"
          rules="required|min:4"
        >
          <label>Пароль</label>
          <input
            v-model="form.password"
            type="password"
            class="input"
            placeholder="qwerty"
            required
          >
          <span class="input__message">
            {{ errors[0] }}
          </span>
        </ValidationProvider>
        <div class="form--lower">
          <v-button
            busy
          >
            Войти
          </v-button>
          <div class="links">
            <a href="https://github.com/microsoft">Регистрация</a>
            <a href="https://github.com/microsoft">Забыли пароль?</a>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <div class="tab__block">
      <div class="tab__block--header">
        <label class="title">Включить синхронизацию настроек</label>
        <toggle-button
          :value="false"
          :width="42"
          :height="18"
          :sync="true"
        />
      </div>
    </div>
    <p>
      Используя данный функционал, вы соглашаетесь с
      <a href="https://github.com/microsoft">политикой конфиденциальности</a>.
    </p>
  </div>
</template>
<script src="./Index.ts" lang="ts"></script>
