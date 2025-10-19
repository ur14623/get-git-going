export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  filesChanged?: {
    filename: string;
    status: 'added' | 'modified' | 'removed' | 'renamed';
    additions: number;
    deletions: number;
    changes: number;
  }[];
  stats?: {
    totalFiles: number;
    totalAdditions: number;
    totalDeletions: number;
  };
}

export interface GitInfo {
  lastCommit: GitCommit;
  totalCommits: number;
  status: 'clean' | 'modified';
  repository: {
    name: string;
    url: string;
  };
}

class GitService {
  private async fetchFromGitHub(owner: string, repo: string, token?: string): Promise<GitInfo> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    try {
      // Fetch latest commit
      const commitsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
        { headers }
      );

      if (!commitsResponse.ok) {
        throw new Error(`GitHub API error: ${commitsResponse.status}`);
      }

      const commits = await commitsResponse.json();
      const latestCommit = commits[0];

      // Fetch detailed commit info including files changed
      const commitDetailResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits/${latestCommit.sha}`,
        { headers }
      );

      let filesChanged: any[] = [];
      let stats = { totalFiles: 0, totalAdditions: 0, totalDeletions: 0 };

      if (commitDetailResponse.ok) {
        const commitDetail = await commitDetailResponse.json();
        filesChanged = (commitDetail.files || []).map((file: any) => ({
          filename: file.filename,
          status: file.status,
          additions: file.additions || 0,
          deletions: file.deletions || 0,
          changes: file.changes || 0,
        }));
        stats = {
          totalFiles: commitDetail.files?.length || 0,
          totalAdditions: commitDetail.stats?.additions || 0,
          totalDeletions: commitDetail.stats?.deletions || 0,
        };
      }

      // Fetch repository info
      const repoResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        { headers }
      );

      if (!repoResponse.ok) {
        throw new Error(`GitHub API error: ${repoResponse.status}`);
      }

      const repoInfo = await repoResponse.json();

      // Get current branch (default branch from repo info)
      const currentBranch = repoInfo.default_branch;

      return {
        lastCommit: {
          hash: latestCommit.sha.substring(0, 7),
          message: latestCommit.commit.message,
          author: latestCommit.commit.author.name,
          date: latestCommit.commit.author.date,
          branch: currentBranch,
          filesChanged,
          stats,
        },
        totalCommits: repoInfo.size || 0, // Approximate
        status: 'clean', // We can't easily determine this from GitHub API
        repository: {
          name: repoInfo.name,
          url: repoInfo.html_url,
        },
      };
    } catch (error) {
      console.error('Failed to fetch git info from GitHub:', error);
      throw error;
    }
  }

  async getLatestCommit(): Promise<GitInfo> {
    // Try to get repository info from environment or localStorage
    const storedRepo = localStorage.getItem('github_repository');
    
    if (storedRepo) {
      try {
        const { owner, repo, token } = JSON.parse(storedRepo);
        return await this.fetchFromGitHub(owner, repo, token);
      } catch (error) {
        console.warn('Failed to fetch from stored GitHub repo info:', error);
      }
    }

    // Fallback to detecting from current URL or return mock data
    if (window.location.hostname.includes('lovable.app')) {
      // Try to extract project info from Lovable URL
      try {
        const projectMatch = window.location.pathname.match(/\/projects\/([^\/]+)/);
        if (projectMatch) {
          // This would need actual Lovable API integration
          throw new Error('Lovable API integration not implemented');
        }
      } catch (error) {
        console.warn('Could not extract project info from URL:', error);
      }
    }

    // Return mock data as fallback
    return this.getMockGitInfo();
  }

  private getMockGitInfo(): GitInfo {
    return {
      lastCommit: {
        hash: 'f9e8d7c',
        message: 'feat: Enhanced package version display with modern card design',
        author: 'Developer',
        date: new Date().toISOString(),
        branch: 'main',
        filesChanged: [
          { filename: 'src/pages/nodes/node-detail/NodeDetailPage.tsx', status: 'modified', additions: 89, deletions: 24, changes: 113 },
          { filename: 'src/services/nodeService.ts', status: 'modified', additions: 28, deletions: 12, changes: 40 },
          { filename: 'src/pages/devtool/NodePackageListPage.tsx', status: 'modified', additions: 45, deletions: 18, changes: 63 },
          { filename: 'src/pages/devtool/NodePackageDetailPage.tsx', status: 'modified', additions: 52, deletions: 15, changes: 67 },
        ],
        stats: {
          totalFiles: 4,
          totalAdditions: 214,
          totalDeletions: 69,
        },
      },
      totalCommits: 128,
      status: 'clean',
      repository: {
        name: 'mediation-system',
        url: 'https://github.com/user/mediation-system',
      },
    };
  }

  // Method to configure GitHub repository connection
  setGitHubRepository(owner: string, repo: string, token?: string) {
    const repoInfo = { owner, repo, token };
    localStorage.setItem('github_repository', JSON.stringify(repoInfo));
  }

  // Method to clear GitHub repository connection
  clearGitHubRepository() {
    localStorage.removeItem('github_repository');
  }
}

export const gitService = new GitService();