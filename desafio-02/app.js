const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const repositoriesContainer = document.querySelector("#repositories-container");
const issuesContainer = document.querySelector("#issues-container");
const contributors = document.querySelector("#contributors");
const prevAndNextContainer = document.querySelector("#prev-and-next-container");

let username = "";

function insertDataIntoPage(userRepositories, githubUsername) {
  repositoriesContainer.innerHTML = userRepositories
    .map(
      (repo) => `
    <li class="repo">
      <span class="repo-name">${repo.name}</span>
      <button class="btn" data-name-repo="${repo.name}">Saiba Mais</button>
    </li>
  `
    )
    .join("");
}

async function getUserFromGithub(githubUsername) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos`
    );
    const data = await response.json();
    insertDataIntoPage(data, githubUsername);
  } catch (err) {
    throw new Error(err);
  }
  return (username = githubUsername);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let githubUsername = searchInput.value.trim();

  if (!githubUsername) {
    repositoriesContainer.innerHTML = `<li class="warning-message">Usuário não encontrado</li>`;
    return;
  }

  getUserFromGithub(githubUsername);
});

async function getRepositoryMoreInfos(repository, githubUsername) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repository}/contributors`
    );
    const contributors = await response.json();
    console.log(contributors);
    const res = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repository}/issues`
    );
    const issues = await res.json();
    console.log(issues);

    repositoriesContainer.innerHTML = contributors
      .map(
        (person) => `
      <li class="contributors-item">
        <h1 class="person-title">Contribuidor do Repositório</h1>
        <img class="person-img" src="${person.avatar_url}" />
        <h3 class="person-name">Nome:  ${person.login} </h3>
        <h3 class="person-contributions">Contribuições:  ${person.contributions} </h3>
      </li>
    `
      )
      .join("");

    issuesContainer.innerHTML = issues
      .map(
        (issue) => `
      <li class="issue-container">
        <h1 class="issue-h1">Issue #${issue.number}</h1>
        <h3 class="issue-title">Título: ${issue.title}</h3>
        <p class="issue-body">Messagem: ${issue.body}</p>
        <p class="issue-state"><strong>Status: ${issue.state}</strong></p>
      </li>
    `
      )
      .join("");
  } catch (err) {
    throw new Error(err);
  }
}

repositoriesContainer.addEventListener("click", (event) => {
  const clickedElement = event.target;

  if (clickedElement.tagName === "BUTTON") {
    const repoName = clickedElement.getAttribute("data-name-repo");
    getRepositoryMoreInfos(repoName, username);
  }
});
