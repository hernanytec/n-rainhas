let inputN = document.getElementById("inputN")
inputN.onchange = showOnlyInitialState
inputN.onkeyup = showOnlyInitialState

//função responsável por criar as divs onde vão ficar os estados
//cada div representa um nível na árvore
const createChildContainer = (parentId, childId) =>{
    if(document.getElementById(childId) != null)
        return

    let parentContainer = document.getElementById(parentId)
    let childContainer = document.createElement("div")

    childContainer.setAttribute("id", childId)
    parentContainer.appendChild(childContainer)
    childContainer.className += 'row'
}

//dado um id de um container, retorna qual o próximo id que deve ser dado a uma tabela q pretende ser inserida na div
const getNextTableId = containerId =>{
    let tableList = document.getElementById(containerId).querySelectorAll('table')
    let new_id = 1

    for (let i = 0; i < tableList.length; i++) {
        let elements = tableList[i].id.split('-')
        let id = elements[elements.length-1]
        if(id >= new_id)
            new_id = parseInt(id)+1
    }
    return containerId+'-'+new_id;
}

//dado o id de um container (nível na árvore) cria uma nova tabela e adiciona ela dentro desse container
const createTableInContainer = containerId =>{
    let parentContainer = document.getElementById(containerId)
    let table = document.createElement("table")
    let tableId =  getNextTableId(containerId)

    table.setAttribute("id", tableId)
    parentContainer.appendChild(table)     
    return tableId
}

//metodo que dado um estado do jogo e um id de uma determinada tabela insere linhas e colunas
//de forma que a tabela agora seja a representação do estado no formato de um tabuleiro de xadrez
const renderState = (state, tableId) => {
    let table = document.getElementById(tableId)
    
    if(state.isGoal)
        table.className += 'goal'
    
    for (let i = 0; i < state.arr.length; i++) {
        let row = document.createElement("tr")
        
        for (let j = 0; j < state.arr.length; j++) {
            let collumn = document.createElement("td")
            
            if(state.arr[j] != undefined && state.arr[j] == i){
                collumn.className += 'has_queen'   
                
                let img = document.createElement("img")
                img.setAttribute("src", "rainha.png")
                collumn.appendChild(img)
            }
            else
                collumn.className += 'no_queen'

            row.appendChild(collumn);
        }

        table.appendChild(row)
    }
}

// chama os metodos necessários para exibir um estado
const showNewState = state =>{
    createChildContainer("arvore", state.level)
    let tableId = createTableInContainer(state.level)
    renderState(state, tableId)
}

const showExecutionTime = (t0, t1) =>{
    let final = t1-t0
    final = final >= 1000 ? (final/1000).toFixed(2) + ' s' : final.toFixed(2) + ' ms'
    
    document.getElementById("infoTime").textContent = `Busca finalizada em ${final}`
}

const showGoalAmount = count =>{
    if(count > 1) document.getElementById("infoCont").textContent = `Quantidade de estados objetivo = ${count}`
}

//exibe o caminho de um estado até a raiz da árvore
const showPathToObj = state =>{
    let stack = []

    while(state.parent != null){
        stack.push(state)
        state = state.parent
    }
    
    while(stack.length >0)
        showNewState(stack.pop())
}


let n
let intialState = {}

//limpa todo o conteúdo da árvore (inclusive o estado inicial)
cleanTree = () =>{
    document.body.removeChild(document.getElementById('arvore'))

    let tree = document.createElement('div')
    tree.setAttribute('id', 'arvore')
    document.body.appendChild(tree)
}

//função que exibe apenas o estado inicial, pois esse é um caso especial no problema
function showOnlyInitialState(){
    cleanTree()

    n = parseInt(inputN.value) || 0

    //atualiza estado incial dependendo do valor no inputN
    let elem = document.getElementById('0')
    if(elem != null)
        elem.parentNode.removeChild(elem)

    intialState = {
                        arr: new Array(n),
                        isGoal: false,
                        parent: null,
                        level: 0
                    }

    createChildContainer("arvore", 0)
    let tableId = createTableInContainer(0)
    renderState(intialState, tableId)
}

showOnlyInitialState()

//chama a busca correta de acordo com os parâmetros escolhidos na interface
const startSearch = () => {
    showOnlyInitialState()

    let displayType = document.querySelector('input[name="exibicao"]:checked').value
    let serchType = document.querySelector('input[name="busca"]:checked').value

    let t0 = 0, t1 = 0, goalCount = 0

    if(serchType === 'dfs'){  
        t0 = performance.now()//marca o tempo inicial
    
        goalCount = dfs(intialState, displayType)
        
        t1 = performance.now()//marca o tempo final
    }
    else{
        t0 = performance.now()
    
        goalCount = bfs(intialState, displayType)
        
        t1 = performance.now()
    }
 
    showExecutionTime(t0, t1)
    showGoalAmount(goalCount)
}