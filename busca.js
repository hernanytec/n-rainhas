/**
 * Testa se é possível colocar uma rainha na linha j da coluna i
 * dado um determinado estado.
 * 
 * state[k] == j verifica se já há outra rainha naquela mesma linha
 * 
 * k + state[k] == i+j (ou subtituindo '+' por '-') verifica se há outra rainha em alguma das diagonais
 *  
 */
isValid = (state, i, j) => {

    for (let k = 0; k < state.length; k++) {
        if(state[k] != null){
            if(k + state[k] == i+j || k - state[k] == i-j || state[k] == j)
                return false
        }else
            return i == k
    }

    return true
}

/**
 * pego um estado antigo e crio um novo estado adicionando uma rainha na coluna i e linha j
 * o novo estado é filho do estado antigo o que por consequência lhe dá um nível a mais na árvore
 */
makeState = (state, i, j) =>{
    let ns = JSON.parse(JSON.stringify(state))//faço uma cópia para não alterar o valor do antigo estado
    
    if(i === state.arr.length-1)//se estiver colocando uma rainha na última coluna então é um estado objetivo
        ns.isGoal = true

    ns.level = state.level + 1
    ns.arr[i] = j
    ns.parent = state
    return ns
}


bfs = (initialState, tipoExibicao) =>{
    let queue = []

    let goalCount = 0

    queue.push(initialState) 
    
    while (queue.length > 0){  
        let state = queue.shift()//pega o primeiro elemento da fila

        if(state.isGoal) goalCount++

        if(state.level > 0){
            if(tipoExibicao === '1' && state.isGoal){//mostra apenas um estado objetivo
                showNewState(state)
                break
            }
            else if(tipoExibicao === '2' && state.isGoal){//mostra todos os estados objetivos 
                showNewState(state)
            }
            else if(tipoExibicao === '3' && state.isGoal){//mostra o caminho da raiz até o estado objetivo
                showPathToObj(state)
                break
            }else if(tipoExibicao === '4'){//mostra todos os estados
                showNewState(state)
            }
        }            

        /**
         * coloco todos os estados adjacentes na fila
         * como a estrutura do problema é naturalmente uma árvore
         * não é necessário marcar os estados já visitados, pois eles nunca aparecerão novamente
         */
        
        for(let i = 0; i < state.arr.length; i++){ //colunas
            if(state.arr[i] == null){
                for(let j = 0; j < state.arr.length; j++){ //linhas
                    
                    if(isValid(state.arr, i, j)){
                        let new_state = makeState(state, i, j)
                        
                        queue.push(new_state)
                    }
                }
            }
        }
    }
    
    return goalCount
}


dfs = (initialState, tipoExibicao) =>{
    let stack = []

    let goalCount = 0

    stack.push(initialState) 
    
    while (stack.length > 0){  
        let state = stack.pop() 
        
        if(state.isGoal) goalCount++

        if(state.level > 0){
            if(tipoExibicao === '1' && state.isGoal){//mostra apenas um estado objetivo
                showNewState(state)
                break
            }
            else if(tipoExibicao === '2' && state.isGoal){//mostra todos os estados objetivos 
                showNewState(state)
            }
            else if(tipoExibicao === '3' && state.isGoal){//mostra o caminho da raiz até o estado objetivo
                showPathToObj(state)
                break
            }else if(tipoExibicao === '4'){//mostra todos os estados
                showNewState(state)
            }
        }            

        /**
         * percorro de trás para frente para gerar o mesmo resultado da dfs recursiva
         */
        
        for(let i = state.arr.length-1; i >= 0; i--){ //colunas        
            if(state.arr[i] == null){
                for(let j = state.arr.length-1; j >= 0; j--){ //linhas
                    
                    if(isValid(state.arr, i, j)){
                        let new_state = makeState(state, i, j)
                        
                        stack.push(new_state)
                    }
                }
            }
        }
    }
    
    return goalCount
}