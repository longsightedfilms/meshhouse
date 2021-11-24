<template>
  <div
    class="category"
    tabindex="0"
    @dblclick="onDoubleClick"
    @contextmenu.prevent="onRightClick"
  >
    <div class="category__image">
      <svg
        v-if="type === 'parent'"
        class="image"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 200"
      >
        <g data-name="Layer 2">
          <g data-name="File icons">
            <path
              fill="#006fcc"
              stroke="#299eff"
              stroke-miterlimit="10"
              stroke-width="8"
              d="M4 196h248V4H133l-32 33H4v159z"
            />
            <path
              fill="#299eff"
              d="M179.75 73.04l-34.18 82.46h-10.4l34.02-82.46z"
            />
            <g fill="#299eff">
              <path d="M98.44 156.1a7 7 0 01-4.98-1.93 6.11 6.11 0 01-2.05-4.62 6.25 6.25 0 012.05-4.68 6.96 6.96 0 014.98-1.96 7.1 7.1 0 015.05 1.96 6.22 6.22 0 012.08 4.68 6.08 6.08 0 01-2.08 4.62 7.16 7.16 0 01-5.05 1.93zM122.56 156.1a7 7 0 01-4.98-1.93 6.11 6.11 0 01-2.05-4.62 6.25 6.25 0 012.05-4.68 6.96 6.96 0 014.98-1.96 7.1 7.1 0 015.05 1.96 6.22 6.22 0 012.08 4.68 6.08 6.08 0 01-2.08 4.62 7.16 7.16 0 01-5.05 1.93z" />
            </g>
          </g>
        </g>
      </svg>
      <svg
        v-if="type === 'simple'"
        class="image"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 200"
      >
        <g data-name="Layer 2">
          <g
            stroke="#299eff"
            stroke-miterlimit="10"
            data-name="File icons"
          >
            <path
              fill="#006fcc"
              stroke-width="8"
              d="M4 196h248V4H133l-32 33H4v159z"
            />
            <g
              fill="none"
              stroke-width="5"
            >
              <path d="M83.48 89.55h69.83v69.83H83.48z" />
              <path d="M104.43 68.6h69.83v69.83h-69.83zM103.61 67.81L82.66 88.76M174.26 68.6l-20.95 20.95M154.14 160.19l20.95-20.95M83.48 158.68l20.95-20.95" />
            </g>
          </g>
        </g>
      </svg>
      <svg
        v-if="type === 'new'"
        class="image"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 200"
      >
        <g data-name="Layer 2">
          <g
            stroke="#299eff"
            stroke-miterlimit="10"
            stroke-width="8"
            data-name="File icons"
          >
            <path
              fill="#006fcc"
              d="M4 196h248V4H133l-32 33H4v159z"
            />
            <g fill="none">
              <path d="M128 158V68M173 113H83" />
            </g>
          </g>
        </g>
      </svg>
    </div>
    <p class="category__title">
      {{ categoryName }}
    </p>
  </div>
</template>

<script lang="ts" src="./CategoryCard.ts" />
