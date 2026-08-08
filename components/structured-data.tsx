export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FundyLogic',
    legalName: 'Fundy Logic Inc.',
    url: 'https://fundylogic.com',
    logo: 'https://fundylogic.com/logo.png',
    description: 'Custom-built AI agents that live on your website. Qualify leads, answer questions 24/7, and automate follow-up. Built in New Brunswick, Canada.',
    areaServed: [
      { '@type': 'Place', name: 'New Brunswick, Canada' },
      { '@type': 'Place', name: 'Atlantic Canada' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Quispamsis',
      addressRegion: 'NB',
      addressCountry: 'CA',
    },
    founder: {
      '@type': 'Person',
      name: 'Corey Miller',
    },
    sameAs: [
      'https://github.com/coreyfmiller',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FundyLogic',
    url: 'https://fundylogic.com',
    publisher: {
      '@type': 'Organization',
      name: 'FundyLogic',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is an AI chat agent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An AI chat agent is a custom-trained assistant that lives on your website, answers customer questions in natural language 24/7, qualifies leads, and captures contact information while you sleep.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does an AI agent cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI agent plans start at $197/month. This includes 24/7 availability, custom training on your business, lead capture, and conversation summaries delivered to your inbox.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is this different from a chatbot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Traditional chatbots follow scripts and break when users go off-menu. AI agents understand natural language, generate responses from your business knowledge, and adapt to any conversation while working toward goals like lead capture.',
        },
      },
      {
        '@type': 'Question',
        name: 'What areas does FundyLogic serve?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'FundyLogic is based in the Kennebecasis Valley, New Brunswick and serves businesses across Atlantic Canada. Our AI agents work for any English-speaking business regardless of location.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does it take to set up an AI agent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most AI agents are live within 5-7 business days. We handle the training, testing, and deployment. You provide your business information and we do the rest.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I try it before committing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. You can chat with our AI agent LOGIC right now on this website, or call it using the voice feature. That is the same technology we deploy for clients.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
