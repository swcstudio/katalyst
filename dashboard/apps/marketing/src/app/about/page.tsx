import type { Metadata } from 'next';
import Image from 'next/image';

import { Border } from '@/components/Border';
import { ContactSection } from '@/components/ContactSection';
import { Container } from '@/components/Container';
import { FadeIn, FadeInStagger } from '@/components/FadeIn';
import { GridList, GridListItem } from '@/components/GridList';
import { PageIntro } from '@/components/PageIntro';
import { PageLinks } from '@/components/PageLinks';
import { RootLayout } from '@/components/RootLayout';
import { SectionIntro } from '@/components/SectionIntro';
import { StatList, StatListItem } from '@/components/StatList';
import imageAngelaFisher from '@/images/team/angela-fisher.jpg';
import imageBenjaminRussel from '@/images/team/benjamin-russel.jpg';
import imageBlakeReid from '@/images/team/blake-reid.jpg';
import imageChelseaHagon from '@/images/team/chelsea-hagon.jpg';
import imageDriesVincent from '@/images/team/dries-vincent.jpg';
import imageEmmaDorsey from '@/images/team/emma-dorsey.jpg';
import imageJeffreyWebb from '@/images/team/jeffrey-webb.jpg';
import imageKathrynMurphy from '@/images/team/kathryn-murphy.jpg';
import imageLeonardKrasner from '@/images/team/leonard-krasner.jpg';
import imageLeslieAlexander from '@/images/team/leslie-alexander.jpg';
import imageMichaelFoster from '@/images/team/michael-foster.jpg';
import imageWhitneyFrancis from '@/images/team/whitney-francis.jpg';
import { loadArticles } from '@/lib/mdx';

function Culture() {
  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-24 sm:mt-32 lg:mt-40 lg:py-32">
      <SectionIntro
        eyebrow="Research philosophy"
        title="Engineering intelligence through collaborative research."
        invert
      >
        <p>Our laboratory culture combines rigorous scientific methodology with pragmatic enterprise engineering.</p>
      </SectionIntro>
      <Container className="mt-16">
        <GridList>
          <GridListItem title="Scientific rigor" invert>
            Every Web3 ML system we develop undergoes extensive testing, peer review, and validation 
            before deployment to ensure maximum reliability and security.
          </GridListItem>
          <GridListItem title="Open collaboration" invert>
            We actively collaborate with Australia's leading universities, research institutions, and 
            enterprises to advance the entire Web3 ML ecosystem.
          </GridListItem>
          <GridListItem title="Australian engineering" invert>
            Our solutions are purpose-built for Australian enterprises, considering local regulations, 
            environmental factors, and unique operational requirements.
          </GridListItem>
        </GridList>
      </Container>
    </div>
  );
}

const team = [
  {
    title: 'Research Leadership',
    people: [
      {
        name: 'Leslie Alexander',
        role: 'Lab Director / Chief Scientist',
        image: { src: imageLeslieAlexander },
      },
      {
        name: 'Michael Foster',
        role: 'Chief Technology Officer',
        image: { src: imageMichaelFoster },
      },
      {
        name: 'Dries Vincent',
        role: 'Enterprise Partnerships Director',
        image: { src: imageDriesVincent },
      },
    ],
  },
  {
    title: 'Research & Engineering Team',
    people: [
      {
        name: 'Chelsea Hagon',
        role: 'Senior Blockchain Engineer',
        image: { src: imageChelseaHagon },
      },
      {
        name: 'Emma Dorsey',
        role: 'ML Research Scientist',
        image: { src: imageEmmaDorsey },
      },
      {
        name: 'Leonard Krasner',
        role: 'Cryptography Specialist',
        image: { src: imageLeonardKrasner },
      },
      {
        name: 'Blake Reid',
        role: 'Smart Contract Developer',
        image: { src: imageBlakeReid },
      },
      {
        name: 'Kathryn Murphy',
        role: 'Enterprise Solutions Architect',
        image: { src: imageKathrynMurphy },
      },
      {
        name: 'Whitney Francis',
        role: 'Web3 Data Analyst',
        image: { src: imageWhitneyFrancis },
      },
      {
        name: 'Jeffrey Webb',
        role: 'Distributed Systems Engineer',
        image: { src: imageJeffreyWebb },
      },
      {
        name: 'Benjamin Russel',
        role: 'AI Infrastructure Engineer',
        image: { src: imageBenjaminRussel },
      },
      {
        name: 'Angela Fisher',
        role: 'Blockchain Interface Developer',
        image: { src: imageAngelaFisher },
      },
    ],
  },
];

function Team() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <div className="space-y-24">
        {team.map((group) => (
          <FadeInStagger key={group.title}>
            <Border as={FadeIn} />
            <div className="grid grid-cols-1 gap-6 pt-12 sm:pt-16 lg:grid-cols-4 xl:gap-8">
              <FadeIn>
                <h2 className="font-display text-2xl font-semibold text-neutral-950">
                  {group.title}
                </h2>
              </FadeIn>
              <div className="lg:col-span-3">
                <ul
                  role="list"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
                >
                  {group.people.map((person) => (
                    <li key={person.name}>
                      <FadeIn>
                        <div className="group relative overflow-hidden rounded-3xl bg-neutral-100">
                          <Image
                            alt=""
                            {...person.image}
                            className="h-96 w-full object-cover grayscale transition duration-500 motion-safe:group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black to-black/0 to-40% p-6">
                            <p className="font-display text-base/6 font-semibold tracking-wide text-white">
                              {person.name}
                            </p>
                            <p className="mt-2 text-sm text-white">{person.role}</p>
                          </div>
                        </div>
                      </FadeIn>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeInStagger>
        ))}
      </div>
    </Container>
  );
}

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Australia\'s premier Web3 ML laboratory. We pioneer intelligent blockchain solutions through advanced research, technical partnerships, and enterprise engineering excellence.',
};

export default async function About() {
  const blogArticles = (await loadArticles()).slice(0, 2);

  return (
    <RootLayout>
      <PageIntro eyebrow="About us" title="Pioneering Australia's Web3 ML future">
        <p>
          We are Australia's premier Web3 ML laboratory, engineering intelligent blockchain solutions 
          that transform how enterprises operate in the decentralized economy.
        </p>
        <div className="mt-10 max-w-2xl space-y-6 text-base">
          <p>
            Spectrum Web Co Studio was founded by leading researchers who recognized that Australia needed 
            a specialized laboratory combining artificial intelligence with blockchain technology. We bridge the 
            gap between academic research and enterprise implementation, creating production-ready Web3 ML systems.
          </p>
          <p>
            Our laboratory operates at the intersection of machine learning, cryptography, and distributed systems. 
            We collaborate with Australia's top universities, government bodies, and enterprises to solve complex 
            challenges in mining, finance, and national infrastructure through intelligent decentralized solutions.
          </p>
          <p>
            What sets us apart is our commitment to engineering for Australian conditions - from regulatory compliance 
            to environmental considerations. Every system we build is designed to serve Australia's unique enterprise 
            needs while contributing to global Web3 ML advancement.
          </p>
        </div>
      </PageIntro>
      <Container className="mt-16">
        <StatList>
          <StatListItem value="12" label="Enterprise partnerships" />
          <StatListItem value="47" label="Web3 ML systems deployed" />
          <StatListItem value="$180M" label="Enterprise value generated" />
        </StatList>
      </Container>

      <Culture />

      <Team />

      <PageLinks
        className="mt-24 sm:mt-32 lg:mt-40"
        title="Research publications"
        intro="Stay current with our latest Web3 ML research, enterprise case studies, and technical insights. Our laboratory publishes findings on intelligent blockchain systems, enterprise applications, and Australian innovation."
        pages={blogArticles}
      />

      <ContactSection />
    </RootLayout>
  );
}
