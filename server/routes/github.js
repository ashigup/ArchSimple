const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/github/callback';

// Redirect to GitHub for authorization
router.get('/login', (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`;
  res.redirect(url);
});

// Handle GitHub OAuth callback
router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', querystring.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI
    }), {
      headers: { 'Accept': 'application/json' }
    });

    const { access_token } = response.data;
    res.redirect(`/repos.html?access_token=${access_token}`);
  } catch (error) {
    res.status(500).send('Error exchanging code for access token');
  }
});

// Fetch user's GitHub repositories
router.get('/profile', async (req, res) => {
  const accessToken = req.query.access_token;
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching repositories');
  }
});

router.get('/repos', async (req, res) => {
    const accessToken = req.query.access_token;
  
    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
  
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error fetching repositories');
    }
  });

  // Fetch files from a specific repository
router.get('/repo/files', async (req, res) => {
    const { access_token, owner, repo } = req.query;
    console.log("----here---")
  
    try {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers: {
          'Authorization': `token ${access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      console.log(response.data);
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error fetching repository files');
    }
  });
module.exports = router;