import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function RepoFiles() {
  const router = useRouter();
  const { repo } = router.query;
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (session && repo) {
      const fetchFiles = async () => {
        try {
          const response = await axios.get(`https://api.github.com/repos/${session.user.login}/${repo}/contents`, {
            headers: {
              Authorization: `token ${session.accessToken}`,
            },
          });
          setFiles(response.data);
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      };
      fetchFiles();
    }
  }, [session, repo]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Files in {repo}</h1>
      <ul className="bg-white shadow-md rounded-md p-4">
        {files.map((file) => (
          <li key={file.sha} className="border-b last:border-b-0 py-2">
            <a href={file.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
