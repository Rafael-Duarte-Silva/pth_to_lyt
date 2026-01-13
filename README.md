# pth-to-lyt

Biblioteca para converter arquivos `.PTH` do **Live for Speed (LFS)** em layouts `.LYT`.

O principal objetivo desta lib é facilitar a criação de **layouts de referência** a partir dos *path nodes* das pistas, permitindo montar uma base precisa para **cálculo de delta time em corridas**.

Com o `.LYT` gerado, é possível:

- Criar linhas de referência ao longo do traçado da pista  
- Medir progresso do carro em relação ao caminho ideal  
- Calcular diferenças de tempo entre voltas ou jogadores  
- Construir sistemas de telemetria e análise de desempenho  

Em vez de criar manualmente um layout no editor do LFS, esta lib automatiza o processo usando os dados reais da pista.

---

## Instalação

```bash
npm install pth-to-lyt