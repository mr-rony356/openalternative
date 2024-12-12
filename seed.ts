import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Licenses
  const licenses = await prisma.license.createMany({
    data: [
      { 
        name: 'MIT License', 
        slug: 'mit', 
        description: 'A permissive license allowing reuse within proprietary software',
        content: 'Full MIT License text...'
      },
      { 
        name: 'Apache 2.0', 
        slug: 'apache-2', 
        description: 'A permissive free software license written by the Apache Software Foundation',
        content: 'Full Apache 2.0 License text...'
      }
    ]
  });

  // Create Languages
  const languages = await prisma.language.createMany({
    data: [
      { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
      { name: 'Python', slug: 'python', color: '#3776AB' },
      { name: 'Rust', slug: 'rust', color: '#DEA584' }
    ]
  });

  // Create Categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'AI Tools', slug: 'ai-tools', label: 'AI' },
      { name: 'Web Development', slug: 'web-development', label: 'Web Dev' },
      { name: 'Productivity', slug: 'productivity' }
    ]
  });

  // Create Topics
  const topics = await prisma.topic.createMany({
    data: [
      { slug: 'machine-learning' },
      { slug: 'open-source' },
      { slug: 'developer-tools' }
    ]
  });

  // Create Tools
  const mitLicense = await prisma.license.findFirst({ where: { slug: 'mit' } });

  const openAITool = await prisma.tool.create({
    data: {
      name: 'OpenAI GPT',
      slug: 'openai-gpt',
      website: 'https://openai.com/gpt',
      repository: 'https://github.com/openai/gpt',
      tagline: 'Advanced AI Language Model',
      description: 'Powerful AI model for various natural language tasks',
      stars: 25000,
      forks: 5000,
      status: 'Published',
      publishedAt: new Date(),
      licenseId: mitLicense?.id,
      categories: {
        create: [
          { category: { connect: { slug: 'ai-tools' } } }
        ]
      },
      languages: {
        create: [
          { language: { connect: { slug: 'python' } }, percentage: 80 },
          { language: { connect: { slug: 'typescript' } }, percentage: 20 }
        ]
      },
      topics: {
        create: [
          { topic: { connect: { slug: 'machine-learning' } } },
          { topic: { connect: { slug: 'open-source' } } }
        ]
      }
    }
  });

  const nextjsTool = await prisma.tool.create({
    data: {
      name: 'Next.js',
      slug: 'nextjs',
      website: 'https://nextjs.org',
      repository: 'https://github.com/vercel/next.js',
      tagline: 'React Framework for Production',
      description: 'The React Framework for building web applications',
      stars: 110000,
      forks: 22000,
      status: 'Published',
      publishedAt: new Date(),
      licenseId: mitLicense?.id,
      categories: {
        create: [
          { category: { connect: { slug: 'web-development' } } }
        ]
      },
      languages: {
        create: [
          { language: { connect: { slug: 'typescript' } }, percentage: 100 }
        ]
      },
      topics: {
        create: [
          { topic: { connect: { slug: 'developer-tools' } } },
          { topic: { connect: { slug: 'open-source' } } }
        ]
      }
    }
  });

  // Create Alternatives
  const alternativeToNextjs = await prisma.alternative.create({
    data: {
      name: 'Remix',
      slug: 'remix',
      description: 'A full stack web framework for React',
      website: 'https://remix.run',
      tools: {
        create: [
          { tool: { connect: { id: nextjsTool.id } } }
        ]
      }
    }
  });

  // Create Ad
  const ad = await prisma.ad.create({
    data: {
      email: 'advertiser@example.com',
      name: 'Tech Innovators',
      description: 'Showcasing cutting-edge technology solutions',
      website: 'https://techinnovators.com',
      type: 'Homepage',
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });