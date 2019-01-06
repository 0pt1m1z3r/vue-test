<template lang="pug">
div
  .protuctsList(
    v-if="!error"
    v-loading="pending"
    element-loading-background="transparent"
  )
    vt-product-item.protuctItem(
      v-for="product in products"
      :key="product.id"
      :item="product"
      @addToCart="onAddToCart(product)"
    )
  
  div.error(v-else)
    h1 Error
    p {{ $t('PageMain.error') }}
</template>

<style lang="scss" src="./index.scss" scoped></style>
<script lang="ts" src="./index.ts"></script>
