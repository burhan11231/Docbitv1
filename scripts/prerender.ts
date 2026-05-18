import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock browser globals for TSX imports to avoid issues
if (typeof window === 'undefined') {
  (global as any).window = {};
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data directly from source
import { SEO_CONFIG, SITE_NAME, APP_DOMAIN, THEME_COLOR, GLOBAL_OG_IMAGE } from '../src/seo/seoConfig';
import { getSoftwareAppSchema, getWebApplicationSchema, getBreadcrumbSchema, getWebSiteSchema, getHowToSchema } from '../src/seo/structuredData';
import { getFAQSchema } from '../src/utils/schema/faqSchema';
import { TOOLS } from '../src/constants/tools';

const DIST_DIR = path.join(process.cwd(), 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('Build directory or index.html not found. Run npm run build first.');
  process.exit(1);
}

const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// The Naked Template should have no SEO metadata. 
// We will strip everything that we intend to inject.
function getNakedTemplate(html: string) {
  let naked = html;
  
  // Strip JSON-LD Scripts - handles multiline and varied attribute order
  naked = naked.replace(/<script[^>]*?application\/ld\+json[^>]*?>[\s\S]*?<\/script>/gi, '');
  
  // Strip Title, Description, Keywords, Canonical
  naked = naked.replace(/<title>.*?<\/title>/gi, '');
  naked = naked.replace(/<meta name="description" content=".*?" \/>/gi, '');
  naked = naked.replace(/<meta name="keywords" content=".*?" \/>/gi, '');
  naked = naked.replace(/<link rel="canonical" href=".*?" \/>/gi, '');
  
  // Strip OG Tags and Twitter Tags more broadly
  naked = naked.replace(/<meta property="og:.*?" content=".*?" \/>/gi, '');
  naked = naked.replace(/<meta name="twitter:.*?" content=".*?" \/>/gi, '');
  naked = naked.replace(/<meta property="twitter:.*?" content=".*?" \/>/gi, '');
  
  // Strip SEO Placeholders comment and injection point
  naked = naked.replace(/<!-- SEO Placeholders -->/gi, '');
  naked = naked.replace(/<!-- SEO_METADATA_INJECTION_POINT -->/gi, '');
  
  // Clean up excessive whitespace/newlines in head
  naked = naked.replace(/<head>\s+/gi, '<head>\n');
  
  return naked;
}

const nakedTemplate = getNakedTemplate(template);

// Build the routes list dynamically
const routes: any[] = [
  { path: '/', config: SEO_CONFIG.home, type: 'home' },
  { path: '/about', config: SEO_CONFIG.about, type: 'page' },
  { path: '/contact', config: SEO_CONFIG.contact, type: 'page' },
  { path: '/privacy', config: SEO_CONFIG.privacy || { title: `Privacy Policy | ${SITE_NAME}`, description: 'Our commitment to your data security.', canonical: `${APP_DOMAIN}/privacy`, ogImage: GLOBAL_OG_IMAGE }, type: 'page' },
  { path: '/terms', config: SEO_CONFIG.terms || { title: `Terms of Service | ${SITE_NAME}`, description: 'The rules for using our platform.', canonical: `${APP_DOMAIN}/terms`, ogImage: GLOBAL_OG_IMAGE }, type: 'page' },
];

// Add tool routes from TOOLS constant
TOOLS.forEach(tool => {
  // Map tool IDs to SEO_CONFIG keys if they differ slightly
  let configKey = tool.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  if (configKey === 'imgToPdf') configKey = 'imgToPdf'; // match
  
  const seoConfig = SEO_CONFIG[configKey];
  
  routes.push({
    path: tool.href,
    config: seoConfig || {
      title: tool.seoTitle || tool.name,
      description: tool.seoDescription || tool.description,
      keywords: tool.keywords ? tool.keywords.join(', ') : '',
      canonical: `${APP_DOMAIN}${tool.href}`,
      ogImage: GLOBAL_OG_IMAGE
    },
    type: 'tool',
    toolData: tool
  });
});

function generateSchemas(route: any) {
  const schemas: any[] = [];
  const { config, type, toolData } = route;

  if (type === 'home') {
    schemas.push(getSoftwareAppSchema(config.description));
    schemas.push(getWebSiteSchema());
    schemas.push(getBreadcrumbSchema([{ name: 'Home', item: APP_DOMAIN }]));
    schemas.push(getFAQSchema([
      { q: "Is DocBit really free?", a: "Yes, DocBit is completely free to use. There are no limits on how many files you can process, and we don't have any 'premium' tiers." },
      { q: "How are my files handled?", a: "Unlike other tools, DocBit processes your files directly in your web browser. This means your documents never leave your computer or phone." },
      { q: "Do I need to install anything?", a: "No installation is required. DocBit is a web-based platform that works on any modern browser including Chrome, Safari, and Firefox." },
      { q: "Is it secure for sensitive data?", a: "Because of our on-device processing architecture, DocBit is one of the most secure ways to handle sensitive documents like contracts or medical records." }
    ]));
  } else {
    // Breadcrumb for all non-home pages
    const pageTitle = route.config.title.includes(' | ') ? route.config.title.split(' | ')[0].trim() : route.config.title.split(' – ')[0].trim();
    schemas.push(getBreadcrumbSchema([
      { name: 'Home', item: APP_DOMAIN },
      { name: pageTitle, item: config.canonical }
    ]));

    if (type === 'tool' && toolData) {
      schemas.push(getWebApplicationSchema(config.title, config.description, config.canonical));
      if (toolData.faqs) {
        schemas.push(getFAQSchema(toolData.faqs));
      }
      if (toolData.steps) {
        schemas.push(getHowToSchema(toolData.name, toolData.description, toolData.steps));
      }
    }
  }

  return schemas;
}

function generateSemanticBody(route: any) {
  const { config, type, toolData } = route;
  const siteName = SITE_NAME;
  let body = '';

  const h1 = config.title.includes(' | ') ? config.title.split(' | ')[0].trim() : config.title.includes(' – ') ? config.title.split(' – ')[0].trim() : config.title;

  if (type === 'home') {
    body = `
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/tools/merge-pdf">Merge PDF</a>
          <a href="/tools/split-pdf">Split PDF</a>
        </nav>
        <h1>Free Online PDF Tools - Secure, Fast & Private</h1>
        <p>DocBit is your all-in-one PDF utility platform. Process your documents directly in your browser with absolute privacy and native speed. No uploads, no server logs, 100% private.</p>
      </header>
      <main>
        <section>
          <h2>Professional PDF Toolkit</h2>
          <p>We provide high-quality document conversion and editing tools designed for speed and security. Our browser-native engine ensures that sensitive information never leaves your side.</p>
          <ul>
            <li><strong>Merge PDF</strong>: Combine multiple PDF files into one clean document.</li>
            <li><strong>Split PDF</strong>: Extract specific pages or divide a large PDF into smaller files.</li>
            <li><strong>Image to PDF</strong>: Convert photos (JPG, PNG) into organized PDF documents.</li>
            <li><strong>PDF to Image</strong>: Export PDF pages as high-quality images for easy sharing.</li>
            <li><strong>Grayscale PDF</strong>: Convert color documents to monochrome for efficient printing.</li>
          </ul>
        </section>
        <section>
          <h2>The DocBit Advantage</h2>
          <p>Unlike traditional online tools, DocBit processes everything on your device. This means faster speeds (no upload time) and guaranteed privacy for your medical records, contracts, and personal photos.</p>
        </section>
      </main>
      <footer>
        <p>© ${new Date().getFullYear()} ${siteName}. Fast, Free, and Secure.</p>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/contact">Contact</a>
      </footer>
    `;
  } else if (type === 'tool' && toolData) {
    body = `
      <header>
        <nav><a href="/">← Back to Home</a></nav>
        <h1>${h1}</h1>
        <p>${config.description}</p>
      </header>
      <main>
        <article>
          <h2>About ${toolData.name}</h2>
          <p>${toolData.description}</p>
          ${toolData.steps ? `
            <h3>How to use ${toolData.name} in 4 simple steps</h3>
            <ol>
              ${toolData.steps.map((s: any) => `<li><strong>${s.name}</strong>: ${s.text}</li>`).join('')}
            </ol>
          ` : ''}
          ${toolData.faqs ? `
            <h3>Frequently Asked Questions</h3>
            ${toolData.faqs.map((f: any) => `<div><h4>${f.q}</h4><p>${f.a}</p></div>`).join('')}
          ` : ''}
        </article>
      </main>
      <footer>
        <p>Processed locally on your device by ${siteName}.</p>
      </footer>
    `;
  } else {
    body = `
      <header>
        <nav><a href="/">← Back to Home</a></nav>
        <h1>${h1}</h1>
        <p>${config.description}</p>
      </header>
      <main>
        <p>DocBit is dedicated to providing high-quality, private document tools for everyone. Learn more about our mission on our About page.</p>
      </main>
    `;
  }

  // Wrap in a hidden div to avoid flashing during hydration if needed, 
  // but for SEO we want it visible in the source.
  return `<div id="root">${body}</div>`;
}

console.log('Starting True Static Route Generation...');

routes.forEach((route) => {
  const { config } = route;
  const fullTitle = config.title.includes(SITE_NAME) ? config.title : `${config.title} | ${SITE_NAME}`;
  const finalOgImage = config.ogImage || GLOBAL_OG_IMAGE;
  const schemas = generateSchemas(route);

  console.log(`- Prerendering ${route.path}: ${fullTitle}`);

  // Use a fresh copy of the naked template for every route
  let html = nakedTemplate.slice(); 

  // Inject Meta Tags after charset/viewport for best crawler compatibility
  const metaTags = `
    <title data-rh="true">${fullTitle}</title>
    <meta data-rh="true" name="title" content="${fullTitle}" />
    <meta data-rh="true" name="description" content="${config.description}" />
    <meta data-rh="true" name="keywords" content="${config.keywords || (Array.isArray(config.keywords) ? config.keywords.join(', ') : config.keywords) || ''}" />
    <link data-rh="true" rel="canonical" href="${config.canonical}" />

    <!-- Open Graph / Facebook -->
    <meta data-rh="true" property="og:type" content="website" />
    <meta data-rh="true" property="og:url" content="${config.canonical}" />
    <meta data-rh="true" property="og:title" content="${fullTitle}" />
    <meta data-rh="true" property="og:description" content="${config.description}" />
    <meta data-rh="true" property="og:image" content="${finalOgImage}" />
    <meta data-rh="true" property="og:image:secure_url" content="${finalOgImage}" />
    <meta data-rh="true" property="og:site_name" content="${SITE_NAME}" />
    <meta data-rh="true" property="og:locale" content="en_IN" />

    <!-- Twitter -->
    <meta data-rh="true" name="twitter:card" content="summary_large_image" />
    <meta data-rh="true" name="twitter:url" content="${config.canonical}" />
    <meta data-rh="true" name="twitter:title" content="${fullTitle}" />
    <meta data-rh="true" name="twitter:description" content="${config.description}" />
    <meta data-rh="true" name="twitter:image" content="${finalOgImage}" />
    <meta data-rh="true" name="twitter:site" content="@DocBit_In" />

    <!-- Structured Data -->
    ${(() => {
      const seenTypes = new Set();
      return schemas
        .filter(s => {
          if (!s) return false;
          const type = s['@type'];
          if (!type) return true;
          if (seenTypes.has(type)) return false;
          seenTypes.add(type);
          return true;
        })
        .map(s => `<script type="application/ld+json" id="schema-${(s['@type'] || 'item').toLowerCase().replace(/[^a-z0-9]/g, '-')}" data-rh="true">${JSON.stringify(s)}</script>`)
        .join('\n    ');
    })()}
  `;

  // Inject after viewport meta tag to keep charset at the very top
  if (html.includes('viewport" content="width=device-width, initial-scale=1.0" />')) {
    html = html.replace('viewport" content="width=device-width, initial-scale=1.0" />', 'viewport" content="width=device-width, initial-scale=1.0" />' + `\n    ${metaTags}`);
  } else {
    html = html.replace('<head>', `<head>\n    ${metaTags}`);
  }

  // Inject Semantic Body for SEO and AI Overviews
  const semanticBody = generateSemanticBody(route);
  html = html.replace('<div id="root"></div>', semanticBody);

  // 3. Save to file
  const relativePath = route.path === '/' ? 'index.html' : path.join(route.path.startsWith('/') ? route.path.substring(1) : route.path, 'index.html');
  const outputPath = path.join(DIST_DIR, relativePath);
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html);
});

// 4. Generate Split Sitemaps
console.log('\nGenerating Split Sitemaps...');

const today = new Date().toISOString().split('T')[0];

const generateSitemapXml = (routes: any[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes.map(route => `  <url>
    <loc>${route.config.canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.type === 'tool' || route.type === 'home' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route.type === 'home' ? '1.0' : route.type === 'tool' ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

const pagesRoutes = routes.filter(r => r.type === 'page' || r.type === 'home');
const toolsRoutes = routes.filter(r => r.type === 'tool');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const pagesXml = generateSitemapXml(pagesRoutes);
const toolsXml = generateSitemapXml(toolsRoutes);

// Write Split Sitemaps
[DIST_DIR, PUBLIC_DIR].forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.writeFileSync(path.join(dir, 'sitemap-pages.xml'), pagesXml);
    fs.writeFileSync(path.join(dir, 'sitemap-tools.xml'), toolsXml);
  }
});

// Generate Sitemap Index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
  <sitemap>
    <loc>${APP_DOMAIN}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${APP_DOMAIN}/sitemap-tools.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

[DIST_DIR, PUBLIC_DIR].forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapIndex);
  }
});

console.log('Split Sitemaps and Index generated in dist/ and public/!');
console.log('Static Generation Complete! Your dist/ directory is now SEO-ready.');
