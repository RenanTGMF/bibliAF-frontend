<template>
  <div class="p-6 md:p-10 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen flex items-center justify-center">
    <div v-if="book" class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-center mb-6 text-primary">{{ book.id ? 'Editar Livro' : 'Adicionar Livro' }}</h2>

      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="saveBook" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="title">Título</label>
          <input 
            v-model="book.title" 
            type="text" 
            id="title" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required 
            placeholder="Digite o título do livro"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="author">Autor</label>
          <select 
            v-model="book.authorId" 
            id="author" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required
          >
            <option disabled value="">Selecione um autor</option>
            <option v-for="author in authors" :key="author.id" :value="author.id">
              {{ author.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="genre">Gênero</label>
          <select 
            v-model="book.genreId" 
            id="genre" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required
          >
            <option disabled value="">Selecione um gênero</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre.id">
              {{ genre.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="isbn">ISBN</label>
          <input 
            v-model="book.isbn" 
            type="text" 
            id="isbn" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required 
            placeholder="Digite o ISBN do livro"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="summary">Resumo</label>
          <textarea 
            v-model="book.summary" 
            id="summary" 
            rows="4" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            placeholder="Digite um resumo do livro (máx. 500 caracteres)"
          ></textarea>
        </div>

        <div class="flex space-x-4">
          <div class="flex-1">
            <label class="block text-gray-700 font-semibold mb-2" for="publicationYear">Ano de Publicação</label>
            <input 
              v-model="book.publicationYear" 
              type="number" 
              id="publicationYear" 
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
              required 
              placeholder="Digite o ano de publicação"
            />
          </div>

          <div class="flex-1">
            <label class="block text-gray-700 font-semibold mb-2" for="copies">Cópias</label>
            <input 
              v-model="book.copies" 
              type="number" 
              id="copies" 
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
              required 
              placeholder="Digite o número de cópias disponíveis"
            />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="imageUrl">Imagem do Livro</label>

          <div v-if="imageUrl">
            <img :src="imageUrl" alt="Imagem do livro" class="w-200 h-100 rounded-md mb-4">
          </div>
          <div v-else-if="book.image">
            <img :src="book.image" alt="Imagem do livro" class="w-200 h-100 rounded-md mb-4">
          </div>

          <input 
            type="file" 
            @change="handleImageUpload" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200"
            accept="image/*"
          />
          <p v-if="imageUrl" class="text-sm text-gray-600 mt-2">Imagem carregada com sucesso!</p>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button @click="goBack" type="button" class="bg-gray-400 text-white px-4 py-2 rounded-md shadow hover:bg-gray-500 transition duration-200">Cancelar</button>
          <button 
          type="submit" 
          class="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary-dark transition duration-200" 
          :disabled="isUploadingImage"
        >
          Salvar
        </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { storage } from '../firebase/connectionFirebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import api from '../api';

export default {
  name: 'EditBook',
  data() {
    return {
      book: null,
      authors: [],
      genres: [],
      isLoading: true,
      errorMessage: null,
      imageUrl: null,
      isUploadingImage: false,
    };
  },
  created() {
    this.fetchBookDetails();
    this.fetchAuthors();
    this.fetchGenres();
  },
  methods: {
    async fetchBookDetails() {
      const bookId = this.$route.params.id;
      if (bookId) {
        try {
          const response = await api.get(`/books/${bookId}`);
          this.book = response.data;
          this.book.authorId = this.book.author.id; 
          this.book.genreId = this.book.genre.id;
        } catch (error) {
          this.errorMessage = 'Erro ao buscar detalhes do livro.';
          console.error('Erro ao buscar detalhes do livro:', error);
        }
      } else {
        this.resetBook();
      }
    },
    resetBook() {
      this.book = {
        title: '',
        authorId: null,
        genreId: null,
        publicationYear: null,
        isbn: '',
        summary: '',
        copies: null,
        image: null,
      };
    },
    async fetchAuthors() {
      this.isLoading = true;
      try {
        const response = await api.get('/authors');
        this.authors = response.data._embedded.authorDtoList;
      } catch (error) {
        this.errorMessage = 'Erro ao buscar autores.';
        console.error('Erro ao buscar autores:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchGenres() {
      this.isLoading = true;
      try {
        const response = await api.get('/genres');
        this.genres = response.data._embedded.genreDtoList;
      } catch (error) {
        this.errorMessage = 'Erro ao buscar gêneros.';
        console.error('Erro ao buscar gêneros:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const image = new Image();
        image.src = reader.result;

        image.onload = async () => {
          const isPortrait = image.height > image.width;
          const aspectRatio = image.width / image.height;

          if (!isPortrait || Math.abs(aspectRatio - 0.75) > 0.1) {
            alert("A imagem deve ser no formato retangular em pé.");
            return;
          }

          this.isUploadingImage = true;
          try {
            const imageRef = ref(storage, `books/${Date.now()}`);
            const blob = await fetch(reader.result).then(res => res.blob());
            await uploadBytes(imageRef, blob);
            const downloadURL = await getDownloadURL(imageRef);
            this.imageUrl = downloadURL;
          } catch (error) {
            this.errorMessage = 'Erro ao fazer upload da imagem.';
            console.error('Erro ao fazer upload da imagem:', error);
          } finally {
            this.isUploadingImage = false;
          }
        };
      };

      reader.readAsDataURL(file);
    },
    async saveBook() {
      const bookData = {
        title: this.book.title,
        author: { id: this.book.authorId },
        genre: { id: this.book.genreId },
        publicationYear: this.book.publicationYear,
        isbn: this.book.isbn,
        summary: this.book.summary,
        copies: this.book.copies,
        copiesAvailable: this.book.copiesAvailable || this.book.copies,
        image: this.imageUrl || this.book.image,
      };
      console.log(bookData, this.book.image, this.image);
      try {
        if (this.book.id) {
          await api.put(`/books`, { id: this.book.id, ...bookData });
        } else {
          await api.post(`/books`, bookData);
        }
        this.$router.push('/admin/books'); 
      } catch (error) {
        this.errorMessage = 'Erro ao salvar o livro. Tente novamente mais tarde.';
        console.error('Erro ao salvar o livro:', error);
      }
    },
    goBack() {
      this.$router.push('/admin/books');
    },
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}
</style>
