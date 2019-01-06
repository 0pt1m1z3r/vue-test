<template lang="pug">
el-row.head(
  type="flex"
  justify="space-between"
)
  nuxt-link.logo(
    to="/"
  ) SuperShop

  template(v-if="formatCartTotalQuantity")
    nuxt-link.cart(
      to="/cart"
    )
      i.icon.el-icon-goods
      | {{ $t('VtHead.cart', cartLabel) }}
  template(v-else)
    .cart
      i.icon.el-icon-goods
      | {{ $t('VtHead.cartEmpty') }}
</template>

<style lang="scss" src="./VtHead.scss" scoped></style>
<script lang="ts" src="./VtHead.ts"></script>
