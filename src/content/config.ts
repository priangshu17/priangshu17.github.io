import { defineCollection, z } from 'astro:content';

// Case-study content model. Each project is a Markdown file whose frontmatter
// carries the full structured case study; the body is unused in v1 but kept
// available for future free-form notes.
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number(), // display order (featured first)
    title: z.string(), // question-style title for the project
    shortTitle: z.string(), // compact label for cards / nav
    question: z.string(), // one sentence, readable without the code
    summary: z.string(), // card summary line
    cardResult: z.string(), // one verified result OR limitation for the card
    status: z.string(), // e.g. "Benchmark", "Experiment"
    role: z.string(), // what you personally built / ran
    lastReviewed: z.string(), // ISO date the content was checked
    repoName: z.string(), // exact repository name
    repoUrl: z.string().url(),
    commit: z.string(), // pinned commit SHA
    tags: z.array(z.string()).default([]),

    setup: z.array(z.object({ label: z.string(), value: z.string() })),
    method: z.array(z.string()), // paragraphs / bullet lines
    resultsLead: z.string(), // plain-language takeaway above the figures

    figures: z.array(
      z.object({
        figNo: z.string(), // e.g. "Fig. 1"
        src: z.string(), // path under /public
        alt: z.string(),
        caption: z.string(),
      }),
    ),

    findings: z.array(z.string()),
    interpretation: z.array(z.string()),
    limitations: z.array(z.string()),

    surprised: z
      .object({ label: z.string(), body: z.string() })
      .optional(),

    reproduce: z.object({
      commands: z.array(z.string()),
      data: z.string(),
      rawResults: z.string(),
    }),
  }),
});

export const collections = { projects };
