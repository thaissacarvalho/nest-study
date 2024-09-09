# Nest + Prisma

Descrição: O projeto tem a intenção de ensinar a integrar o Nest.js com Prisma e utilizando banco de dados SQL.

O projeto se baseia em uma criação de usuário e fazer um CRUD, além da autenticação e autorização para determinadas funcionalidades.

Adicionado também a forma de access token e refresh token, além dos três metodos de trocar a senha: Forgot Password, Change Password e Reset Password.

### Inicialização

Instalar todos os pacotes: `npm install`

Inicializar e atualizar automaticamente: `npm run start:dev`

Fazer o processo de build: `npm run build`

Inicializar sem atualizar: `npm run start`

### Anotações de Estudo

`NEST`

꠳ É uma estrutura para construir aplicativos Node.js do lado do servidor eficientes e escalonáveis.

Comandos:

-   Gerar service: `npx nest generate service nome-file`
-   Gerar module: `npx nest generate module nome-file`
-   Gerar controller: `npx nest generate controller nome-file`

Explicando arquitetura:

-   types
    -   index.ts: Metodo reciclavel de tipo para ser usado em mais de um lugar do projeto.
-   modules/users
    -   Controller: Metodo HTTP.
    -   DTO: Criação de interface de determinado Controller.
    -   DtoInfra: Metodo de validação dos componentes do Model.
    -   user.module.ts: Utilizado para importar Services, Controller etc.
    -   user.service.ts: Utilizado para a lógica para CRUD ou outras coisas.
-   modules/auth
    -   Controller: Metodo POST para acessar a conta.
    -   auth.module.ts: Utilizado para importar Services, Providers, Guards etc.
    -   auth.service.ts: Criado para armazenar a lógica de validação de usuário e login.
    -   constants.ts: Armazenamento do TOKEN de segurança.
    -   jwt.guard.ts: Estendendo uma forma da aplicação de login afim de proteger as rotas e endpoints do JWT.
    -   jwt.strategy.ts: Definição de estratégia de autenticação ao usar o JWT para garantir a validade da chave secreta.
-   modules/email
    -   email.service.ts: Lógica de criação e utilização do Nodemailer para disparar emails.
    -   email.module.ts: Utilizado para importar o serviço de disparar emails.
-   utils/
    -   hash.service.ts: Local onde é feita a cryptografia e comparação entre as senhas.

site: https://nestjs.com/

`PRISMA`

꠳ É um ORM utilizado para simplificação de criação de querys SQL.

-> Migrate (criar database): `npx prisma migrate dev --name nameModel`

-> Atualizar migrates: `prisma migrate dev or prisma db push`

Explicando a arquitetura:

-   prisma
    -   migration: Após dar um `npx prisma migrate dev --name init`, cria um arquivo atualizando o SQL.
    -   index.ts: Utilizado como um possivel "Seeders".
    -   schema.prisma: Ocorre a criação do Model e exemplificamos qual banco de dados será utilizado.
-   src/prisma
    -   prisma.service.ts: Utilizado para fazer a implementação do Prisma Service com o Prisma Cliente.

site: https://www.prisma.io/

`JWT`

꠳ É utilizada para autenticação e autorização de dados no geral.

Caso queira gerar um token aleatório: `openssl rand -base64 32`

Certifique-se que tem o "OPEN SSL" instalado em sua máquina.

`Bcrypt`

꠳ É utilizada para criptografia e comparação de senhas.

`Nodemailer`
-> Utilizado para integrar um serviço de email para disparar tokens que possam ser feitos a alteração da senha.

Caso queira entrar em contato para saber mais sobre o projeto:

-   email: thaissa-carvalho@outlook.com
-   linkedin: https://www.linkedin.com/in/thaissacarvalho-ti/
