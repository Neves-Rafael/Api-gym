# RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [ ] Deve ser possível o usuário obter seu histórico de check-ins; 
- [ ] Deve ser possível o usuário buscar academias próximas;
- [ ] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [ ] Deve ser possível validar o check-in de um usuário;
- [ ] Deve ser possível cadastrar uma academia;

# RGs (Regras de negócio)
 
 - [x] O usuário não pode se cadastrar com um e-mail duplicado;
 - [x] O usuário não pode fazer 2 check-ins no mesmo dia;
 - [ ] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
 - [ ] O check-in só pode ser validado até 20 minutos após criado;
 - [ ] O check-in só pode ser validado por administradores;
 - [ ] A academia só pode ser cadastrada por administradores;

# RNFs (Requisitos não funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistindo em um banco PostgresSQL;
- [ ] Todas as listas de dados precisam estar paginadas em 20 itens por páginas;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);