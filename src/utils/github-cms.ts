// src/utils/github-cms.ts
import type { RequestEventLoader } from '@builder.io/qwik-city';

// Define strict Type Enforcements for our Schema Definition Language (SDL)
export interface ProductSchema {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  inStock: boolean;
}

export interface ArticleSchema {
  title: string;
  date: string;
  content: string; // Markdown body
}

/**
 * Crafting Secure Asynchronous HTTPS Requests against the GitHub Repository.
 * This avoids runtime database connections entirely, mitigating injection exploits.
 */
export async function fetchGitHubCmsData(path: string, env: RequestEventLoader['env']): Promise<any> {
  const repoOwner = env.get('GITHUB_OWNER') || 'your-org';
  const repoName = env.get('GITHUB_REPO') || 'ecommerce-cms-data';
  const token = env.get('GITHUB_CMS_TOKEN'); 

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;

  // Bypassing Rate Limits: Integrating Build-Time Authorization Headers[cite: 3]
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Qwik-City-Edge-Architecture'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`CMS Fetch Error: ${response.statusText} at ${url}`);
  }

  return response.json();
}

/**
 * Decodes base64 content returned by the GitHub Contents API.
 */
export function decodeGitHubContent(base64Content: string): string {
  // Edge-compatible base64 decoding
  return Buffer.from(base64Content, 'base64').toString('utf-8');
}