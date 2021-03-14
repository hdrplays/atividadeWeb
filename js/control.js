const KEY_BD = '@usuariosestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    usuarios:[]
}


var FILTRO = ''


function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}


function pesquisar(value){
    FILTRO = value;
    desenhar()
}


function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.usuarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.nome ) || expReg.test( usuario.fone )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.data}</td>
                        <td>${usuario.plataforma}</td>
                        <td>${usuario.usuario}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertUsuario(nome, data, plataforma, usuario){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, data, plataforma, usuario
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, nome, data, plataforma, usuario){
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
    usuario.nome = nome;
    usuario.data = data;
    usuario.plataforma = plataforma;
    usuario.usuario = usuario;
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Deseja deletar o registro de id '+id)){
        deleteUsuario(id)
    }
}


function limparEdicao(){
    document.getElementById('name').value = ''
    document.getElementById('data').value = ''
    document.getElementById('plataforma').value = ''
    document.getElementById('usuario').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('data').value = usuario.data
                document.getElementById('plataforma').value = usuario.plataforma
                document.getElementById('usuario').value = usuario.usuario
            }
        }
        document.getElementById('name').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('name').value,
        data: document.getElementById('data').value,
        plataforma: document.getElementById('plataforma').value,
        usuario: document.getElementById('usuario').value,
    }
    if(data.id){
        editUsuario(data.id, data.nome, data.data, data.plataforma, data.usuario)
    }else{
        insertUsuario( data.nome, data.data, data.plataforma, data.usuario )
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})