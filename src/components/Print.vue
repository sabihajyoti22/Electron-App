<template>
  <div>
    <div id="pdf">
      Print this as a PDF file
    </div>
    <button @click="printPdf">Print</button>
  </div>
</template>

<script>
export default {
  methods: {
    printPdf() {
      const order = 'From Print Component for Receipt'
      const kot1 = 'From Print Component for KOT 1'
      const kot2 = 'From Print Component for KOT 2'
      electronAPI.sendToMainReceipt(order)
      electronAPI.sendToMainKOT(kot1)
      setTimeout(() => {
        electronAPI.sendToMainKOT(kot2)
      }, 500)
    }
  }
}
</script>