<template lang="pug">
div.wrap
  el-alert(
    v-if="orderedSuccess"
    :title="$t('PageCart.success')"
    type="success"
    center
    show-icon
  )

  el-alert(
    v-if="orderedError"
    :title="$t('PageCart.error')"
    type="error"
    center
    show-icon
  )

  vt-cart-list.table(
    :items="cartStore.items"
    :totalQuantity="cartStore.totalQuantity"
    :totalPrice="cartStore.totalPrice"
    @delete="deleteItem"
  )

  el-row.buttons(
    type="flex"
    justify="space-between"
  )
    div
      el-button(
        type="danger"
        :disabled="!cartStore.items.length"
        @click="reset"
      ) {{ $t('PageCart.buttonReset') }}
    div
      el-button(
        type="primary"
        :disabled="!cartStore.items.length"
        v-loading="pending"
        @click="order"
      ) {{ $t('PageCart.buttonOrder') }}

</template>

<style lang="scss" src="./index.scss" scoped></style>
<script lang="ts" src="./index.ts"></script>
