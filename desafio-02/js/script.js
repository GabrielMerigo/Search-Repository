var div = document.querySelector('.container-info');
var classForm = document.querySelector('.form-control')
var textLoading = document.createElement('p')
div.appendChild(textLoading);

function pegar(){
    var user = document.querySelector('#input').value;
    var i;
    
    if(user.length == ''){
      alert(`Por favor preencha o campo!`);
      return false;
    }
    textLoading.innerText = 'Carregando...';
    

  axios.get(`https://api.github.com/users/${user}/repos`)
    .then(resposta => {
        for(i = 0; i < resposta.data.length; i++){
          var trow = document.querySelector('#trow');
          var td = document.createElement('td')
          var repo = resposta.data[i].name;
          var rowList = (`${repo}`);
          td.innerText = rowList;
          trow.appendChild(td);
          textLoading.innerText = '';
        }
          
      axios.get(`https://api.github.com/repos/${user}/${repo}/contributors`)
      .then(resposta => { 
          for(i = 0;i < resposta.data.lenght; i++){
            
          }
        })
      
      })

        
 
        
    
  .catch( (error) => {
    textLoading.innerText = 'Algo deu errado...';
    console.warn(error);
    div.innerHTML = '';
  })

}
