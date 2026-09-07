# Ribeiro Painel de Clientes

## O que esta versão faz
- Login com e-mail e senha
- Cadastro de clientes pelo administrador
- Vencimento automático em 30 dias
- Renovação rápida por +30 dias
- Bloqueio e liberação manual
- Tela de acesso vencido
- Botão de renovação pelo WhatsApp
- Painel com ativos, vencendo e vencidos
- Atualização opcional por R$ 9,90

## Importante sobre proteção de sites
Este projeto controla o acesso ao PAINEL/ÁREA DO CLIENTE.
Se você quiser impedir totalmente que um site estático separado seja aberto depois do vencimento, não basta esconder a página com JavaScript. Para proteção real do conteúdo de cada site, use uma camada de autenticação no servidor/Edge Function ou sirva o conteúdo protegido por funções.

## 1. Criar Supabase
Crie um projeto no Supabase.
Abra SQL Editor e execute `supabase.sql`.

## 2. Criar o administrador
No Supabase:
Authentication > Users > Add user

Depois copie o UUID do usuário administrador e execute no SQL Editor:

insert into public.profiles
(id,email,full_name,plan_name,monthly_price,update_price,status,expires_at,is_admin)
values
('COLE_O_UUID','SEU_EMAIL','Administrador','Admin',0,0,'active',now()+interval '10 years',true);

## 3. Variáveis no Netlify
Em Project configuration > Environment variables:

SUPABASE_URL = URL do projeto Supabase
SUPABASE_ANON_KEY = chave anon/public
SUPABASE_SERVICE_ROLE_KEY = chave service_role

A chave service_role fica SOMENTE no Netlify. Nunca coloque essa chave no HTML.

## 4. Publicar
Como este projeto usa Netlify Functions e função agendada, o ideal é:
1. Criar um repositório no GitHub.
2. Enviar todos os arquivos deste ZIP.
3. No Netlify, Add new project > Import an existing project.
4. Conectar o GitHub.
5. Adicionar as variáveis de ambiente.
6. Fazer o deploy.

## 5. Como usar
Entre com a conta de administrador.
Cadastre:
- nome
- e-mail
- senha
- plano
- valor
- dias de acesso

O cliente já poderá entrar com e-mail e senha.

Quando vencer:
- a tela mostra Acesso vencido;
- o botão de renovação abre o WhatsApp;
- o administrador clica em +30 dias para liberar.

## Segurança
O administrador é validado no servidor usando o token do Supabase.
Criação e renovação de usuários usam a service-role somente dentro da Netlify Function.
