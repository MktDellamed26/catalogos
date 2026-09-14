# Prateleira de Catálogos Dellamed — versão segura

Site com login por e-mail e senha, hospedado só no GitHub (GitHub Pages), com **todo o conteúdo criptografado**. Os catálogos, o texto de busca, a lista de catálogos e a lista de pessoas ficam embaralhados (AES-256) no repositório. Sem uma senha válida, quem baixar os arquivos não consegue ler nada.

## Arquivos desta pasta

| Arquivo | Para quê |
|---|---|
| `index.html` | O site que clientes, representantes e equipe acessam |
| `admin.html` | O **Painel da Prateleira**, usado só pelos administradores |
| `LEIA-ME.md` | Este guia (não precisa ir para o GitHub) |

Os dois arquivos `.html` não contêm nada sigiloso. Todo o resto — catálogos, pessoas e o cofre dos administradores — é criado e publicado pelo próprio painel, já criptografado.

## Implantação (uma vez)

1. **Apague o repositório antigo** `prateleira-dellamed`. O histórico dele guarda as imagens abertas dos catálogos, e apagar arquivos não limpa o histórico: GitHub → repositório → **Settings → General → Danger Zone → Delete this repository**.
2. **Crie um repositório novo**, por exemplo `catalogos`. Ele pode ser **público**: tudo o que for publicado nele estará criptografado.
3. Envie `index.html` e `admin.html` para a raiz: **Add file → Upload files → Commit changes**.
4. Ative o site: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**. O endereço fica `https://SEU-USUARIO.github.io/catalogos/`.
5. **Crie o token do administrador** (cada administrador cria o seu):
   - GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
   - **Repository access:** *Only select repositories* → marque só o repositório `catalogos`.
   - **Permissions → Repository permissions → Contents:** *Read and write*.
   - Gere e copie o token.
6. Abra `https://SEU-USUARIO.github.io/catalogos/admin.html`, crie a **senha mestra** (mínimo 14 caracteres) e cole o token. O painel faz a primeira publicação.
7. Na aba **Catálogos**, arraste os PDFs (Catálogo Geral 2026, Pocket 2026 e Farma). O painel converte as páginas, criptografa e publica. PDFs grandes levam alguns minutos: use um computador e não feche a aba.
8. Na aba **Pessoas**, adicione quem vai acessar e envie a mensagem com e-mail e senha que o painel mostra.
9. Entre no site com uma dessas contas para conferir.

## Uso no dia a dia (painel)

- **Novo catálogo:** arraste o PDF → preencha título e linhas → *Converter e publicar*.
- **Nova versão de um catálogo:** *Nova versão* → escolha o PDF novo.
- **Tirar do site sem apagar:** desligue *No site*.
- **Selo "Novo", validade e ordem:** direto na tabela.
- **Nova pessoa:** *Adicionar pessoa*. A senha aparece uma única vez: copie a mensagem e envie.
- **Esqueceu a senha:** *Nova senha* e envie a senha nova.
- **Tirar o acesso de alguém:** *Remover*. O painel troca a chave e criptografa todos os catálogos de novo, então nem cópias antigas funcionam mais.

Cada alteração é publicada na hora. O site atualiza em cerca de 1 minuto.

## Segurança: o que protege e o que não protege

**Protegido:** conteúdo dos catálogos, capas, texto de busca, títulos e lista de catálogos, nomes e e-mails das pessoas, cofre dos administradores. As senhas passam por 600 mil rodadas de PBKDF2-SHA-256 antes de virar chave, o que torna tentativas de adivinhação muito lentas.

**Visível para qualquer um:** que o site existe, as telas de login, a quantidade aproximada de arquivos e de pessoas cadastradas, e o tamanho dos arquivos. As mensagens de envio no GitHub são sempre "Atualização da Prateleira", sem nomes.

**Limites que valem para qualquer sistema:**
- Quem tem uma senha válida consegue ver e copiar o que está no site.
- Não existe "recuperar senha por e-mail" (não há servidor). O administrador gera uma senha nova.
- A proteção depende de senhas fortes: as senhas das pessoas são geradas pelo painel; a senha mestra é escolhida por vocês — use uma frase longa e única.
- Guarde a senha mestra em local seguro. Sem ela, não é possível abrir o cofre e todos os acessos precisam ser recriados.
- Se um token do GitHub vazar, revogue-o no GitHub e crie outro. Troque a senha mestra quando alguém deixar de ser administrador.

## Não publicar

- `Dellamed - Wellness - ppt 1.pdf` — apresentação de agência com nota de confidencialidade.
- `Dellamed - Esteira Massageadora 1.pdf` — arte de produção da caixa.
- Catálogo Ouros — fora da Prateleira por decisão do marketing.
