# Autonomia de atualização da landing page

Requisitos aprovados, funcionamento da edição e exemplos da API em um único documento. A implementação atual tem um formulário simples em `/admin`, gravação no Vercel Blob e prévia da foto para computador e celular.

## 1. Conteúdos editáveis e decisões aprovadas

| Área | Pode alterar | Permanece fixo |
| --- | --- | --- |
| Diretoria | Somente os sete nomes. As iniciais acompanham os nomes automaticamente. | Cargos, áreas e ordem de apresentação. |
| Nossas Diretorias | Somente a foto. | Legenda e descrição alternativa. |
| Contato | Somente o telefone/WhatsApp. | E-mail `comercial@atlanticaconsultoria.com`, identificação “Diretor Comercial”, endereço e horário. |

- [x] Edição dos nomes implementada.
- [x] Troca da foto implementada, com prévia e opção de descartar antes de salvar.
- [x] Edição do telefone implementada.
- [x] E-mail fixo e identificação do contato sem nome pessoal.

A foto original está em `public/diretoria-original.jpeg`. Os dados originais são usados enquanto a API carrega ou quando a leitura falha.

## 2. Testar localmente

Com o projeto vinculado e as variáveis de desenvolvimento disponíveis em `.env.local`, execute:

```sh
npx vercel dev
```

Abra o endereço mostrado no terminal e acrescente `/admin`. O formulário solicita a senha ao salvar. As Functions carregam `.env.local` no desenvolvimento; em Production e Preview, usam as variáveis do ambiente da Vercel.

`npm run dev` abre somente o frontend, sem executar as APIs de leitura e gravação.

Para executar os testes isolados, sem acessar o Blob:

```sh
node --test tests/content.test.js
```

Sete testes automatizados passaram. A leitura real pela API local também foi validada com resposta HTTP 200 e sete nomes. A gravação real ainda precisa da conferência final.

## 3. API para a interface

O fluxo é: carregar os dados, preencher o formulário e enviar os dados atualizados. Os exemplos abaixo são ilustrativos; use sempre a `revision` recebida da API.

### Carregar os dados

Envie `GET /api/content`, sem corpo e sem senha.

Resposta `200` antes da primeira gravação:

```json
{
  "names": [
    "Yasmim Teixeira",
    "Donato Mörschbächer",
    "Luís Gustavo Brum",
    "Huesley Padilha",
    "Miguel Vigolo",
    "Maria Isabela Gesswein",
    "Bibiana Garcia"
  ],
  "phone": "(51) 99156-5793",
  "photo": null,
  "revision": ""
}
```

`names` segue esta ordem fixa: Presidência, Vice-Presidência, Administrativo-Financeiro, Comercial, Gestão de Pessoas, Marketing e Projetos.

`photo: null` indica a foto original. Depois de salvar uma imagem, `photo` contém o caminho dela no Blob. `revision` identifica a versão carregada e serve para evitar que uma pessoa sobrescreva a edição de outra.

### Salvar nomes e telefone, mantendo a foto

Envie `PUT /api/content` com estes cabeçalhos:

```http
Content-Type: application/json
Authorization: Bearer SUA_SENHA
```

Corpo JSON de exemplo para a primeira gravação:

```json
{
  "names": [
    "Ana Silva",
    "Donato Mörschbächer",
    "Luís Gustavo Brum",
    "Huesley Padilha",
    "Miguel Vigolo",
    "Maria Isabela Gesswein",
    "Bibiana Garcia"
  ],
  "phone": "(51) 99999-0000",
  "revision": "",
  "photoData": null
}
```

Envie sempre os sete nomes, o telefone e a revisão, mesmo que tenha alterado somente um campo. Cada nome aceita até 100 caracteres. A senha vai apenas no cabeçalho, não no JSON.

Resposta `200` de exemplo:

```json
{
  "names": [
    "Ana Silva",
    "Donato Mörschbächer",
    "Luís Gustavo Brum",
    "Huesley Padilha",
    "Miguel Vigolo",
    "Maria Isabela Gesswein",
    "Bibiana Garcia"
  ],
  "phone": "(51) 99999-0000",
  "photo": null,
  "revision": "etag-retornado-pelo-blob"
}
```

Guarde a nova `revision` para o próximo envio. Seu valor deve ser preservado exatamente como recebido, inclusive eventuais aspas dentro da string.

### Salvar uma nova foto

Use o mesmo `PUT`, substituindo `photoData: null` pelo conteúdo do arquivo convertido em data URL. Exemplo de corpo (o texto `BASE64_DO_ARQUIVO` deve ser substituído pelo conteúdo completo da imagem):

```json
{
  "names": [
    "Ana Silva",
    "Donato Mörschbächer",
    "Luís Gustavo Brum",
    "Huesley Padilha",
    "Miguel Vigolo",
    "Maria Isabela Gesswein",
    "Bibiana Garcia"
  ],
  "phone": "(51) 99999-0000",
  "revision": "etag-retornado-pelo-blob",
  "photoData": "data:image/jpeg;base64,BASE64_DO_ARQUIVO"
}
```

Aceita JPEG, PNG ou WebP de até 2 MB. O navegador pode converter o arquivo com `FileReader.readAsDataURL(file)`, como já ocorre em `public/admin.js`. Omitir `photoData` ou enviar `null` mantém a foto atual.

Resposta `200` de exemplo:

```json
{
  "names": [
    "Ana Silva",
    "Donato Mörschbächer",
    "Luís Gustavo Brum",
    "Huesley Padilha",
    "Miguel Vigolo",
    "Maria Isabela Gesswein",
    "Bibiana Garcia"
  ],
  "phone": "(51) 99999-0000",
  "photo": "landing/photos/123e4567-e89b-42d3-a456-426614174000.jpeg",
  "revision": "nova-etag-retornada-pelo-blob"
}
```

Para exibir a foto retornada:

```js
const imageUrl = data.photo
  ? `/api/photo?path=${encodeURIComponent(data.photo)}`
  : '/diretoria-original.jpeg';
```

`GET /api/photo?path=...` retorna a imagem, não JSON. O caminho é gerado pelo servidor; não envie `photo` para tentar alterá-lo.

### Quando ocorrer um erro

A API de conteúdo retorna JSON com `error`. Exemplo de resposta `409`:

```json
{
  "error": "Outra pessoa alterou os dados. Recarregue antes de salvar."
}
```

| Status | O que fazer |
| --- | --- |
| `400` | Corrigir os campos ou o formato/tamanho da foto. |
| `401` | Conferir a senha de edição. |
| `405` | Usar o método correto: GET ou PUT. |
| `409` | Carregar novamente os dados e reaplicar a alteração. |
| `503` | Conferir o acesso ao armazenamento no servidor. |

Só mostrar sucesso quando a API confirmar a gravação. Em caso de conflito, não sobrescrever automaticamente a revisão recebida.

## 4. Limites atuais

- O formulário é público; a escrita exige senha validada no servidor. Não há gestão de usuários, recuperação de senha ou sessão de login.
- A senha não é salva em cookies nem no armazenamento do navegador.
- A senha configurada em `ADMIN_PASSWORD` deve ter pelo menos 8 caracteres. Senha incorreta retorna `401`; configuração ausente ou menor que o mínimo retorna `503` com orientação específica.
- Fotos anteriores permanecem no Blob. Um upload também pode ficar sem referência se a gravação posterior falhar.
- A prévia reproduz o recorte e o degradê da foto; o enquadramento varia com a largura da tela.
- O envio do formulário comercial não faz parte desta implementação.

## 5. Pendências

- [ ] Confirmar que as alterações são salvas no Blob.
- [ ] Recarregar o site e conferir se as alterações aparecem.
- [ ] Finalizar o visual e a experiência de edição.
- [ ] Melhorar as mensagens e a navegação do formulário.
- [ ] Conferir visualmente nomes, telefone e recorte da foto em computador e celular.
- [ ] Avaliar se é necessário adicionar orientação de recorte da foto.
- [ ] Validar a gravação real, recarregar a página e confirmar a persistência no ambiente de teste.
- [ ] Realizar a conferência final antes da publicação em produção.

## Referências

- [SDK do Vercel Blob](https://vercel.com/docs/vercel-blob/using-blob-sdk)
- [Vercel Functions com Node.js](https://vercel.com/docs/functions/runtimes/node-js)
