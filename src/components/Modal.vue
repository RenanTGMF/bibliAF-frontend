<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg p-6 shadow-xl w-96">
      <h2 class="text-xl font-bold mb-4 text-gray-800">Confirmar Remoção</h2>
      <p class="text-gray-600">{{ message }}</p>
      <div class="mt-6 flex justify-end">
        <button 
          @click="confirmRemove" 
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-300 transform hover:scale-105"
        >
          Sim
        </button>
        <button 
          @click="close" 
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300 transform hover:scale-105 ml-2"
        >
          Não
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    onConfirm: {
      type: Function,
      required: true
    },
    message: { 
      type: String,
      required: true
    }
  },
  methods: {
    confirmRemove() {
      this.onConfirm();
      this.close();
    },
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
</style>
