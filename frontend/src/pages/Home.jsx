import Hero from '../components/Hero';
import WhatIBuild from '../components/WhatIBuild';
import FeaturedProjects from '../components/FeaturedProjects';
import EngineeringSnapshot from '../components/EngineeringSnapshot';
import HowIBuild from '../components/HowIBuild';
import AssistantSection from '../components/AssistantSection';
import CTA from '../components/CTA';

export default function Home({ onOpenChat }) {
  return (
    <>
      <Hero />
      <WhatIBuild />
      <FeaturedProjects />
      <EngineeringSnapshot />
      <HowIBuild />
      <AssistantSection onOpenChat={onOpenChat} />
      <CTA />
    </>
  );
}
