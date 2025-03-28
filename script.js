document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastro-form");
    const cepInput = document.getElementById("cep");
    const logradouroInput = document.getElementById("logradouro");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");
    const botaoTema = document.getElementById("botaoTema");
    

    // Restaurar dados do localStorage 
    // Verifica se tem dados no localStorage
    const savedData = JSON.parse(localStorage.getItem("cadastroUsuario"));
    if (savedData) {
        // Verificar se a expressão do CEP é numérica, caso não, remover todos os caracteres que não são números (REGEX)
        Object.keys(savedData).forEach(key => {
            if (document.getElementById(key)) {
                document.getElementById(key).value = savedData[key];
            }
        });
    }
    
    // Buscar endereço via CEP
    cepInput.addEventListener("blur", (evento) => {
        const cepInformado = evento.target.value.replace(/\D/g, "");
        
        // verifica se o comprimento do cep informado é diferente de 8, não executo o resto do código e emite um alerta
        if (cepInformado.length !== 8) {
            alert("CEP inválido! O CEP deve ter exatamente 8 números.");
            return;
        }
        
        fetch(`https://viacep.com.br/ws/${cepInformado}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    logradouroInput.value = data.logradouro;
                    bairroInput.value = data.bairro;
                    cidadeInput.value = data.localidade;
                    estadoInput.value = data.uf;
                } else {
                    alert("CEP não encontrado");
                }
            })
            .catch(error => console.error("Erro ao buscar o CEP", error));
    });
    
    // Salvar dados no localStorage
    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const formData = {};
        new FormData(form).forEach((value, key) => {
            formData[key] = value;
        });
        localStorage.setItem("cadastroUsuario", JSON.stringify(formData));
        alert("Cadastro salvo com sucesso!");
    });
    
    // Alternar tema
    botaoTema.addEventListener("click", () => {
        const temaAtual = localStorage.getItem("tema") || "light";
        const novoTema = temaAtual === "dark" ? "light" : "dark";
        document.body.classList.toggle("dark", novoTema === "dark");
        localStorage.setItem("tema", novoTema);
        botaoTema.textContent = novoTema === "dark" ? "Dark" : "Ligth";
    });
    
    // Aplicar tema salvo
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "dark") {
        document.body.classList.add("dark");
        botaoTema.textContent = "Dark";
    }
});
