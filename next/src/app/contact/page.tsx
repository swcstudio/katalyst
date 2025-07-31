import { useConfig, useHydration, useServerAction } from '@swcstudio/shared';
import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import { Border } from '@/components/Border';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { FadeIn } from '@/components/FadeIn';
import { Offices } from '@/components/Offices';
import { PageIntro } from '@/components/PageIntro';
import { RootLayout } from '@/components/RootLayout';
import { SocialMedia } from '@/components/SocialMedia';

function TextInput({
  label,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & { label: string }) {
  const {
    execute: submitForm,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useServerAction('data_transform');
  const { data: formId, isHydrated } = useHydration('contact-form-id', React.useId(), {
    enableStreaming: false,
  });

  if (!isHydrated || !formId) {
    return <div className="animate-pulse">Loading form...</div>;
  }

  const id = formId;

  return (
    <div className="group relative z-0 transition-all focus-within:z-10">
      <input
        type="text"
        id={id}
        {...props}
        placeholder=" "
        className="peer block w-full border border-neutral-300 bg-transparent px-6 pt-12 pb-4 text-base/6 text-neutral-950 ring-4 ring-transparent transition group-first:rounded-t-2xl group-last:rounded-b-2xl focus:border-neutral-950 focus:ring-neutral-950/5 focus:outline-hidden"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-1/2 left-6 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-neutral-950 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950"
      >
        {label}
      </label>
    </div>
  );
}

function RadioInput({
  label,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & { label: string }) {
  return (
    <label className="flex gap-x-3">
      <input
        type="radio"
        {...props}
        className="h-6 w-6 flex-none appearance-none rounded-full border border-neutral-950/20 outline-hidden checked:border-[0.5rem] checked:border-neutral-950 focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
      />
      <span className="text-base/6 text-neutral-950">{label}</span>
    </label>
  );
}

function ContactForm() {
  return (
    <FadeIn className="lg:order-last">
      <form>
        <h2 className="font-display text-base font-semibold text-neutral-950">Enterprise Web3 ML Partnership</h2>
        <div className="isolate mt-6 -space-y-px rounded-2xl bg-white/50">
          <TextInput label="Full Name" name="name" autoComplete="name" />
          <TextInput label="Enterprise Email" type="email" name="email" autoComplete="email" />
          <TextInput label="Company / Organization" name="company" autoComplete="organization" />
          <TextInput label="Direct Phone" type="tel" name="phone" autoComplete="tel" />
          <TextInput label="Project Requirements" name="message" />
          <div className="border border-neutral-300 px-6 py-8 first:rounded-t-2xl last:rounded-b-2xl">
            <fieldset>
              <legend className="text-base/6 text-neutral-500">Enterprise Investment Range</legend>
              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <RadioInput label="$250K – $500K" name="budget" value="250" />
                <RadioInput label="$500K – $1M" name="budget" value="500" />
                <RadioInput label="$1M – $5M" name="budget" value="1000" />
                <RadioInput label="$5M+ Multi-year contract" name="budget" value="5000" />
              </div>
            </fieldset>
          </div>
          <div className="border border-neutral-300 px-6 py-8 first:rounded-t-2xl last:rounded-b-2xl">
            <fieldset>
              <legend className="text-base/6 text-neutral-500">Primary Use Case</legend>
              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <RadioInput label="Smart Contract ML" name="usecase" value="smart-contracts" />
                <RadioInput label="Blockchain Analytics" name="usecase" value="analytics" />
                <RadioInput label="Decentralized AI" name="usecase" value="decentralized-ai" />
                <RadioInput label="Enterprise Infrastructure" name="usecase" value="infrastructure" />
              </div>
            </fieldset>
          </div>
        </div>
        <Button type="submit" className="mt-10">
          Begin Enterprise Partnership
        </Button>
      </form>
    </FadeIn>
  );
}

function ContactDetails() {
  return (
    <FadeIn>
      <h2 className="font-display text-base font-semibold text-neutral-950">Research facilities</h2>
      <p className="mt-6 text-base text-neutral-600">
        Our Web3 ML laboratory operates from secure research facilities across Australia, 
        designed for advanced blockchain development and enterprise collaboration.
      </p>

      <Offices className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2" />

      <Border className="mt-16 pt-16">
        <h2 className="font-display text-base font-semibold text-neutral-950">Direct contact</h2>
        <dl className="mt-6 grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
          {[
            ['Enterprise partnerships', 'enterprise@spectrumwebco.com.au'],
            ['Research collaboration', 'research@spectrumwebco.com.au'],
            ['Media & press', 'media@spectrumwebco.com.au'],
            ['Technical inquiries', 'technical@spectrumwebco.com.au'],
          ].map(([label, email]) => (
            <div key={email}>
              <dt className="font-semibold text-neutral-950">{label}</dt>
              <dd>
                <Link href={`mailto:${email}`} className="text-neutral-600 hover:text-neutral-950">
                  {email}
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </Border>

      <Border className="mt-16 pt-16">
        <h2 className="font-display text-base font-semibold text-neutral-950">Research updates</h2>
        <SocialMedia className="mt-6" />
      </Border>
    </FadeIn>
  );
}

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Ready to transform your enterprise with Web3 ML solutions? Connect with Australia\'s premier blockchain laboratory.',
};

export default function Contact() {
  return (
    <RootLayout>
      <PageIntro eyebrow="Contact us" title="Ready to engineer your Web3 ML future?">
        <p>Connect with Australia's premier Web3 ML laboratory to discuss how intelligent blockchain solutions can transform your enterprise operations.</p>
      </PageIntro>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-2">
          <ContactForm />
          <ContactDetails />
        </div>
      </Container>
    </RootLayout>
  );
}
