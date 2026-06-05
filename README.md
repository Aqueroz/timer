# Cronômetro

## Para o primeiro uso
Vá até a pasta onde estã oos arquivos e rode um "npm i" ou "npm install" para instalar as dependencias

## Salvar tarefas
Basta clicar no botão "zerar"

## Para rodar o projeto no modo de desenvolvimento
npm start

## Para criar o build para produção
npm run make

---

## 📦 Funcionalidades atuais

- ✅ Adicionar tarefas únicas
- ✅ Selecionar uma tarefa e iniciar um cronômetro
- ✅ Pausar, continuar e zerar o tempo da tarefa
- ✅ Registrar o tempo de execução de cada tarefa
- ✅ Salvar os dados localmente em um arquivo JSON
- ✅ Exibir o tempo total por tarefa em um gráfico (Chart.js)
- ✅ Interface separada por seções: tarefas, cronômetro e gráfico
- ✅ Adicionar botão de exportar dados (JSON)

---

## 🐞 Bugs conhecidos

- [ ] Ao tentar adicionar uma tarefa repetida e fechar o alerta, o input pode travar
- [ ] Tarefas deletadas não removem completamente todos os dados de sessão
- [ ] Ao reabrir o programa, o dados são apagados, forçando o usuario a exportar e importar os dados
- [ ] Ao importar um arquivo, é necessario adicionar uma nova tarefa para poder escolher nas opções do cronometro e e seguir com a marcação 

---

## 🔧 Planejamento futuro

- [ ] Corrigir bug do input após tarefa repetida
- [ ] Adicionar modo escuro
- [ ] Permitir editar nomes de tarefas
- [ ] Mostrar histórico de tempo por dia

---

## 🛠️ Tecnologias usadas

- [Electron](https://www.electronjs.org/) – para o app desktop
- [JavaScript Vanilla](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Chart.js](https://www.chartjs.org/) – para gráficos
- HTML + CSS simples

---


Criei este projeto como uma solução pessoal para cronometrar minhas tarefas sem depender de aplicativos com anúncios. E com a praticidade de estar rodando na minha própria máquina.



