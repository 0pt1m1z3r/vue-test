<template lang="pug">
el-table(
  :data="itemsOrdered"
  :summary-method="getSummaries"
  show-summary
)
  el-table-column(
    width="80"
  )
    template(slot-scope="scope")
      img.image(
        :src="scope.row.product.image"
      )

  el-table-column(
    :label="$t('PageCart.columnTitle')"
    min-width="160"
  )
    template(slot-scope="scope")
      | {{ scope.row.product.title }}
  
  el-table-column(
    :label="$t('PageCart.columnPrice')"
    min-width="100"
  )
    template(slot-scope="scope")
      | ${{ scope.row.product.price }}

  el-table-column(
    :label="$t('PageCart.columnQuantity')"
    min-width="130"
  )
    template(slot-scope="scope")
      el-input-number(
        size="small"
        v-model="scope.row.quantity"
        :min="1"
      )

  el-table-column(
    :label="$t('PageCart.columnPriceTotal')"
    prop="quantity"
    min-width="100"
  )
    template(slot-scope="scope")
      | ${{ itemPriceTotal(scope.row) }}
  
  el-table-column(
    min-width="50"
  )
    template(slot-scope="scope")
      el-button(
        type="danger"
        icon="el-icon-delete"
        @click="$emit('delete', scope.row)"
        circle
      )
</template>

<style lang="scss" src="./VtCartList.scss" scoped></style>
<script lang="ts" src="./VtCartList.ts"></script>
