import { useEffect } from 'react';

const SITE_URL = `https://chauhanshailesh906.github.io${import.meta.env.BASE_URL.replace(/\/$/, '')}`;

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function SEO({ title, description, canonicalPath, noindex = false, structuredData }) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    let openGraphUrl = document.head.querySelector('meta[property="og:url"]');
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonicalPath) {
      if (!openGraphUrl) {
        openGraphUrl = document.createElement('meta');
        openGraphUrl.setAttribute('property', 'og:url');
        document.head.appendChild(openGraphUrl);
      }
      openGraphUrl.setAttribute('content', `${SITE_URL}${canonicalPath}`);
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `${SITE_URL}${canonicalPath}`);
    } else {
      openGraphUrl?.remove();
      canonical?.remove();
    }

    let schema = document.getElementById('business-structured-data');
    if (structuredData) {
      if (!schema) {
        schema = document.createElement('script');
        schema.id = 'business-structured-data';
        schema.type = 'application/ld+json';
        document.head.appendChild(schema);
      }
      schema.textContent = JSON.stringify(structuredData);
    } else {
      schema?.remove();
    }
  }, [title, description, canonicalPath, noindex, structuredData]);

  return null;
}

export default SEO;
