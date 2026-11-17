import { scholarProfile } from '../data/scholarPublications';
import { parseBibTeX } from '../utils/bibTexUtils';

const CACHE_KEY = 'idsl_publications_live_cache_v5';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const getScholarProfile = () => scholarProfile;

/**
 * Papers explicitly excluded (e.g. rejected submissions, withdrawn preprints)
 */
export const EXCLUDED_PUBLICATIONS = [
  'synthia: a multi-agent gan-llm fusion for statistically guided synthetic data generation',
];

/**
 * Verified Trainees, Postdocs, and Collaborators of Dr. Apurva Narayan at IDSL / UWO
 */
export const IDSL_COAUTHORS = [
  'devulapalli',
  'agrawal',
  'khanal',
  'satsangi',
  'faid',
  'sharma',
  'zhang',
  'sarkar',
  'ranade',
  'kumar',
  'lahourpour',
  'fischmeister',
  'capretz',
  'azad',
  'senevirathne',
  'tissera',
  'gupta',
  'parmar',
  'munz',
  'telila',
  'kalra',
  'basu',
  'youssef',
  'asrani',
  'el-shawa',
  'anil',
  'vinod',
  'marksteiner',
  'hasan',
];

/**
 * Verified institutions associated with Dr. Apurva Narayan
 */
export const VERIFIED_INSTITUTIONS = [
  'western',
  'uwo',
  'british columbia',
  'ubc',
  'waterloo',
  'dayalbagh',
  'dei',
  'idsl',
  'ontario',
];

/**
 * Non-CS disciplines where other researchers named "Apurva Narayan" publish
 */
export const DISQUALIFIED_DOMAINS = [
  'concrete',
  'cement',
  'geotechnical',
  'soil mechanics',
  'asphalt',
  'civil engineering',
  'structural design',
  'dentist',
  'dental',
  'orthodont',
  'endodont',
  'periodont',
  'oral surgery',
  'prosthodont',
  'oncology',
  'dermatolog',
  'botany',
  'agronom',
  'crop yield',
  'fertilizer',
  'agriculture',
  'pathology',
  'fibrosis',
  'masld',
];

/**
 * Valid Computer Science, AI, and Cyber-Physical domain keywords
 */
export const CS_DOMAINS = [
  'machine learning',
  'artificial intelligence',
  'deep learning',
  'neural',
  'cyber-physical',
  'cps',
  'iot',
  'software',
  'transformer',
  'adversarial',
  'llm',
  'language model',
  'vision',
  'reinforcement',
  'formal methods',
  'runtime',
  'data science',
  'time series',
  'anomaly',
  'robot',
  'manufacturing',
  'embedded',
  'distributed',
  'byzantine',
  'sensor',
  'computer science',
  'aamas',
  'aaai',
  'wacv',
  'kdd',
  'iclr',
  'neurips',
  'icml',
  'ieee',
  'acm',
];

/**
 * Normalizes title for deduplication
 */
function normalizeTitle(title = '') {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Strict validator to guarantee that Dr. Apurva Narayan is genuinely a co-author.
 * Prevents false positives from multi-author papers where one author has first name "Apurva"
 * and an unrelated author has surname "Narayan" (e.g. medical cohort studies).
 */
export function isApurvaName(nameStr = '') {
  if (!nameStr || typeof nameStr !== 'string') return false;
  const clean = nameStr
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (
    clean === 'apurva narayan' ||
    clean === 'a narayan' ||
    clean === 'narayan apurva' ||
    clean === 'narayan a' ||
    clean === 'apurv narayan' ||
    clean === 'apurva k narayan' ||
    clean === 'narayan apurva k' ||
    clean === 'dr apurva narayan'
  ) {
    return true;
  }

  if (
    clean.startsWith('apurva narayan ') ||
    clean.endsWith(' apurva narayan') ||
    clean.includes(' apurva narayan ') ||
    clean.startsWith('a narayan ') ||
    clean.endsWith(' a narayan') ||
    clean.includes(' a narayan ') ||
    clean.startsWith('narayan apurva ') ||
    clean.endsWith(' narayan apurva')
  ) {
    return true;
  }

  return false;
}

export function hasApurvaNarayanAsAuthor(authorsStr = '', authorsArray = []) {
  // 1. Check array of authors/authorships
  if (Array.isArray(authorsArray) && authorsArray.length > 0) {
    const hasMatch = authorsArray.some((a) => {
      const name =
        typeof a === 'string'
          ? a
          : a.author?.display_name || a.raw_author_name || a.name || a.text || '';
      return isApurvaName(name);
    });
    if (hasMatch) return true;
  }

  // 2. Check author string
  if (typeof authorsStr === 'string' && authorsStr.trim()) {
    if (authorsStr.includes(';') || /\band\b/i.test(authorsStr)) {
      const parts = authorsStr.split(/;|\band\b/i);
      if (parts.some((p) => isApurvaName(p.trim()))) return true;
    }

    const cleanFull = authorsStr.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ');
    if (
      cleanFull.includes('apurva narayan') ||
      cleanFull.includes('narayan apurva') ||
      cleanFull.includes('apurva k narayan')
    ) {
      return true;
    }

    const parts = authorsStr.split(',');
    if (parts.some((p) => isApurvaName(p.trim()))) return true;
  }

  return false;
}

/**
 * Multi-Signal Author Disambiguation Engine:
 * Validates whether a paper belongs to Dr. Apurva Narayan of the Intelligent Data Science Lab (UWO / UBC / Waterloo)
 * and eliminates false positives from other researchers with the same name.
 */
export function isVerifiedIDSLPaper(pub) {
  if (!pub || !pub.title) return false;

  const normTitle = (pub.title || '').trim().toLowerCase();
  if (EXCLUDED_PUBLICATIONS.some((ex) => normTitle.includes(ex) || ex.includes(normTitle))) {
    return false;
  }

  // 1. Must pass author name validation
  if (!hasApurvaNarayanAsAuthor(pub.authors, pub.authorships || pub.authorsList)) {
    return false;
  }

  const titleVenue = `${pub.title} ${pub.venue || ''} ${pub.topic || ''}`.toLowerCase();
  const authorText = (pub.authors || '').toLowerCase();
  const affilText = (pub.affiliations || pub.institution || authorText).toLowerCase();

  // 2. Reject if any disqualified domain keyword appears (unless verified IDSL co-author is present)
  const isDisqualified = DISQUALIFIED_DOMAINS.some((dq) => titleVenue.includes(dq));
  const hasIDSLCoAuthor = IDSL_COAUTHORS.some((co) => authorText.includes(co));

  if (isDisqualified && !hasIDSLCoAuthor) {
    return false;
  }

  // 3. Positive match 1: Known IDSL student / collaborator co-author
  if (hasIDSLCoAuthor) {
    return true;
  }

  // 4. Positive match 2: Western / UBC / Waterloo / DEI affiliation
  if (VERIFIED_INSTITUTIONS.some((inst) => affilText.includes(inst))) {
    return true;
  }

  // 5. Positive match 3: From uniquely indexed computer science authorities
  if (pub.source === 'orcid' || pub.source === 'dblp' || pub.source === 's2' || pub.source === 'snapshot') {
    if (!isDisqualified) {
      return true;
    }
  }

  // 6. Match CS & Intelligent Systems domain keywords
  return CS_DOMAINS.some((kw) => titleVenue.includes(kw));
}

/**
 * Categorizes a paper into one of the lab's core research themes based on keywords
 */
export function determineTopic(title = '', venue = '') {
  const text = `${title} ${venue}`.toLowerCase();
  if (
    text.includes('llm') ||
    text.includes('language model') ||
    text.includes('hermes') ||
    text.includes('rag') ||
    text.includes('multi-agent') ||
    text.includes('diffusion') ||
    text.includes('synthia') ||
    text.includes('specmas') ||
    text.includes('nlp') ||
    text.includes('dialogue')
  ) {
    return 'Agentic AI & LLMs';
  }
  if (
    text.includes('adversarial') ||
    text.includes('robust') ||
    text.includes('safe') ||
    text.includes('security') ||
    text.includes('certification') ||
    text.includes('defence') ||
    text.includes('defense') ||
    text.includes('patch') ||
    text.includes('vulnerability') ||
    text.includes('threat') ||
    text.includes('zero-day') ||
    text.includes('secure') ||
    text.includes('malware') ||
    text.includes('byzantine')
  ) {
    return 'Trustworthy & Safe AI';
  }
  if (
    text.includes('cyber-physical') ||
    text.includes('cps') ||
    text.includes('trace') ||
    text.includes('timed regular') ||
    text.includes('boot') ||
    text.includes('specification') ||
    text.includes('embedded') ||
    text.includes('sensor') ||
    text.includes('log') ||
    text.includes('anomaly') ||
    text.includes('iot') ||
    text.includes('controller')
  ) {
    return 'Cyber-Physical Systems & IoT';
  }
  if (
    text.includes('manufacturing') ||
    text.includes('composite') ||
    text.includes('robot') ||
    text.includes('reachy') ||
    text.includes('industrial') ||
    text.includes('automation')
  ) {
    return 'Smart Manufacturing & Robotics';
  }
  return 'Machine Learning & Analytics';
}

/**
 * Generates BibTeX citation string
 */
function generateBibTeX(pub) {
  const tag = (pub.authors || 'Narayan')
    .split(',')[0]
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase() + (pub.year || '2026');
  return `@article{${tag},
  title={${pub.title || ''}},
  author={${pub.authors || 'Apurva Narayan'}},
  journal={${pub.venue || 'Proceedings'}},
  year={${pub.year || ''}}
}`;
}

/**
 * 1. Fetch from OpenAlex API (Open, CORS-enabled, rich citation and DOI data)
 */
async function fetchOpenAlex() {
  const results = [];
  try {
    const urls = [
      `https://api.openalex.org/works?filter=author.orcid:${scholarProfile.orcid}&sort=publication_year:desc&per_page=100`,
      `https://api.openalex.org/works?filter=raw_author_name.search:Apurva%20Narayan,institutions.country_code:ca&sort=publication_year:desc&per_page=100`,
    ];

    const responses = await Promise.allSettled(
      urls.map((u) =>
        fetch(u, { headers: { Accept: 'application/json' } }).then((r) => (r.ok ? r.json() : null))
      )
    );

    responses.forEach((res) => {
      if (res.status === 'fulfilled' && res.value?.results) {
        res.value.results.forEach((work) => {
          if (!work.title) return;
          const authors = (work.authorships || [])
            .map((a) => a.author?.display_name || a.raw_author_name)
            .filter(Boolean)
            .join(', ');

          const affiliations = (work.authorships || [])
            .flatMap((a) => (a.institutions || []).map((inst) => inst.display_name))
            .filter(Boolean)
            .join(', ');

          const venue =
            work.primary_location?.source?.display_name ||
            work.host_venue?.display_name ||
            'Academic Proceedings';

          let pubType = 'Conference';
          if (work.type === 'journal-article' || work.type === 'article') {
            pubType = 'Journal';
          } else if (work.type === 'preprint') {
            pubType = 'Preprint';
          } else if (work.type === 'book-chapter') {
            pubType = 'Book Chapter';
          }

          const candidatePub = {
            id: `openalex-${work.id?.replace(/.*\//, '') || Math.random().toString(36).substring(7)}`,
            title: work.title.replace(/\.$/, '').trim(),
            authors: authors || 'Apurva Narayan',
            venue: venue,
            year: work.publication_year || new Date().getFullYear(),
            citations: work.cited_by_count || 0,
            type: pubType,
            topic: determineTopic(work.title, venue),
            scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(work.title)}`,
            pdfUrl: work.open_access?.oa_url || work.primary_location?.pdf_url || '',
            doi: work.doi || '',
            affiliations: affiliations,
            source: 'openalex',
          };

          // Strict Author Disambiguation: Must be verified as Dr. Apurva Narayan of IDSL / UWO
          if (!isVerifiedIDSLPaper(candidatePub)) {
            return;
          }

          results.push(candidatePub);
        });
      }
    });
  } catch (err) {
    console.warn('OpenAlex API error:', err);
  }
  return results;
}

/**
 * 2. Fetch from Semantic Scholar Academic Graph API (CORS-enabled, citations, venues)
 */
async function fetchSemanticScholar() {
  const results = [];
  try {
    const url = `https://api.semanticscholar.org/graph/v1/author/${scholarProfile.semanticScholarId}/papers?fields=title,year,citationCount,venue,publicationTypes,authors,url,openAccessPdf,externalIds&limit=100`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data)) {
        data.data.forEach((paper) => {
          if (!paper.title) return;
          const authors = (paper.authors || []).map((a) => a.name).join(', ');
          
          // STRICT CHECK: Discard if Apurva Narayan is not an author on it
          if (!hasApurvaNarayanAsAuthor(authors, paper.authors)) {
            return;
          }
          const venue = paper.venue || 'Academic Venue';

          let pubType = 'Conference';
          if (paper.publicationTypes?.includes('JournalArticle')) {
            pubType = 'Journal';
          } else if (paper.publicationTypes?.includes('BookChapter')) {
            pubType = 'Book Chapter';
          }

          const candidatePub = {
            id: `s2-${paper.paperId || Math.random().toString(36).substring(7)}`,
            title: paper.title.replace(/\.$/, '').trim(),
            authors: authors || 'Apurva Narayan',
            venue: venue,
            year: paper.year || new Date().getFullYear(),
            citations: paper.citationCount || 0,
            type: pubType,
            topic: determineTopic(paper.title, venue),
            scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`,
            pdfUrl: paper.openAccessPdf?.url || (paper.externalIds?.ArXiv ? `https://arxiv.org/abs/${paper.externalIds.ArXiv}` : ''),
            doi: paper.externalIds?.DOI ? `https://doi.org/${paper.externalIds.DOI}` : '',
            source: 's2',
          };

          if (!isVerifiedIDSLPaper(candidatePub)) {
            return;
          }

          results.push(candidatePub);
        });
      }
    }
  } catch (err) {
    console.warn('Semantic Scholar API error:', err);
  }
  return results;
}

/**
 * 3. Fetch from DBLP REST API (CORS-enabled, complete CS bibliography)
 */
async function fetchDBLP() {
  const results = [];
  try {
    const dblpUrl = `https://dblp.org/search/publ/api?q=author:%22Apurva_Narayan%22&format=json&h=150`;
    const response = await fetch(dblpUrl);
    if (response.ok) {
      const json = await response.json();
      const hits = json?.result?.hits?.hit;
      if (Array.isArray(hits)) {
        hits.forEach((hit) => {
          const info = hit.info;
          if (!info || !info.title) return;

          const rawTitle = info.title.replace(/\.$/, '').trim();
          let authorStr = 'Apurva Narayan';
          if (info.authors && info.authors.author) {
            const auths = Array.isArray(info.authors.author)
              ? info.authors.author.map((a) => (typeof a === 'string' ? a : a.text || ''))
              : [info.authors.author.text || ''];
            authorStr = auths.join(', ');
          }

          // STRICT CHECK: Discard if Apurva Narayan is not an author
          if (!hasApurvaNarayanAsAuthor(authorStr, info.authors?.author)) {
            return;
          }

          const yearVal = parseInt(info.year, 10) || new Date().getFullYear();
          const venue = info.venue || info.journal || info.booktitle || 'Computer Science Proceedings';

          let pubType = 'Conference';
          if (info.type === 'Journal Articles' || info.journal) {
            pubType = 'Journal';
          } else if (info.type === 'Informal and Other Publications') {
            pubType = 'Preprint';
          }

          const candidatePub = {
            id: `dblp-${info.key || Math.random().toString(36).substring(7)}`,
            title: rawTitle,
            authors: authorStr,
            venue: venue,
            year: yearVal,
            citations: 0,
            type: pubType,
            topic: determineTopic(rawTitle, venue),
            scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(rawTitle)}`,
            doi: info.doi ? `https://doi.org/${info.doi}` : info.ee || '',
            source: 'dblp',
          };

          if (!isVerifiedIDSLPaper(candidatePub)) {
            return;
          }

          results.push(candidatePub);
        });
      }
    }
  } catch (err) {
    console.warn('DBLP API error:', err);
  }
  return results;
}

/**
 * 4. Fallback: Local JSON snapshot served from public/data/publications.json
 */
async function fetchStaticSnapshot() {
  try {
    const publicUrl = process.env.PUBLIC_URL || '';
    const res = await fetch(`${publicUrl}/data/publications.json`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.filter((p) => isVerifiedIDSLPaper({ ...p, source: 'snapshot' }));
      }
    }
  } catch (e) {
    // ignore
  }
  return [];
}

/**
 * Dynamically calculates live citation impact metrics (Total, h-index, i10-index)
 */
export function calculateMetrics(publications = []) {
  let total = 0;
  const counts = [];

  publications.forEach((p) => {
    const c = parseInt(p.citations, 10) || 0;
    total += c;
    counts.push(c);
  });

  counts.sort((a, b) => b - a);

  let h = 0;
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] >= i + 1) {
      h = i + 1;
    } else {
      break;
    }
  }

  const i10 = counts.filter((c) => c >= 10).length;

  return {
    totalCitations: total > 0 ? `${total.toLocaleString()}+` : scholarProfile.defaultCitations,
    hIndex: h > 0 ? h.toString() : scholarProfile.defaultHIndex,
    i10Index: i10 > 0 ? i10.toString() : scholarProfile.defaultI10Index,
  };
}

/**
 * Master function: Fetches live publications across OpenAlex, Semantic Scholar,
 * DBLP, and local snapshot, merges & deduplicates them in real time.
 */
export const fetchAllPublications = async (firestorePubs = [], forceRefresh = false) => {
  // Check localStorage cache first for fast rendering
  if (!forceRefresh) {
    try {
      const cachedStr = localStorage.getItem(CACHE_KEY);
      if (cachedStr) {
        const { timestamp, data } = JSON.parse(cachedStr);
        if (Array.isArray(data) && data.length > 0 && Date.now() - timestamp < CACHE_TTL_MS) {
          const cleanCached = data.filter((p) => isVerifiedIDSLPaper(p));
          // Asynchronously trigger a fresh background sync
          setTimeout(() => fetchAllPublications(firestorePubs, true), 1000);
          return cleanCached;
        }
      }
    } catch (e) {}
  }

  // Fetch concurrently from all open academic APIs and static snapshot
  const [openAlexPubs, s2Pubs, dblpPubs, staticPubs] = await Promise.all([
    fetchOpenAlex(),
    fetchSemanticScholar(),
    fetchDBLP(),
    fetchStaticSnapshot(),
  ]);

  const mergedMap = new Map();

  const cleanScholarUrl = (url, title) => {
    if (url && !url.includes('view_op=view_citation')) {
      return url;
    }
    return `https://scholar.google.com/scholar?q=${encodeURIComponent(title || '')}`;
  };

  const addOrMerge = (pub) => {
    if (!pub || !pub.title) return;
    // Strict disambiguation: Must be verified as Dr. Apurva Narayan of IDSL / UWO
    if (!isVerifiedIDSLPaper(pub)) {
      return;
    }
    const key = normalizeTitle(pub.title);
    if (!key) return;

    const validatedScholarUrl = cleanScholarUrl(pub.scholarUrl, pub.title);

    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        ...pub,
        scholarUrl: validatedScholarUrl,
        bibtex: pub.bibtex || generateBibTeX(pub),
      });
    } else {
      const existing = mergedMap.get(key);
      // Keep maximum citations
      const maxCitations = Math.max(existing.citations || 0, pub.citations || 0);

      // Prefer longer author string with Apurva Narayan
      let bestAuthors = existing.authors;
      if (pub.authors && pub.authors.length > (existing.authors || '').length) {
        bestAuthors = pub.authors;
      }

      // Merge richest metadata
      mergedMap.set(key, {
        ...existing,
        citations: maxCitations,
        authors: bestAuthors,
        venue: existing.venue || pub.venue,
        year: Math.max(existing.year || 0, pub.year || 0) || existing.year,
        doi: existing.doi || pub.doi,
        pdfUrl: existing.pdfUrl || pub.pdfUrl,
        scholarUrl: cleanScholarUrl(existing.scholarUrl || validatedScholarUrl, pub.title),
        type: existing.type || pub.type,
        topic: existing.topic || pub.topic || determineTopic(existing.title, existing.venue),
        bibtex: existing.bibtex || pub.bibtex || generateBibTeX(existing),
      });
    }
  };

  // Add in order: static snapshot first (base), then DBLP, then Semantic Scholar, then OpenAlex (most authoritative)
  staticPubs.forEach(addOrMerge);
  dblpPubs.forEach(addOrMerge);
  s2Pubs.forEach(addOrMerge);
  openAlexPubs.forEach(addOrMerge);

  // Merge any manual Firestore publications
  if (Array.isArray(firestorePubs) && firestorePubs.length > 0) {
    firestorePubs.forEach((pub) => {
      let parsed = {};
      if (pub.bibText) {
        try {
          parsed = parseBibTeX(pub.bibText) || {};
        } catch (e) {}
      }
      const title = parsed.title || pub.title;
      if (title) {
        addOrMerge({
          id: `fs-${Math.random().toString(36).substring(7)}`,
          title: title,
          authors: parsed.author || pub.authors || 'Apurva Narayan',
          venue: parsed.booktitle || parsed.journal || pub.booktitle || 'Publication',
          year: parseInt(parsed.year, 10) || pub.year || new Date().getFullYear(),
          citations: pub.citations || 0,
          type: pub.publicationType || 'Conference',
          topic: determineTopic(title, parsed.booktitle || ''),
          scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`,
          bibtex: pub.bibText || generateBibTeX({ title, authors: pub.authors, year: pub.year }),
        });
      }
    });
  }

  const mergedList = Array.from(mergedMap.values());

  // Sort descending by year, then citations
  mergedList.sort((a, b) => (b.year || 0) - (a.year || 0) || (b.citations || 0) - (a.citations || 0));

  // Update localStorage cache
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data: mergedList,
      })
    );
  } catch (e) {}

  return mergedList;
};
