<template>
  <div class="tab tab--sync">
    <h1>Доступ с другого устройства</h1>
    <div class="tab__block">
      <div class="tab__block--header">
        <label class="title">Включить доступ с другого устройства</label>
        <toggle-button
          :value="false"
          :width="42"
          :height="18"
          :sync="true"
        />
      </div>
    </div>
    <p>
      Для работы данного функционала, необходимо войти в свой аккаунт MeshHouse, привязать мобильное устройство.
      На компьютере приложение должно быть запущено.
      Используя данный функционал, вы соглашаетесь с
      <a href="https://github.com/microsoft">политикой конфиденциальности</a>.
    </p>
    <h2>Локальные каталоги</h2>
    <p>
      Включенные ниже каталоги будут доступны для чтения с мобильных устройств.
    </p>
    <div
      v-for="(obj, key) in databases"
      :key="key"
      class="tab__block"
    >
      <div class="tab__block--header">
        <label class="title">{{ obj.title }}</label>
        <toggle-button
          :value="enabledDatabase(obj.url)"
          :width="42"
          :height="18"
          :sync="true"
          @change="(event) => handleSliderChange(event, obj.url)"
        />
      </div>
    </div>
  </div>
</template>
<script src="./Remote.ts" lang="ts"></script>
