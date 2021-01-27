const form = document.querySelector("#form")
const searchInput = document.querySelector("#search")
const repositoriesContainer = document.querySelector("#repositories-container")
const issuesContainerOpen = document.querySelector("#issues-container")
const issuesContainerClosed = document.querySelector('#issues-container-closed')
const inputOpen = document.querySelector('#open')
const inputClosed = document.querySelector('#closed')
// Lists
const ulOpen = document.querySelector('.ulOpen')
const ulClosed = document.querySelector('.ulClosed')
//Radios
const all = document.querySelector('#all')
const radios = document.querySelector('.radios')

let username = ""

function insertDataIntoPage(userRepositories) {
  repositoriesContainer.innerHTML = userRepositories
    .map(({name}) => 
    `<li class="repo">
      <span class="repo-name">${name}</span>
      <button class="btn" data-name-repo="${name}">More</button>
    </li>`).join("")
}

async function getUserFromGithub(githubUsername) {
  try{
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`)
    const data = await response.json()

    insertDataIntoPage(data, githubUsername)

  }catch(err) {
    throw new Error(err)
  }
  return username = githubUsername
}


form.addEventListener("submit", (event) => {
  event.preventDefault()
  let githubUsername = searchInput.value.trim()

  let radiosForm = radios.style.display = 'none'
  let ulOpenForm = ulOpen.style.display = 'none'
  let ulClosedForm =  ulClosed.style.display = 'none'
  
  if (!githubUsername) {
    repositoriesContainer.innerHTML = `<li class="warning-message">User not Found...</li>`
    return radiosForm, ulOpenForm, ulClosedForm
  }
  getUserFromGithub(githubUsername)
})

async function getRepositoryMoreInfos(repository, githubUsername) {
  try{
    const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repository}/contributors`)
    const contributors = await response.json()
    //Request IssuesOpen
    const repositoriesOpen = await fetch(`https://api.github.com/repos/${githubUsername}/${repository}/issues?state=open`)
    const issuesOpen = await repositoriesOpen.json()
    //Request IssuesClosed
    const repositoriesClosed = await fetch(`https://api.github.com/repos/${githubUsername}/${repository}/issues?state=closed`)
    const issuesClosed = await repositoriesClosed.json()

    radios.style.display = 'block'

    const verifyContributions = (number) =>{
      return (number >= 10 
              ? number >= 20
                ? number >= 50
                ? "50+"
                : "20+"
              : "10+"
            :number)
    }

    repositoriesContainer.innerHTML = contributors
    .map((issue, index) => 
    `<li class="contributors-item">
        <span class="number">${index + 1}. </span>
        <img class="person-img" src="${issue.avatar_url}" />
        <span class="person-name">Name:  ${issue.login} - </span>
        <span class="person-contributions">Contributors: ${verifyContributions(issue.contributions)}</span>
      </li>`).join("")

    issuesContainerOpen.innerHTML = issuesOpen
    .map(({number, title, body, state}) =>
      `<li class="issue-container-open">
        <span class="issue-span">Issue #${number}</span><br>
        <span class="issue-title">Title: ${title}</span>
        <details class="issue-body"><summary>Message:</summary> <p>${body}</p></details>
        <span class="issue-state font-open"><strong>Status: ${state}</strong></span>
      </li>`).join("")

    issuesContainerClosed.innerHTML = issuesClosed 
    .map(({number, title, body, state}) =>
      `<li class="issue-container-closed">
        <span class="issue-span">Issue #${number}</span><br>
        <span class="issue-title">Title: ${title}</span>
        <details class="issue-body"><summary>Message:</summary> <p>${body}</p></details>
        <span class="issue-state font-closed"><strong>Status: ${state}</strong></span>
      </li>`).join("")
  }catch(err){
    throw new Error(err)
  }
}

repositoriesContainer.addEventListener("click", (event) => {
  const clickedElement = event.target
  if (clickedElement.tagName === "BUTTON") {
    const repoName = clickedElement.getAttribute("data-name-repo")
    getRepositoryMoreInfos(repoName, username)
  }
})

//Filter Issues
inputOpen.addEventListener('click', () =>{
  ulOpen.style.display = 'block'
  ulClosed.style.display = 'none'
})

inputClosed.addEventListener('click', () =>{
  ulClosed.style.display = 'block'
  ulOpen.style.display = 'none'
})

all.addEventListener('click', () =>{
  ulClosed.style.display = 'block'
  ulOpen.style.display = 'block'
})

