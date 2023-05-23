const card = document.getElementById('cards');
const form = document.getElementById('formProduto');
const spinner = document.getElementById('spinner');
let condicao = true;

function showSpinner(){
    spinner.classList.remove('visually-hidden');
}

function hideSpinner(){
    spinner.classList.add('visually-hidden');
}


async function loadData(){
    showSpinner();
    let {data: Produtos, error} = await _supabase
    .from('Produtos')
    .select('*')

    console.table(Produtos);

    if(error){
            console.log(error);
            return;
        }else{
            card.innerHTML ='';
            Produtos.map((produto)=>{
                    card.innerHTML += `
                    <div class="card m-4" style="width: 18rem;">
                    <div class="card-body"> 
                        <h5 class="card-title">Produto:</h5>
                        <p class="card-title">${produto.Nome}</p>
                        <h5 class="card-title">Descrição:</h5>
                        <p class="card-text">${produto.Descricao}</p>
                        <h5 class="card-title">Preço:</h5>
                        <p class="card-text">${produto.Preco}</p>
                        <button type="button" class="btn btn-primary" onClick='prepareData(${produto.id})' >Editar</button>
                        <button type="button" class="btn btn-danger" onClick='deletar(${produto.id})'>Apagar</button>
                    </div>
                </div>                           
                    `
            })
            hideSpinner();
        }
}

loadData();

form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    let nome = form.nome.value;
    let descricao = form.descricao.value;
    let preco = form.preco.value;

    let data ={
        Nome: nome,
        Descricao: descricao,
        Preco: preco
    }

    console.log(data);
    if(condicao){
    insertData(data);
    }else{
        let id = parseInt(form.inputid.value);
        updateData(id, data);
        condicao = true;
    }

form.reset();
});

async function insertData(dado){
    showSpinner();
    const {data,error} = await _supabase.from('Produtos').insert([dado]);
    if(error){
        console.log(error);
        return;
    }else{
        console.log("dado salvo com sucesso");
        hideSpinner();
        loadData();
    }
}

async function deletar(id){
    showSpinner();
    if(confirm("Deseja realmente deletar")){
        const {data,error} = await _supabase
        .from('Produtos')
        .delete()
        .eq('id', id)
        if(error){

            console.log(error);
            return;
        }
        hideSpinner();
        loadData();
        
    }
    return
}

async function prepareData(id){

    let {data: Produtos, error} = await _supabase
    .from('Produtos')
    .select('*').eq('id', id)

    if(error) {
        console.log(error);
                return;
            }else{
                form.inputid.value = Produtos[0]["id"];
                form.nome.value = Produtos[0]["Nome"];
                form.descricao.value = Produtos[0]["Descricao"];
                form.preco.value = Produtos[0]["Preco"];
                condicao = false;
            }
}

async function updateData(id,dado){
    showSpinner();
    const {data,error} = await _supabase
       .from('Produtos')
       .update(dado)
       .eq('id', id)
       if(error){
            console.log(error);
            return;
        }
        hideSpinner();
        condicao=true;
        loadData();
}