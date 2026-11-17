/**
 * Scholar Profile Metadata for Dr. Apurva Narayan.
 * All publications are dynamically pulled from OpenAlex, Semantic Scholar,
 * DBLP APIs, and the automated sync scraper.
 */

export const scholarProfile = {
  name: 'Dr. Apurva Narayan',
  scholarId: 'e5OCZ1cAAAAJ',
  scholarUrl: 'https://scholar.google.com/citations?user=e5OCZ1cAAAAJ&hl=en',
  orcid: '0000-0001-7203-8698',
  semanticScholarId: '2112443048',
  dblpPid: '86/4974',
  dblpUrl: 'https://dblp.org/pid/86/4974.html',
  affiliations: 'Western University · University of British Columbia · University of Waterloo',
  defaultCitations: '1,250+',
  defaultHIndex: '18',
  defaultI10Index: '27',
};

// No publications are hardcoded here.
// Publications are pulled live via scholarService from OpenAlex, Semantic Scholar, DBLP, and sync pipeline.
export const scholarPublications = [];
