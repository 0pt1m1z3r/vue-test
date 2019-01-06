<template lang="pug">
el-card.card(
  shadow="hover"
)
  img.cardImage(
    :src="item.image"
  )
  .cardFoot
    div
      .cardTitle {{ item.title }}
      .cardPrice ${{ item.price }}
    div
      el-badge(
        :value="quantity"
        :hidden="!quantity"
      )
        el-button(
          type="primary"
          @click="$emit('addToCart')"
        ) {{ $t('VtProductItem.addToCart') }}
</template>

<style lang="scss" src="./VtProductItem.scss" scoped></style>
<script lang="ts" src="./VtProductItem.ts"></script>
