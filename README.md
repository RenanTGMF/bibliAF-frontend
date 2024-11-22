# **BibliAF Frontend**

**BibliAF Frontend** é a interface web do sistema **BibliAF**, desenvolvida para gerenciamento eficiente de bibliotecas. Utilizando **Vue.js**, **Tailwind CSS**, e **Firebase Storage**, este frontend conecta-se diretamente à API REST para fornecer uma experiência fluida e intuitiva para os usuários.

---

## **Funcionalidades**

- **Autenticação**: Registro e login de usuários.
- **Gerenciamento de Livros**: Cadastro, edição, exclusão e busca por título, autor ou gênero.
- **Gerenciamento de Autores**: Adição, edição, exclusão e listagem.
- **Gerenciamento de Gêneros**: Adição, edição, exclusão e listagem.
- **Gerenciamento de Usuários**: Controle de permissões e edição de informações.
- **Gerenciamento de Reservas e Empréstimos**: Controle intuitivo com integração à API.

---

## **Tecnologias Utilizadas**

- **Vue.js 3**: Framework JavaScript reativo.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **Vue Router**: Gerenciamento de rotas para navegação dinâmica.
- **Firebase Storage**: Armazenamento de imagens com URLs públicas.
- **Axios**: Cliente HTTP para comunicação com a API.

---

## **Requisitos**

- **Node.js** versão 16 ou superior.
- Conta no **Firebase** configurada com um bucket de armazenamento público.

---

## **Configuração do Projeto**

1. Clone o repositório:

   ```bash
   git clone https://github.com/RenanTGMF/bibliAF-frontend.git
   ```

2. Acesse o diretório do projeto:

   ```bash
   cd bibliaf
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. **Configurações Necessárias**:
   
   - **API**: Para consumir a API corretamente, edite o arquivo `src/api.js` e altere o IP do servidor da API para o seu servidor. Por exemplo:

     ```javascript
     baseURL = 'http://0.0.0.0:8888'; // Altere para o IP do servidor da API
     ```

   - **Firebase**: No arquivo `src/firebase/connectionFirebase.js`, configure as credenciais do Firebase para armazenar as imagens corretamente no Firebase Storage. Adicione as credenciais de seu projeto Firebase:

     ```javascript
     const firebaseConfig = {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'YOUR_AUTH_DOMAIN',
       projectId: 'YOUR_PROJECT_ID',
       storageBucket: 'YOUR_STORAGE_BUCKET',
       messagingSenderId: 'YOUR_SENDER_ID',
       appId: 'YOUR_APP_ID',
     };
     ```

     Substitua os valores pelas credenciais de seu projeto Firebase.

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run serve
   ```

6. Acesse o aplicativo no navegador:

   ```
   http://localhost:8081
   ```

---

## **Estrutura do Projeto**

```plaintext
bibliaf-frontend/
├── public/                   # Contém arquivos públicos, como o HTML inicial e imagens estáticas
│
├── src/                      # Contém todos os arquivos fonte do projeto
│   ├── assets/               # Imagens e outros arquivos estáticos usados pela aplicação
│   ├── components/           # Componentes Vue reutilizáveis
│   ├── firebase/             # Arquivos relacionados ao Firebase (ex: configuração de autenticação e banco de dados)
│   ├── router/               # Arquivo de configuração das rotas da aplicação
│   ├── App.vue               # Componente raiz da aplicação, onde a estrutura da interface é definida
│   ├── api.js                # Arquivo para configuração e funções de chamadas à API (para interagir com a API do backend)
│   ├── main.js               # Ponto de entrada do Vue, onde a aplicação é inicializada
│
├── .gitignore                # Arquivo para especificar quais arquivos/pastas devem ser ignorados pelo Git
├── README.md                 # Arquivo de documentação do projeto, explicando como configurar e rodar o projeto
├── babel.config.js           # Configuração do Babel, que ajuda na transpilação do código JavaScript moderno
├── jsconfig.json             # Arquivo de configuração para a IDE, definindo configurações de caminhos no projeto
├── package-lock.json         # Arquivo gerado automaticamente pelo NPM que garante que as dependências sejam consistentes
├── package.json              # Define as dependências do projeto, scripts e outras configurações do projeto
├── postcss.config.js         # Arquivo de configuração do PostCSS, utilizado para otimizar o CSS
├── tailwind.config.js        # Arquivo de configuração do Tailwind CSS, personalizando o framework
└── vue.config.js             # Configuração do Vue CLI, onde você pode ajustar configurações como proxy, build, etc.

```

---

## **Como o Upload de Imagens Funciona**

- As imagens das capas dos livros são enviadas diretamente para o **Firebase Storage**.
- Após o upload, a URL pública da imagem é retornada e enviada para o backend via a API REST.

---

## **Scripts Disponíveis**

- `npm run serve`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera os arquivos para produção.
- `npm run lint`: Executa verificações de linting no código.

---

## **Contribuindo**

1. Faça um fork do repositório.
2. Crie uma branch para suas alterações: `git checkout -b feature/nova-feature`.
3. Commit suas alterações: `git commit -m 'Adiciona nova feature'`.
4. Envie para o repositório remoto: `git push origin feature/nova-feature`.
5. Abra um Pull Request.
