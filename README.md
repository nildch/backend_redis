## Projetinho antigo do meu replit

Backend para Estudo

# 14/06/2023

# usado para utilizar redis para a atividade de gcsi

Para rodá - lo basta seguir esses comandinhos

```cd backend-redis ```

```docker-compose up -d```

Para testar :

```curl http://localhost:3000/api/users```

``` curl http://localhost:3000/api/products ```

# Concluindo

As duas entidades contempladas, usuários e produtos, seguiram esse mesmo fluxo. Toda a infraestrutura foi orquestrada via docker-compose, com os serviços da aplicação, banco e cache rodando em containers isolados e se comunicando pela mesma rede interna. O sistema foi implantado no Railway e as rotas responderam corretamente, confirmando o funcionamento do cache através do campo fromCache retornado nas respostas da API.
