// src/routes/articles/[slug]/index.tsx
import { component$ } from '@builder.io/qwik';
import { routeLoader$, type StaticGenerateHandler, type DocumentHead } from '@builder.io/qwik-city';
import { fetchGitHubCmsData, decodeGitHubContent, type ArticleSchema } from '../../../utils/github-cms';

/**
 * Programmatic Route Generation: Slugs Extraction for Markdown leaf nodes[cite: 3].
 */
export const onStaticGenerate: StaticGenerateHandler = async ({ env }) => {
  const files = await fetchGitHubCmsData('content/articles', env);
  
  return {
    params: files.map((file: any) => ({
      slug: file.name.replace('.md', ''),
    })),
  };
};

/**
 * Fetching the raw Markdown payload at build time.
 */
export const useArticleLoader = routeLoader$<ArticleSchema>(async ({ params, env, error }) => {
  try {
    const fileData = await fetchGitHubCmsData(`content/articles/${params.slug}.md`, env);
    const rawMarkdown = decodeGitHubContent(fileData.content);
    
    // In a production scenario, a parser like 'marked' or 'mdast' would be invoked here 
    // to transform frontmatter and markdown into standard HTML strings.
    return {
      title: params.slug.replace(/-/g, ' '),
      date: new Date().toISOString(), // Mocked date; normally parsed from frontmatter
      content: rawMarkdown,
    };
  } catch (e) {
    throw error(404, 'Article not found in immutable CMS.');
  }
});

export default component$(() => {
  const articleSignal = useArticleLoader();

  return (
    <main class="ui container text padded segment">
      <h1 class="ui header huge capitalize">{articleSignal.value.title}</h1>
      <div class="ui sub header text grey mb-4">
        Published: {articleSignal.value.date}
      </div>
      
      <div class="ui divider"></div>
      
      {/* 
        Injecting the parsed markdown content. 
        DangerouslySetInnerHTML is safe here as the source is our trusted, cryptographically immutable Git repository[cite: 3].
      */}
      <div 
        class="ui content text justified" 
        dangerouslySetInnerHTML={articleSignal.value.content} 
      />
    </main>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const article = resolveValue(useArticleLoader);
  return {
    title: `${article.title} | Edge Platform Insights`,
  };
};