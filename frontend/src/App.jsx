import { useCallback, useState } from 'react';
import { useRoute } from './lib/router';
import { useTheme } from './lib/theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatDrawer from './components/ChatDrawer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Journey from './pages/Journey';
import Background from './pages/Background';
import Contact from './pages/Contact';
import CaseStudy from './pages/CaseStudy';
import Placeholder from './pages/Placeholder';

const PAGES = {
  '/': Home,
  '/about': About,
  '/projects': Projects,
  '/skills': Skills,
  '/journey': Journey,
  '/background': Background,
  '/contact': Contact,
};

export default function App() {
  const route = useRoute();
  const [theme, toggleTheme] = useTheme();
  const [chat, setChat] = useState({ open: false, prompt: null, nonce: 0 });

  const openChat = useCallback(
    (prompt) => setChat((c) => ({ open: true, prompt: prompt || null, nonce: c.nonce + 1 })),
    []
  );
  const closeChat = useCallback(() => setChat((c) => ({ ...c, open: false })), []);

  const Page = PAGES[route];
  const caseSlug = !Page && route.startsWith('/projects/') ? route.slice('/projects/'.length) : null;

  return (
    <>
      <Navbar route={caseSlug ? '/projects' : route} theme={theme} onToggleTheme={toggleTheme} onOpenChat={() => openChat()} />
      <main>
        {Page ? <Page onOpenChat={openChat} /> : caseSlug ? <CaseStudy slug={caseSlug} /> : <Placeholder route={route} />}
      </main>
      <Footer />
      <ChatDrawer open={chat.open} prompt={chat.prompt} nonce={chat.nonce} onClose={closeChat} />
    </>
  );
}
