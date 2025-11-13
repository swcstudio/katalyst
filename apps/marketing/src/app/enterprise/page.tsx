import type { Metadata } from 'next';
import Image from 'next/image';

import { Border } from '@/components/Border';
import { ContactSection } from '@/components/ContactSection';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { GridList, GridListItem } from '@/components/GridList';
import { PageIntro } from '@/components/PageIntro';
import { RootLayout } from '@/components/RootLayout';
import { SectionIntro } from '@/components/SectionIntro';
import { StatList, StatListItem } from '@/components/StatList';
import { Web3MLFeaturesSection } from '@/components/blocks/web3-ml-features-section';
import imageLaptop from '@/images/laptop.jpg';
import { List, ListItem } from '@/components/List';

function EnterpriseSolutions() {
  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-24 sm:mt-32 lg:mt-40 lg:py-32">
      <SectionIntro
        eyebrow="Enterprise solutions"
        title="Transforming Australian enterprises through Web3 ML innovation."
        invert
      >
        <p>Our enterprise-grade Web3 ML solutions are engineered for Australia's unique business landscape, regulatory environment, and operational challenges.</p>
      </SectionIntro>
      <Container className="mt-16">
        <GridList>
          <GridListItem title="Mining & Resources" invert>
            Intelligent blockchain systems that optimize resource extraction, supply chain transparency, 
            and environmental compliance while reducing operational costs by up to 35%.
          </GridListItem>
          <GridListItem title="Financial Services" invert>
            Decentralized AI-powered risk assessment, fraud detection, and compliance automation 
            that meets Australian banking standards and regulatory requirements.
          </GridListItem>
          <GridListItem title="Government & Infrastructure" invert>
            Secure, transparent blockchain solutions for citizen services, identity management, 
            and inter-agency data sharing with military-grade encryption.
          </GridListItem>
          <GridListItem title="Agriculture & Supply Chain" invert>
            Farm-to-table traceability systems using IoT sensors and ML analytics to ensure 
            food safety, quality assurance, and export compliance.
          </GridListItem>
        </GridList>
      </Container>
    </div>
  );
}

function TechnicalArchitecture() {
  return (
    <>
      <SectionIntro
        eyebrow="Technical architecture"
        title="Enterprise-grade Web3 ML infrastructure built for Australian conditions."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          Our proprietary Web3 ML stack combines cutting-edge artificial intelligence with enterprise blockchain 
          infrastructure, designed specifically for Australian regulatory compliance and operational requirements.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-135 flex-none lg:w-180">
              <Image
                src={imageLaptop}
                alt="Enterprise Web3 ML Architecture"
                sizes="(min-width: 1024px) 41rem, 31rem"
                className="justify-center lg:justify-end"
              />
            </FadeIn>
          </div>
          <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-132 lg:pl-4">
            <ListItem title="Intelligent Smart Contracts">
              Self-executing contracts with embedded neural networks that adapt to changing business 
              conditions while maintaining regulatory compliance.
            </ListItem>
            <ListItem title="Distributed ML Processing">
              Federated learning across blockchain nodes enables secure, scalable AI processing 
              without compromising sensitive enterprise data.
            </ListItem>
            <ListItem title="Real-time Analytics Engine">
              Advanced blockchain analytics with ML-powered insights for operational optimization, 
              risk assessment, and strategic decision-making.
            </ListItem>
            <ListItem title="Enterprise Security Framework">
              Multi-layered security architecture combining cryptographic protocols, AI-powered 
              threat detection, and Australian cybersecurity standards compliance.
            </ListItem>
          </List>
        </div>
      </Container>
    </>
  );
}

function CaseStudyHighlights() {
  const caseStudies = [
    {
      title: "Mining Giant Operational Transformation",
      sector: "Resources & Mining",
      impact: "40% reduction in operational costs",
      description: "Implemented intelligent supply chain blockchain with ML-powered predictive maintenance, reducing downtime and optimizing resource allocation across 12 Australian mining sites."
    },
    {
      title: "National Bank Risk Management",
      sector: "Financial Services", 
      impact: "99.7% fraud detection accuracy",
      description: "Deployed decentralized AI risk assessment system processing 2M+ daily transactions while maintaining full regulatory compliance with AUSTRAC requirements."
    },
    {
      title: "Agricultural Export Traceability",
      sector: "Agriculture & Food",
      impact: "100% supply chain transparency",
      description: "Created end-to-end traceability system for premium Australian beef exports, ensuring quality standards and enabling premium pricing in international markets."
    }
  ];

  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <SectionIntro
        eyebrow="Success stories"
        title="Proven enterprise transformations across Australia"
      >
        <p>
          Our Web3 ML solutions have transformed operations for leading Australian enterprises, 
          delivering measurable results in efficiency, security, and innovation.
        </p>
      </SectionIntro>
      
      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {caseStudies.map((study, index) => (
          <FadeIn key={index} className="flex">
            <article className="relative flex w-full flex-col rounded-3xl bg-neutral-50 p-6 ring-1 ring-neutral-950/5 transition hover:bg-neutral-100 sm:p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <span className="text-sm font-medium text-neutral-600">{study.sector}</span>
              </div>
              
              <h3 className="font-display text-xl font-semibold text-neutral-950 mb-2">
                {study.title}
              </h3>
              
              <div className="mb-4 rounded-lg bg-green-50 px-3 py-2">
                <p className="text-sm font-semibold text-green-800">{study.impact}</p>
              </div>
              
              <p className="text-base text-neutral-600 flex-grow">{study.description}</p>
            </article>
          </FadeIn>
        ))}
      </div>
    </Container>
  );
}

export const metadata: Metadata = {
  title: 'Enterprise Solutions',  
  description:
    'Transform your enterprise with Web3 ML solutions engineered for Australian business. Intelligent blockchain systems for mining, finance, government, and agriculture.',
};

export default function Enterprise() {
  return (
    <RootLayout>
      <PageIntro eyebrow="Enterprise solutions" title="Web3 ML systems engineered for Australian enterprise">
        <p>
          We specialize in deploying intelligent blockchain solutions that transform how Australia's 
          leading enterprises operate, ensuring regulatory compliance while driving innovation and efficiency.
        </p>
        <div className="mt-10 max-w-2xl space-y-6 text-base">
          <p>
            Our Web3 ML laboratory has successfully deployed enterprise solutions across mining, 
            finance, government, and agriculture sectors. Each system is custom-engineered to meet 
            Australian regulatory requirements and operational conditions.
          </p>
          <p>
            From intelligent smart contracts that adapt to changing market conditions to decentralized 
            AI networks that process sensitive data securely, our solutions deliver measurable results 
            while maintaining the highest standards of security and compliance.
          </p>
        </div>
      </PageIntro>

      <Container className="mt-16">
        <StatList>
          <StatListItem value="$2.4B" label="Enterprise value generated" />
          <StatListItem value="127" label="Active enterprise deployments" />
          <StatListItem value="99.9%" label="System uptime guarantee" />
        </StatList>
      </Container>

      <EnterpriseSolutions />

      <TechnicalArchitecture />

      <CaseStudyHighlights />

      <Web3MLFeaturesSection />

      <ContactSection />
    </RootLayout>
  );
}