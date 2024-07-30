import { useSession, signIn, signOut } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const fetchRepos = async () => {
        try {
          const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
              Authorization: `token ${session.accessToken}`,
            },
          });
          console.log(response)
          setRepos(response.data);
        } catch (error) {
          console.error('Error fetching repos:', error);
        }
      };
      fetchRepos();
    }
  }, [session]);

  const handleRepoClick = (repoName) => {
    router.push(`/repo-files?repo=${repoName}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">GitHub Repo List</h1>
      {!session ? (
        <button
          onClick={() => signIn('github')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Sign in with GitHub
        </button>
      ) : (
        <div className="w-full max-w-3xl">
          <div className="flex justify-between mb-4">
            <p className="text-xl">Hello, {session.user.name}</p>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Sign out
            </button>
          </div>
          <ul className="bg-white shadow-md rounded-md p-4">
            {repos.map((repo) => (
              <li key={repo.id} className="border-b last:border-b-0 py-2">
                <button
                  onClick={() => handleRepoClick(repo.name)}
                  className="text-blue-500"
                >
                  {repo.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
