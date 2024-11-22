<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg p-6 shadow-xl w-96">
      <h2 class="text-xl font-bold mb-4 text-gray-800">{{ title }}</h2>
      <p class="text-gray-600" v-html="formattedMessage"></p>
      <div class="mt-6 flex justify-end">
        <button 
          @click="close" 
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition duration-300 transform hover:scale-105 ml-2"
        >
          Ok
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    title: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    message: { 
      type: String,
      required: true
    }
  },
  computed: {
    formattedMessage() {
      return this.message.replace(/\n/g, '<br />');
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
</style>
