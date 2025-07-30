import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
}

const DEFAULT_KEYWORDS = [
  'ISAC',
  'International Student Advocacy Committee',
  'international students',
  'study abroad',
  'student mentorship',
  'university guidance',
  'student community',
  'international education',
];

const BASE_URL = 'https://www.isac-usa.org';
const SITE_NAME = 'ISAC - International Student Advocacy Committee';
const DEFAULT_IMAGE = '/Isac-logo.png';

/**
 * Generate comprehensive metadata for SEO optimization
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  canonicalUrl,
  images = [],
  type = 'website',
  noIndex = false,
}: SEOConfig): Metadata {
  const fullTitle = title.includes('ISAC') ? title : `${title} | ISAC`;
  const allKeywords = [...DEFAULT_KEYWORDS, ...keywords];
  const canonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : undefined;
  
  const defaultImage = {
    url: DEFAULT_IMAGE,
    width: 1200,
    height: 630,
    alt: 'ISAC - International Student Advocacy Committee',
  };
  
  const seoImages = images.length > 0 ? images : [defaultImage];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: 'ISAC Team' }],
    creator: SITE_NAME,
    publisher: 'ISAC',
    
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
    
    openGraph: {
      type,
      locale: 'en_US',
      url: canonical || BASE_URL,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: seoImages,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: seoImages.map(img => img.url),
      creator: '@ISAC_Global',
      site: '@ISAC_Global',
    },
    
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate structured data for different content types
 */
export const structuredData = {
  /**
   * Generate FAQ structured data
   */
  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),

  /**
   * Generate Article structured data
   */
  article: ({
    headline,
    description,
    author,
    datePublished,
    dateModified,
    image,
    url,
  }: {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    url: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}${DEFAULT_IMAGE}`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    image: image ? `${BASE_URL}${image}` : `${BASE_URL}${DEFAULT_IMAGE}`,
    url: `${BASE_URL}${url}`,
  }),

  /**
   * Generate Event structured data
   */
  event: ({
    name,
    description,
    startDate,
    endDate,
    location,
    organizer,
    url,
    image,
    offers,
  }: {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location: string;
    organizer?: string;
    url: string;
    image?: string;
    offers?: {
      price: string;
      currency: string;
      availability: string;
    };
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    location: location || {
      '@type': 'VirtualLocation',
      url: `${BASE_URL}${url}`,
    },
    organizer: {
      '@type': 'Organization',
      name: organizer || SITE_NAME,
    },
    image: image ? `${BASE_URL}${image}` : `${BASE_URL}${DEFAULT_IMAGE}`,
    url: `${BASE_URL}${url}`,
    ...(offers && {
      offers: {
        '@type': 'Offer',
        price: offers.price,
        priceCurrency: offers.currency,
        availability: `https://schema.org/${offers.availability}`,
      },
    }),
  }),

  /**
   * Generate Review structured data
   */
  review: ({
    itemName,
    reviewBody,
    reviewRating,
    author,
    datePublished,
  }: {
    itemName: string;
    reviewBody: string;
    reviewRating: number;
    author: string;
    datePublished: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Organization',
      name: itemName,
    },
    reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: reviewRating,
      bestRating: 5,
    },
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
  }),

  /**
   * Generate Course structured data
   */
  course: ({
    name,
    description,
    provider,
    courseMode,
    educationalLevel,
    timeRequired,
    url,
  }: {
    name: string;
    description: string;
    provider?: string;
    courseMode?: string;
    educationalLevel?: string;
    timeRequired?: string;
    url: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider || SITE_NAME,
    },
    courseMode: courseMode || 'online',
    educationalLevel,
    timeRequired,
    url: `${BASE_URL}${url}`,
  }),
};

/**
 * Generate JSON-LD script tag for structured data
 */
export function generateStructuredDataScript(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
}

/**
 * SEO best practices checker
 */
export const seoChecker = {
  /**
   * Check if title is SEO optimized
   */
  checkTitle: (title: string) => {
    const issues = [];
    if (title.length < 30) issues.push('Title too short (should be 30-60 characters)');
    if (title.length > 60) issues.push('Title too long (should be 30-60 characters)');
    if (!title.includes('ISAC') && !title.includes('International Student')) {
      issues.push('Title should include brand name or main keyword');
    }
    return {
      isOptimal: issues.length === 0,
      issues,
      score: Math.max(0, 100 - issues.length * 25),
    };
  },

  /**
   * Check if description is SEO optimized
   */
  checkDescription: (description: string) => {
    const issues = [];
    if (description.length < 120) issues.push('Description too short (should be 120-160 characters)');
    if (description.length > 160) issues.push('Description too long (should be 120-160 characters)');
    if (!description.includes('ISAC') && !description.includes('international student')) {
      issues.push('Description should include main keywords');
    }
    return {
      isOptimal: issues.length === 0,
      issues,
      score: Math.max(0, 100 - issues.length * 25),
    };
  },

  /**
   * Check keywords optimization
   */
  checkKeywords: (keywords: string[]) => {
    const issues = [];
    if (keywords.length < 5) issues.push('Add more relevant keywords (aim for 5-10)');
    if (keywords.length > 15) issues.push('Too many keywords (limit to 10-15)');
    
    const hasMainKeyword = keywords.some(k => 
      k.toLowerCase().includes('isac') || 
      k.toLowerCase().includes('international student')
    );
    if (!hasMainKeyword) issues.push('Include main brand/topic keywords');
    
    return {
      isOptimal: issues.length === 0,
      issues,
      score: Math.max(0, 100 - issues.length * 20),
    };
  },
};

/**
 * Generate sitemap URLs
 */
export function generateSitemapUrls() {
  const basePages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/whatsapp-groups', priority: 0.9, changefreq: 'weekly' },
    { url: '/volunteers', priority: 0.8, changefreq: 'weekly' },
    { url: '/webinars', priority: 0.8, changefreq: 'weekly' },
    { url: '/testimonials', priority: 0.7, changefreq: 'weekly' },
  ];

  return basePages.map(page => ({
    ...page,
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date().toISOString(),
  }));
}

/**
 * Content optimization suggestions
 */
export const contentOptimization = {
  /**
   * Suggest improvements for content SEO
   */
  analyzePage: (content: {
    title: string;
    description: string;
    headings: string[];
    wordCount: number;
    keywords: string[];
  }) => {
    const suggestions = [];
    
    // Title analysis
    const titleCheck = seoChecker.checkTitle(content.title);
    if (!titleCheck.isOptimal) {
      suggestions.push(...titleCheck.issues.map(issue => `Title: ${issue}`));
    }
    
    // Description analysis
    const descCheck = seoChecker.checkDescription(content.description);
    if (!descCheck.isOptimal) {
      suggestions.push(...descCheck.issues.map(issue => `Description: ${issue}`));
    }
    
    // Content length
    if (content.wordCount < 300) {
      suggestions.push('Content: Add more content (aim for 300+ words for better SEO)');
    }
    
    // Headings structure
    if (content.headings.length < 2) {
      suggestions.push('Structure: Add more headings (H2, H3) to improve content structure');
    }
    
    // Keyword density
    const keywordCheck = seoChecker.checkKeywords(content.keywords);
    if (!keywordCheck.isOptimal) {
      suggestions.push(...keywordCheck.issues.map(issue => `Keywords: ${issue}`));
    }
    
    return {
      score: Math.round((titleCheck.score + descCheck.score + keywordCheck.score) / 3),
      suggestions,
      isOptimal: suggestions.length === 0,
    };
  },
};