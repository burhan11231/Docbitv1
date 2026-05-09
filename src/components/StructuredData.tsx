
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  data: any | any[];
}

/**
 * Reusable component to inject structured data (JSON-LD) into the <head>
 * Safeguards:
 * 1. Uses react-helmet-async for proper hydration and management.
 * 2. Filters out potential duplicates by @type within the same render.
 * 3. Adds data-rh="true" to play nice with static prerendering.
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  if (!data) return null;

  const rawSchemas = Array.isArray(data) ? data : [data];
  
  // Filter out nulls and handle basic deduplication by @type
  const seenTypes = new Set<string>();
  const schemas = rawSchemas.filter(s => {
    if (!s || typeof s !== 'object') return false;
    const type = s['@type'];
    if (!type) return true; // Keep anonymous schemas
    
    if (seenTypes.has(type)) {
      console.warn(`Duplicate schema type detected: ${type}. Removing extra instance.`);
      return false;
    }
    seenTypes.add(type);
    return true;
  });

  return (
    <Helmet>
      {schemas.map((schema, index) => {
        const type = schema['@type'] || 'Schema';
        return (
          <script 
            key={`${type}-${index}`} 
            type="application/ld+json"
            id={`schema-${type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            data-rh="true"
          >
            {JSON.stringify(schema)}
          </script>
        );
      })}
    </Helmet>
  );
};
