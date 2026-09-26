export const siteBase = 'https://laabh-portfolio.netlify.app';
export const pages = [
  {
    path: '/',
    title: 'Laabh Gupta — AI/ML Engineer | Software Engineer | MLOps & DevOps',
    description:
      'AI & Data Engineer at EY GDS. Explore ArguLab, applied machine learning projects, full-stack engineering and MLOps workflows by Laabh Gupta.',
    schema: {
      '@type': 'Person',
      name: 'Laabh Gupta',
      url: `${siteBase}/`,
      jobTitle: 'AI & Data Engineer',
      worksFor: { '@type': 'Organization', name: 'Ernst & Young Global Delivery Services' },
      sameAs: [
        'https://github.com/Laabh-Gupta',
        'https://linkedin.com/in/laabhgupta',
        'https://leetcode.com/u/laabhgupta',
      ],
      email: 'mailto:reachlaabhgupta@gmail.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Kanpur', addressCountry: 'IN' },
    },
  },
  {
    path: '/projects/argulab',
    title: 'ArguLab — AI Application Engineering Case Study | Laabh Gupta',
    description:
      'Inside ArguLab: nine communication practice modes, persistent training context, structured AI evaluation, authenticated APIs and a deployed full-stack architecture.',
    schema: {
      '@type': 'SoftwareApplication',
      name: 'ArguLab',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web browser',
      url: 'https://argulab.netlify.app/dashboard',
      author: { '@type': 'Person', name: 'Laabh Gupta', url: `${siteBase}/` },
      description:
        'AI communication practice and personalized training platform with nine practice modes.',
    },
  },
  {
    path: '/404',
    title: 'Page not found | Laabh Gupta',
    description: 'Return to Laabh Gupta’s AI and software engineering portfolio.',
    schema: null,
  },
];
