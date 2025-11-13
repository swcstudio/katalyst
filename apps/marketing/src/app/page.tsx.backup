import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { ContactSection } from '@/components/ContactSection';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { List, ListItem } from '@/components/List';
import { RootLayout } from '@/components/RootLayout';
import { SectionIntro } from '@/components/SectionIntro';
import { StylizedImage } from '@/components/StylizedImage';
import { Testimonial } from '@/components/Testimonial';
import { ModernHeroWithGradients } from '@/components/blocks/hero-section-modern-with-gradients';
import { Web3MLFeaturesSection } from '@/components/blocks/web3-ml-features-section';
import logoBrightPath from '@/images/clients/bright-path/logo-light.svg';
import logoFamilyFund from '@/images/clients/family-fund/logo-light.svg';
import logoGreenLife from '@/images/clients/green-life/logo-light.svg';
import logoHomeWork from '@/images/clients/home-work/logo-light.svg';
import logoMailSmirk from '@/images/clients/mail-smirk/logo-light.svg';
import logoNorthAdventures from '@/images/clients/north-adventures/logo-light.svg';
import logoPhobiaDark from '@/images/clients/phobia/logo-dark.svg';
import logoPhobiaLight from '@/images/clients/phobia/logo-light.svg';
import logoUnseal from '@/images/clients/unseal/logo-light.svg';
import imageLaptop from '@/images/laptop.jpg';
import { type CaseStudy, type MDXEntry, loadCaseStudies } from '@/lib/mdx';

const clients = [
  ['Enterprise Partners', logoPhobiaLight],
  ['Financial Tech', logoFamilyFund],
  ['Blockchain Networks', logoUnseal],
  ['AI Research Labs', logoMailSmirk],
  ['Government Bodies', logoHomeWork],
  ['Mining Corps', logoGreenLife],
  ['Tech Accelerators', logoBrightPath],
  ['Innovation Hubs', logoNorthAdventures],
];

function Clients() {
  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-20 sm:mt-32 sm:py-32 lg:mt-56">
      <Container>
        <FadeIn className="flex items-center gap-x-8">
          <h2 className="text-center font-display text-sm font-semibold tracking-wider text-white sm:text-left">
            Trusted by Australia's leading Web3 & AI enterprises
          </h2>
          <div className="h-px flex-auto bg-neutral-800" />
        </FadeIn>
        <FadeInStagger faster>
          <ul role="list" className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {clients.map(([client, logo]) => (
              <li key={client}>
                <FadeIn>
                  <Image src={logo} alt={client} unoptimized />
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
      </Container>
    </div>
  );
}

function CaseStudies({
  caseStudies,
}: {
  caseStudies: Array<MDXEntry<CaseStudy>>;
}) {
  return (
    <>
      <SectionIntro
        title="Pioneering Australia's Web3 ML revolution"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          As Australia's premier Web3 ML lab, we engineer enterprise solutions that merge artificial intelligence
          with blockchain technology. Our innovations power the next generation of decentralized intelligent systems
          across mining, finance, and government sectors.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <FadeIn key={caseStudy.href} className="flex">
              <article className="relative flex w-full flex-col rounded-3xl p-6 ring-1 ring-neutral-950/5 transition hover:bg-neutral-50 sm:p-8">
                <h3>
                  <Link href={caseStudy.href}>
                    <span className="absolute inset-0 rounded-3xl" />
                    <Image
                      src={caseStudy.logo}
                      alt={caseStudy.client}
                      className="h-16 w-16"
                      unoptimized
                    />
                  </Link>
                </h3>
                <p className="mt-6 flex gap-x-2 text-sm text-neutral-950">
                  <time dateTime={caseStudy.date.split('-')[0]} className="font-semibold">
                    {caseStudy.date.split('-')[0]}
                  </time>
                  <span className="text-neutral-300" aria-hidden="true">
                    /
                  </span>
                  <span>Case study</span>
                </p>
                <p className="mt-6 font-display text-2xl font-semibold text-neutral-950">
                  {caseStudy.title}
                </p>
                <p className="mt-4 text-base text-neutral-600">{caseStudy.description}</p>
              </article>
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </>
  );
}

function Services() {
  return (
    <>
      <SectionIntro
        eyebrow="Core Technologies"
        title="We engineer Web3 ML systems that transform enterprise operations."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          Our research lab combines advanced machine learning with blockchain infrastructure to create 
          intelligent decentralized systems that solve Australia's most complex enterprise challenges.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-135 flex-none lg:w-180">
              <StylizedImage
                src={imageLaptop}
                sizes="(min-width: 1024px) 41rem, 31rem"
                className="justify-center lg:justify-end"
              />
            </FadeIn>
          </div>
          <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-132 lg:pl-4">
            <ListItem title="Decentralized AI Systems">
              We architect intelligent blockchain networks that distribute machine learning computations
              across secure, trustless environments for enterprise-grade performance.
            </ListItem>
            <ListItem title="Smart Contract ML">
              Our proprietary frameworks integrate neural networks directly into smart contracts,
              enabling autonomous decision-making within decentralized applications.
            </ListItem>
            <ListItem title="Web3 Data Analytics">
              Advanced analytics platforms that process blockchain data through ML pipelines,
              delivering actionable insights for mining, finance, and regulatory compliance.
            </ListItem>
            <ListItem title="Enterprise Blockchain Solutions">
              Custom Web3 infrastructure built for Australian enterprises, featuring ML-powered
              optimization, security protocols, and regulatory compliance frameworks.
            </ListItem>
          </List>
        </div>
      </Container>
    </>
  );
}

export const metadata: Metadata = {
  description:
    'Australia\'s premier Web3 ML laboratory engineering intelligent blockchain solutions for enterprise. We merge artificial intelligence with decentralized systems.',
};

export default async function Home() {
  let caseStudies: Array<MDXEntry<CaseStudy>> = [];

  try {
    caseStudies = (await loadCaseStudies()).slice(0, 3);
  } catch (error) {
    console.log('Case studies not yet available:', error);
    // Fallback to empty array for initial setup
    caseStudies = [];
  }

  return (
    <RootLayout>
      <Container className="mt-24 sm:mt-32 md:mt-56">
        <FadeIn className="max-w-3xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-7xl">
            Australia's premier Web3 ML laboratory.
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            We are Spectrum Web Co Studio, pioneering the fusion of artificial intelligence and blockchain technology. 
            We engineer intelligent decentralized systems that transform enterprise operations across Australia.
          </p>
        </FadeIn>
      </Container>

      <Clients />

      {caseStudies.length > 0 && <CaseStudies caseStudies={caseStudies} />}

      <Testimonial
        className="mt-24 sm:mt-32 lg:mt-40"
        client={{ name: 'Enterprise Client', logo: logoPhobiaDark }}
      >
        Spectrum Web Co Studio revolutionized our operations with their Web3 ML solutions. Their intelligent 
        blockchain infrastructure reduced our processing costs by 40% while enhancing security and transparency 
        across our entire supply chain.
      </Testimonial>

      <Web3MLFeaturesSection />

      <Services />

      <ContactSection />
    </RootLayout>
  );
}
