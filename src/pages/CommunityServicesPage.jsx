import { startTransition, useDeferredValue, useState } from 'react';
import CommunityBottomNav from '../components/community/CommunityBottomNav';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityRightSidebar from '../components/community/CommunityRightSidebar';
import CommunitySidebar from '../components/community/CommunitySidebar';
import PostModal from '../components/community/PostModal';
import SectionHeader from '../components/community/SectionHeader';
import SiteFooter from '../components/SiteFooter';
import SlidePanel from '../components/community/SlidePanel';
import ToastStack from '../components/community/ToastStack';
import { CommunityDashboardContext } from '../context/CommunityDashboardContext';
import communityHeroImage from '../assets/community-hero.jpg';
import {
  connectBanner,
  eventItems,
  featuredItems,
  healthItems,
  heroMetrics,
  howItWorksItems,
  moreServiceCategories,
  notificationItems,
  placeItems,
  quickActions,
  recommendedItems,
  recommendationTabs,
  serviceCategories,
  supportItems,
} from '../data/communityDashboardData';

const filterItems = (items, query) => {
  if (!query) {
    return items;
  }

  return items.filter((item) =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(query),
  );
};

const emptyCardClass =
  'col-span-full rounded-[28px] border border-dashed border-slate-200 bg-white/80 px-5 py-10 text-center text-sm leading-6 text-slate-500';

const CommunityServicesPage = () => {
  const [searchQuery, setSearchQueryValue] = useState('');
  const [activeNav, setActiveNav] = useState('Home');
  const [activeMobileTab, setActiveMobileTab] = useState('home');
  const [recommendationGroup, setRecommendationGroup] = useState('services');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [toasts, setToasts] = useState([]);

  const deferredSearch = useDeferredValue(searchQuery);
  const normalizedQuery = deferredSearch.trim().toLowerCase();

  const showToast = (title, message) => {
    const id = Date.now() + Math.random();

    setToasts((current) => [...current, { id, title, message }].slice(-3));

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const scrollToTarget = (target) => {
    const element = document.getElementById(target);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const setSearchQuery = (value) => {
    startTransition(() => {
      setSearchQueryValue(value);

      const lowered = value.toLowerCase();

      if (lowered.includes('event') || lowered.includes('potluck') || lowered.includes('sports')) {
        setRecommendationGroup('events');
        return;
      }

      if (
        lowered.includes('health') ||
        lowered.includes('wellness') ||
        lowered.includes('yoga') ||
        lowered.includes('therapy') ||
        lowered.includes('doctor') ||
        lowered.includes('dentist') ||
        lowered.includes('clinic') ||
        lowered.includes('appointment')
      ) {
        setRecommendationGroup('health');
        return;
      }

      if (lowered.includes('help') || lowered.includes('volunteer') || lowered.includes('ride')) {
        setRecommendationGroup('support');
        return;
      }

      if (lowered.includes('match') || lowered.includes('connect') || lowered.includes('profile')) {
        setRecommendationGroup('connect');
        return;
      }

      if (lowered) {
        setRecommendationGroup('services');
      }
    });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    showToast(
      'Search updated',
      normalizedQuery ? `Showing dashboard matches for "${normalizedQuery}".` : 'Showing the full community dashboard.',
    );
  };

  const openPostModal = () => {
    setActivePanel(null);
    setIsPostModalOpen(true);
  };

  const closePostModal = () => setIsPostModalOpen(false);

  const openPanel = (panelType) => {
    setIsPostModalOpen(false);
    setActivePanel(panelType);
  };

  const closePanel = () => setActivePanel(null);

  const handleNavSelect = (item) => {
    setActiveNav(item.label);
    scrollToTarget(item.target);

    if (item.label === 'Messages') {
      showToast('Messages shortcut', 'Your recent updates are waiting in the Notifications widget.');
    }

    if (item.label === 'Saved') {
      setRecommendationGroup('services');
    }
  };

  const handleSidebarCardAction = (card, actionVariant = 'primary') => {
    if (card.kind === 'volunteer') {
      setRecommendationGroup('support');
      openPanel('offerService');
      return;
    }

    if (card.kind === 'business') {
      setRecommendationGroup('services');
      openPanel('offerService');
      return;
    }

    if (card.kind === 'app' && actionVariant === 'secondary') {
      showToast('Settings', 'App and notification settings can expand from this card next.');
      return;
    }

    showToast('App link ready', 'A mobile link can be shared from here to install Sazilo Sewa quickly.');
  };

  const handleMobileNav = (item) => {
    if (item.isPrimary) {
      openPostModal();
      return;
    }

    setActiveMobileTab(item.key);
    scrollToTarget(item.target);

    if (item.key === 'profile') {
      setRecommendationGroup('connect');
    }
  };

  const handleQuickAction = (item) => {
    setRecommendationGroup(item.group);

    if (item.action === 'scroll') {
      scrollToTarget(item.target);
      return;
    }

    openPanel(item.panelType);
  };

  const handlePlaceAction = (item) => {
    if (item.target === 'support') {
      setRecommendationGroup('support');
    }

    if (item.target === 'events') {
      setRecommendationGroup('events');
    }

    scrollToTarget(item.target);
  };

  const handleCollectionAction = (title, group) => {
    setRecommendationGroup(group);

    if (group === 'events') {
      openPanel('createEvent');
      return;
    }

    if (group === 'support') {
      openPanel('askForHelp');
      return;
    }

    if (group === 'services') {
      openPanel('bookService');
      return;
    }

    if (group === 'health') {
      openPanel('bookService');
      return;
    }

    showToast(title, 'Matchmaking and community connection flows can expand from this section next.');
    scrollToTarget('connect');
  };

  const handleConnectAction = (variant) => {
    setRecommendationGroup('connect');

    if (variant === 'primary') {
      showToast('Create profile', 'A dedicated matchmaking profile builder can plug into this banner next.');
      return;
    }

    scrollToTarget('recommended');
    showToast('Browse connections', 'Curated introductions and community-led connections are highlighted for you.');
  };

  const submitPanel = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') || 'your request';

    showToast('Saved successfully', `${title} has been shared with the community dashboard.`);
    closePanel();
  };

  const featuredResults = filterItems(featuredItems, normalizedQuery);
  const serviceResults = filterItems(serviceCategories, normalizedQuery);
  const moreServiceResults = filterItems(moreServiceCategories, normalizedQuery);
  const healthResults = filterItems(healthItems, normalizedQuery);
  const placeResults = filterItems(placeItems, normalizedQuery);
  const supportResults = filterItems(supportItems, normalizedQuery);
  const eventResults = filterItems(eventItems, normalizedQuery);
  const curatedRecommendations = filterItems(
    recommendedItems.filter((item) => item.group === recommendationGroup),
    normalizedQuery,
  );
  const fallbackRecommendations = filterItems(recommendedItems, normalizedQuery);
  const recommendationResults = (curatedRecommendations.length ? curatedRecommendations : fallbackRecommendations).slice(0, 4);

  const contextValue = {
    searchQuery,
    setSearchQuery,
    handleSearchSubmit,
    openPostModal,
    closePostModal,
    isPostModalOpen,
    openPanel,
    closePanel,
    activePanel,
    submitPanel,
    showToast,
    activeNav,
    handleNavSelect,
    handleSidebarCardAction,
    activeMobileTab,
    handleMobileNav,
    notificationCount: notificationItems.length,
  };

  return (
    <CommunityDashboardContext.Provider value={contextValue}>
      <div className="min-h-screen bg-dashboard-gradient text-slate-900">
        <CommunityHeader />

        <div className="mx-auto grid w-full max-w-[1680px] gap-6 px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)_300px] lg:pb-10">
          <CommunitySidebar />

          <div className="order-1 min-w-0 space-y-6 lg:order-2">
            <section
              id="hero"
              className="overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-700 via-brand-600 to-pink-400 p-7 text-white shadow-glass sm:p-8"
            >
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">Community dashboard</p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Welcome to Sazilo Sewa 👋</h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                    Explore trusted services, support, events, and health in one simple place.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                      type="button"
                      onClick={() => {
                        setRecommendationGroup('services');
                        scrollToTarget('services');
                      }}
                    >
                      Explore Services
                    </button>
                    <button
                      className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                      type="button"
                      onClick={() =>
                        showToast('How it works', 'Use Explore, Post, and the slide-in forms to take action without leaving the dashboard.')
                      }
                    >
                      How it Works
                    </button>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {heroMetrics.map((item) => (
                      <span key={item} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative isolate min-h-[320px] overflow-hidden rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                  <img
                    alt="Community members exploring services and support together"
                    className="absolute inset-0 h-full w-full object-cover"
                    src={communityHeroImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-950/30 via-brand-900/10 to-pink-400/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-white/5" />
                  <div className="absolute -right-10 -top-8 h-32 w-32 rounded-full bg-pink-200/25 blur-3xl" />
                  <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                  <div className="absolute left-4 top-4 rounded-[26px] bg-white/96 px-4 py-3 text-slate-900 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">Trusted providers</p>
                    <p className="mt-2 text-lg font-semibold">4.8 average rating</p>
                    <p className="mt-1 text-sm text-slate-500">Across services, support, health, and events.</p>
                  </div>

                  <div className="absolute right-5 top-24 rounded-[26px] border border-white/20 bg-slate-900/70 px-4 py-3 text-white shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Live this week</p>
                    <p className="mt-2 text-2xl font-semibold">94</p>
                    <p className="mt-1 text-sm text-white/70">new community actions</p>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-[28px] bg-white/95 p-5 text-slate-900 shadow-glass backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">Community picture</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">A warmer way to discover services, support, health, and local connections.</h3>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                      <span className="rounded-full bg-brand-50 px-3 py-2 text-brand-700">Find help</span>
                      <span className="rounded-full bg-pink-50 px-3 py-2 text-pink-700">Create moments</span>
                      <span className="rounded-full bg-sand px-3 py-2 text-amber-700">Stay connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {quickActions.map((item) => (
                  <button
                    key={item.title}
                    className="group rounded-[28px] border border-slate-200/80 bg-white/90 p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50"
                    type="button"
                    onClick={() => handleQuickAction(item)}
                  >
                    <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">
                      Quick action
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                    <span className="mt-5 inline-flex items-center text-sm font-semibold text-brand-600">{item.cta}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-5 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft sm:p-7">
              <SectionHeader
                eyebrow="How it works"
                title="Use Sazilo Sewa in three simple steps"
                description="Search, take action, and stay updated from one dashboard."
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {howItWorksItems.map((item) => (
                  <article key={item.step} className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 shadow-soft">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600">
                      {item.step}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                  </article>
                ))}

                <div className="rounded-[28px] bg-slate-900 p-5 text-white shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Need help today?</p>
                  <h3 className="mt-4 text-lg font-semibold">Start with one quick action</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">Post a request or offer help in a few taps.</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      className="inline-flex items-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-brand-50 hover:text-brand-700"
                      type="button"
                      onClick={() => openPanel('askForHelp')}
                    >
                      Ask for Help
                    </button>
                    <button
                      className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                      type="button"
                      onClick={() => openPanel('offerService')}
                    >
                      Offer Help
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section id="featured" className="space-y-5 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft sm:p-7">
              <SectionHeader
                eyebrow="Featured & trending"
                title="Popular this week"
                description="Popular picks people are booking and sharing this week."
              />

              <div className="grid grid-flow-col auto-cols-[85%] gap-4 overflow-x-auto pb-2 sm:auto-cols-[62%] xl:auto-cols-[38%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {featuredResults.length ? (
                  featuredResults.map((item) => (
                    <article key={item.title} className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50/80 shadow-soft">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img alt={item.title} className="h-full w-full object-cover" src={item.image} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
                        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-600">
                          {item.rating} rating
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                            {item.meta}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-500">{item.subtitle}</p>
                        <button
                          className="mt-5 inline-flex items-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                          type="button"
                          onClick={() => handleCollectionAction(item.title, item.group)}
                        >
                          {item.cta}
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className={emptyCardClass}>No featured results match your current search. Try a broader search phrase.</div>
                )}
              </div>
            </section>

            <section id="recommended" className="space-y-5 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft sm:p-7">
              <SectionHeader
                eyebrow="Recommended for you"
                title="Picks based on what you explore"
                description="Suggestions based on your search and activity."
              />

              <div className="flex flex-wrap gap-2">
                {recommendationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      recommendationGroup === tab.id
                        ? 'bg-brand-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-500 hover:border-brand-200 hover:text-brand-600'
                    }`}
                    type="button"
                    onClick={() => setRecommendationGroup(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {recommendationResults.length ? (
                  recommendationResults.map((item) => (
                    <article key={item.title} className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50/80 shadow-soft">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img alt={item.title} className="h-full w-full object-cover" src={item.image} />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">{item.rating}</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-500">{item.subtitle}</p>
                        <button
                          className="mt-5 inline-flex items-center rounded-full border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-300 hover:bg-brand-50"
                          type="button"
                          onClick={() => handleCollectionAction(item.title, item.group)}
                        >
                          {item.cta}
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className={emptyCardClass}>No recommendations match this search yet. Try another keyword to refresh the feed.</div>
                )}
              </div>
            </section>

            <section id="services" className="space-y-5 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft sm:p-7">
              <SectionHeader
                eyebrow="Services grid"
                title="Popular service categories"
                description="Start with the most-used services."
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {serviceResults.length ? (
                  serviceResults.map((item) => (
                    <article key={item.title} className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 shadow-soft">
                      <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">
                        {item.count}
                      </span>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.subtitle}</p>
                      <button
                        className="mt-5 inline-flex items-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                        type="button"
                        onClick={() => handleCollectionAction(item.title, item.group)}
                      >
                        {item.cta}
                      </button>
                    </article>
                  ))
                ) : (
                  <div className={emptyCardClass}>No core service categories match that search right now.</div>
                )}
              </div>
            </section>

            <section id="health" className="space-y-5 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft sm:p-7">
              <SectionHeader eyebrow="Appointments" title="Doctor appointments & health" description="Book dentist, doctor, and other care services." />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {healthResults.length ? (
                  healthResults.map((item) => (
                    <article key={item.title} className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 shadow-soft">
                      <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-600">
                        {item.meta}
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.subtitle}</p>
                      <button
                        className="mt-5 inline-flex items-center rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
                        type="button"
                        onClick={() => handleCollectionAction(item.title, item.group)}
                      >
                        {item.cta}
                      </button>
                    </article>
                  ))
                ) : (
                  <div className={emptyCardClass}>No health options match that search right now.</div>
                )}
              </div>
            </section>

            <section className="space-y-5 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft sm:p-7">
              <SectionHeader
                eyebrow="Explore more services"
                title="More services"
                description="More categories to help you find the right fit."
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {moreServiceResults.length ? (
                  moreServiceResults.map((item) => (
                    <article key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{item.count}</p>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.subtitle}</p>
                      <button
                        className="mt-5 inline-flex items-center rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
                        type="button"
                        onClick={() => handleCollectionAction(item.title, item.group)}
                      >
                        {item.cta}
                      </button>
                    </article>
                  ))
                ) : (
                  <div className={emptyCardClass}>No extended services match that search right now.</div>
                )}
              </div>
            </section>

            <section id="places" className="space-y-5 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft sm:p-7">
              <SectionHeader
                eyebrow="Places"
                title="Useful places around the community"
                description="Popular places for support, worship, meetings, and sports."
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {placeResults.length ? (
                  placeResults.map((item) => (
                    <article key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">{item.meta}</p>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.subtitle}</p>
                      <button
                        className="mt-5 inline-flex items-center rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
                        type="button"
                        onClick={() => handlePlaceAction(item)}
                      >
                        {item.cta}
                      </button>
                    </article>
                  ))
                ) : (
                  <div className={emptyCardClass}>No places match that search right now.</div>
                )}
              </div>
            </section>

            <section id="support" className="space-y-5 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft sm:p-7">
              <SectionHeader
                eyebrow="Support"
                title="Community support"
                description="Simple ways to ask for help or help others."
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {supportResults.length ? (
                  supportResults.map((item) => (
                    <article key={item.title} className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 shadow-soft">
                      <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-600">
                        Support
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.subtitle}</p>
                      <button
                        className="mt-5 inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                        type="button"
                        onClick={() => handleCollectionAction(item.title, item.group)}
                      >
                        {item.cta}
                      </button>
                    </article>
                  ))
                ) : (
                  <div className={emptyCardClass}>No support items match that search at the moment.</div>
                )}
              </div>
            </section>

            <section id="events" className="space-y-5 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-soft sm:p-7">
              <SectionHeader
                eyebrow="Events"
                title="Events and activities"
                description="Local gatherings and activities near you."
              />

              <div className="grid gap-4 xl:grid-cols-2">
                {eventResults.length ? (
                  eventResults.map((item) => (
                    <article key={item.title} className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-brand-50/50 p-6 shadow-soft">
                      <div className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">
                        Events
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-500">{item.subtitle}</p>
                      <button
                        className="mt-5 inline-flex items-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                        type="button"
                        onClick={() => handleCollectionAction(item.title, item.group)}
                      >
                        {item.cta}
                      </button>
                    </article>
                  ))
                ) : (
                  <div className={emptyCardClass}>No events match the current filter.</div>
                )}
              </div>
            </section>

            <section id="connect" className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-soft">
              <div className="grid gap-6 p-6 sm:p-7 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">Connect</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]">{connectBanner.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">{connectBanner.subtitle}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                      type="button"
                      onClick={() => handleConnectAction('primary')}
                    >
                      {connectBanner.primaryCta}
                    </button>
                    <button
                      className="inline-flex items-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
                      type="button"
                      onClick={() => handleConnectAction('secondary')}
                    >
                      {connectBanner.secondaryCta}
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 rounded-[32px] bg-brand-50/70 p-4">
                  <div className="rounded-[28px] bg-white p-4 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">Suggested introductions</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">8 respectful, profile-led matches</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Curated from community preferences and privacy-first interest requests.</p>
                  </div>
                  <div className="rounded-[28px] bg-white p-4 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">Private and guided</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">Designed for warm, family-aware introductions</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <CommunityRightSidebar />
        </div>

        <div className="mx-auto w-full max-w-[1680px] px-4 pb-28 sm:px-6 lg:pb-10">
          <SiteFooter />
        </div>

        <CommunityBottomNav />
        <PostModal />
        <SlidePanel />
        <ToastStack toasts={toasts} />
      </div>
    </CommunityDashboardContext.Provider>
  );
};

export default CommunityServicesPage;
