document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
  
    if (accessToken) {
      fetch(`/github/profile?access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => {
          const reposDiv = document.getElementById('repos');
          reposDiv.innerHTML = '<h2>Your Repositories:</h2>';
  
          data.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.className = 'repo';
            repoElement.innerHTML = `
              <h3>${repo.name}</h3>
              <p>${repo.description || 'No description'}</p>
              <a href="${repo.html_url}" target="_blank">View on GitHub</a>
            `;
            reposDiv.appendChild(repoElement);
          });
        })
        .catch(error => console.error('Error:', error));
    }
  });