import type { Metadata } from 'next';

import { Blockquote } from '@/components/Blockquote';
import { ContactSection } from '@/components/ContactSection';
import { Container } from '@/components/Container';
import { FadeIn } from '@/components/FadeIn';
import { GridList, GridListItem } from '@/components/GridList';
import { GridPattern } from '@/components/GridPattern';
import { List, ListItem } from '@/components/List';
import { PageIntro } from '@/components/PageIntro';
import { RootLayout } from '@/components/RootLayout';
import { SectionIntro } from '@/components/SectionIntro';
import { StylizedImage } from '@/components/StylizedImage';
import { TagList, TagListItem } from '@/components/TagList';
import imageLaptop from '@/images/laptop.jpg';
import imageMeeting from '@/images/meeting.jpg';
import imageWhiteboard from '@/images/whiteboard.jpg';

function Section({
  title,
  image,
  children,
}: {
  title: string;
  image: React.ComponentPropsWithoutRef<typeof StylizedImage>;
  children: React.ReactNode;
}) {
  return (
    <Container className="group/section [counter-increment:section]">
      <div className="lg:flex lg:items-center lg:justify-end lg:gap-x-8 lg:group-even/section:justify-start xl:gap-x-20">
        <div className="flex justify-center">
          <FadeIn className="w-135 flex-none lg:w-180">
            <StylizedImage
              {...image}
              sizes="(min-width: 1024px) 41rem, 31rem"
              className="justify-center lg:justify-end lg:group-even/section:justify-start"
            />
          </FadeIn>
        </div>
        <div className="mt-12 lg:mt-0 lg:w-148 lg:flex-none lg:group-even/section:order-first">
          <FadeIn>
            <div
              className="font-display text-base font-semibold before:text-neutral-300 before:content-['/_'] after:text-neutral-950 after:content-[counter(section,decimal-leading-zero)]"
              aria-hidden="true"
            />
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
              {title}
            </h2>
            <div className="mt-6">{children}</div>
          </FadeIn>
        </div>
      </div>
    </Container>
  );
}

function Discover() {
  return (
    <Section title="Research & Analysis" image={{ src: imageWhiteboard }}>
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          Our research team conducts comprehensive analysis of your enterprise's{' '}
          <strong className="font-semibold text-neutral-950">operational requirements</strong>, 
          regulatory constraints, and strategic objectives. We embed our researchers within your 
          operations to understand the unique challenges facing Australian enterprises.
        </p>
        <p>
          Through advanced data modeling and machine learning analysis, we identify optimal 
          integration points for Web3 ML solutions. Our cryptographic specialists assess your{' '}
          <strong className="font-semibold text-neutral-950">security infrastructure</strong> while 
          our blockchain architects map out existing systems and identify transformation opportunities.
        </p>
        <p>
          The research phase concludes with a detailed technical roadmap, complete regulatory 
          compliance framework, and comprehensive{' '}
          <strong className="font-semibold text-neutral-950">implementation strategy</strong> 
          tailored to your specific market sector.
        </p>
      </div>

      <h3 className="mt-12 font-display text-base font-semibold text-neutral-950">
        Included in this phase
      </h3>
      <TagList className="mt-4">
        <TagListItem>Enterprise architecture analysis</TagListItem>
        <TagListItem>Regulatory compliance assessment</TagListItem>
        <TagListItem>Blockchain integration feasibility</TagListItem>
        <TagListItem>ML model requirement specification</TagListItem>
        <TagListItem>Security infrastructure audit</TagListItem>
        <TagListItem>Market-specific customization plan</TagListItem>
      </TagList>
    </Section>
  );
}

function Build() {
  return (
    <Section title="Development & Engineering" image={{ src: imageLaptop, shape: 1 }}>
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          Our engineering teams develop custom Web3 ML solutions using our proprietary laboratory 
          frameworks. Each system is built from the ground up to meet Australian regulatory requirements 
          while leveraging cutting-edge blockchain and machine learning technologies.
        </p>
        <p>
          Every enterprise client is assigned a dedicated{' '}
          <strong className="font-semibold text-neutral-950">research liaison</strong> who maintains 
          direct communication with your technical teams. Our development process follows agile 
          methodologies with continuous integration and rigorous security testing at every milestone.
        </p>
        <p>
          Throughout development, we provide weekly technical briefings and live demonstrations of 
          system capabilities. Our transparent development process ensures you understand exactly 
          how your Web3 ML infrastructure is being engineered for maximum{' '}
          <strong className="font-semibold text-neutral-950">reliability and performance</strong>.
        </p>
      </div>

      <Blockquote author={{ name: 'Mining Operations Director', role: 'Major Australian Resources Company' }} className="mt-12">
        The engineering team provided exceptional transparency throughout development. Their weekly 
        technical briefings helped our team understand exactly how the Web3 ML system would integrate 
        with our existing operations.
      </Blockquote>
    </Section>
  );
}

function Deliver() {
  return (
    <Section title="Deployment & Optimization" image={{ src: imageMeeting, shape: 2 }}>
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          Our deployment phase follows enterprise-grade standards with comprehensive testing across 
          development, staging, and production environments. We conduct extensive{' '}
          <strong className="font-semibold text-neutral-950">load testing</strong> and security 
          audits before any system goes live in Australian enterprise environments.
        </p>
        <p>
          Each Web3 ML system deployment includes a dedicated war room staffed by our senior engineers 
          and blockchain specialists. We monitor system{' '}
          <strong className="font-semibold text-neural-950">performance</strong> in real-time during 
          the initial launch period, ensuring seamless integration with your existing infrastructure.
        </p>
        <p>
          Post-deployment optimization continues for 90 days, with our team fine-tuning ML models based 
          on real operational data. All systems are delivered{' '}
          <strong className="font-semibold text-neutral-950">fully documented</strong> with comprehensive 
          training programs for your technical teams and ongoing{' '}
          <strong className="font-semibold text-neutral-950">research support</strong>.
        </p>
      </div>

      <h3 className="mt-12 font-display text-base font-semibold text-neutral-950">
        Included in this phase
      </h3>
      <List className="mt-8">
        <ListItem title="Enterprise Testing">
          Comprehensive testing including load, security, and regulatory compliance validation 
          across multiple Australian enterprise environments.
        </ListItem>
        <ListItem title="High-Availability Infrastructure">
          Enterprise-grade cloud infrastructure with 99.9% uptime SLA, disaster recovery, 
          and Australian data sovereignty compliance.
        </ListItem>
        <ListItem title="Ongoing Research Partnership">
          Continuous system optimization, ML model improvements, and access to our latest 
          Web3 ML research developments through long-term partnership agreements.
        </ListItem>
      </List>
    </Section>
  );
}

function Values() {
  return (
    <div className="relative mt-24 pt-24 sm:mt-32 sm:pt-32 lg:mt-40 lg:pt-40">
      <div className="absolute inset-x-0 top-0 -z-10 h-[884px] overflow-hidden rounded-t-4xl bg-linear-to-b from-neutral-50">
        <GridPattern
          className="absolute inset-0 h-full w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-neutral-100 stroke-neutral-950/5"
          yOffset={-270}
        />
      </div>

      <SectionIntro eyebrow="Target markets" title="Specialized Web3 ML solutions for Australian enterprise sectors">
        <p>
          Our laboratory specializes in four key Australian market sectors, developing targeted Web3 ML 
          solutions that address the unique challenges, regulatory requirements, and operational demands 
          of each industry.
        </p>
      </SectionIntro>

      <Container className="mt-24">
        <GridList>
          <GridListItem title="Mining & Resources">
            Intelligent supply chain optimization, predictive maintenance systems, and environmental 
            compliance monitoring using blockchain-verified sensor data and ML-powered analytics.
          </GridListItem>
          <GridListItem title="Financial Services">
            Regulatory-compliant decentralized risk assessment, fraud detection systems, and 
            automated compliance reporting that meets AUSTRAC and APRA requirements.
          </GridListItem>
          <GridListItem title="Government & Infrastructure">
            Secure identity management, inter-agency data sharing platforms, and citizen service 
            optimization using privacy-preserving ML and government-grade blockchain security.
          </GridListItem>
          <GridListItem title="Agriculture & Food Safety">
            End-to-end traceability systems, quality assurance automation, and export compliance 
            verification using IoT integration and blockchain-verified supply chain data.
          </GridListItem>
          <GridListItem title="Energy & Utilities">
            Smart grid optimization, renewable energy trading platforms, and carbon credit tracking 
            systems using distributed ML and blockchain-based energy marketplaces.
          </GridListItem>
          <GridListItem title="Healthcare Technology">
            Privacy-preserving patient data sharing, pharmaceutical supply chain verification, and 
            clinical research collaboration using federated learning and healthcare blockchain protocols.
          </GridListItem>
        </GridList>
      </Container>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Our Research Process',
  description:
    'Discover how Australia\'s premier Web3 ML laboratory engineers intelligent blockchain solutions through rigorous research, development, and deployment methodology.',
};

export default function Process() {
  return (
    <RootLayout>
      <PageIntro eyebrow="Research methodology" title="Engineering Web3 ML solutions for Australian enterprise">
        <p>
          Our laboratory follows a rigorous scientific methodology to engineer Web3 ML solutions that transform 
          Australian enterprises. We combine advanced research with pragmatic implementation across four key target markets.
        </p>
      </PageIntro>

      <div className="mt-24 space-y-24 [counter-reset:section] sm:mt-32 sm:space-y-32 lg:mt-40 lg:space-y-40">
        <Discover />
        <Build />
        <Deliver />
      </div>

      <Values />

      <ContactSection />
    </RootLayout>
  );
}
