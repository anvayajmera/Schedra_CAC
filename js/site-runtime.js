(function() {
  const config = window.SchedraSiteConfig || {};
  const STORAGE_KEY = 'schedra:activeSchool';
  let cachedSchoolId = null;

  const resolveFromObject = (source, path) => {
    if (!source || !path) return undefined;
    return path.split('.').reduce((acc, part) => {
      if (acc === undefined || acc === null) return undefined;
      if (Array.isArray(acc)) {
        const index = Number(part);
        return Number.isNaN(index) ? undefined : acc[index];
      }
      if (typeof acc === 'object') {
        return Object.prototype.hasOwnProperty.call(acc, part) ? acc[part] : undefined;
      }
      return undefined;
    }, source);
  };

  const getAllSchools = () => config.schools || {};

  const normalizePageKey = (raw) => {
    if (!raw) return 'home';
    const key = raw.toLowerCase();
    if (['index', 'index.html'].includes(key)) return 'home';
    if (['event', 'events'].includes(key)) return 'events';
    if (['rent', 'rent-venue', 'rentvenue'].includes(key)) return 'rent';
    if (['login', 'sign-in', 'signin'].includes(key)) return 'login';
    if (['404'].includes(key)) return '404';
    return key;
  };

  const getDefaultSchoolId = () => {
    const schools = getAllSchools();
    if (config.defaultSchoolId && schools[config.defaultSchoolId]) return config.defaultSchoolId;
    const firstKey = Object.keys(schools)[0];
    return firstKey || null;
  };

  const readStoredSchoolId = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return null;
    }
  };

  const persistSchoolId = (id) => {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (err) {}
  };

  const getActiveSchoolId = () => {
    if (cachedSchoolId) return cachedSchoolId;
    const schools = getAllSchools();
    const stored = readStoredSchoolId();
    if (stored && schools[stored]) {
      cachedSchoolId = stored;
      return cachedSchoolId;
    }
    cachedSchoolId = getDefaultSchoolId();
    return cachedSchoolId;
  };

  const getSchool = () => {
    const schools = getAllSchools();
    const id = getActiveSchoolId();
    return id ? schools[id] : null;
  };

  const getStorageKey = (key) => {
    const id = getActiveSchoolId() || 'default';
    return `schedra:${id}:${key}`;
  };

  const setActiveSchool = (id) => {
    const schools = getAllSchools();
    if (!schools[id]) return;
    cachedSchoolId = id;
    persistSchoolId(id);
    window.location.reload();
  };

  const applyTheme = (school) => {
    if (!school) return;
    const root = document.documentElement;
    const vars = (school.theme && school.theme.variables) || {};
    Object.keys(vars).forEach(name => {
      root.style.setProperty(name, vars[name]);
    });
    const brand = school.brand || {};
    const colors = brand.colors || {};
    if (colors.accent) root.style.setProperty('--schedra-accent', colors.accent);
    if (colors.primary) root.style.setProperty('--schedra-primary', colors.primary);
    if (colors.dark) root.style.setProperty('--schedra-dark', colors.dark);
    if (colors.surface) root.style.setProperty('--schedra-surface', colors.surface);
    if (colors.background) root.style.setProperty('--schedra-background', colors.background);
  };

  const normalizeMatch = (match) => {
    if (!match) return '';
    if (match.startsWith('#')) return match;
    if (!match.startsWith('/')) return `/${match}`;
    return match;
  };

  const isNavItemActive = (item) => {
    const matches = item.match || [];
    if (!matches.length) return false;
    const rawPath = window.location.pathname || '';
    const path = rawPath.toLowerCase();
    const cleanedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
    const hash = window.location.hash;
    return matches.some(raw => {
      const match = normalizeMatch(raw);
      if (match.startsWith('#')) return hash === match;
      const target = match.toLowerCase();
      if (target === '/' || target === '') {
        return cleanedPath === '' || cleanedPath === '/' || cleanedPath.endsWith('/index.html') || cleanedPath.endsWith('/home.html');
      }
      return cleanedPath === target || cleanedPath.endsWith(target);
    });
  };

  const applyNavigation = (school) => {
    if (!school) return;
    const navConfig = school.navigation || {};
    const navLists = Array.from(document.querySelectorAll('#nav-menu-container .nav-menu'));
    if (navLists.length) {
      navLists.forEach(list => {
        list.innerHTML = '';
        (navConfig.items || []).forEach(item => {
          const li = document.createElement('li');
          if (item.className) item.className.split(' ').filter(Boolean).forEach(cls => li.classList.add(cls));
          const anchor = document.createElement('a');
          anchor.textContent = item.label || '';
          anchor.href = item.href || '#';
          if (item.id) anchor.id = item.id;
          if (item.target) anchor.target = item.target;
          if (item.rel) anchor.rel = item.rel;
          if (item.variant) {
            const variantClass = `nav-item-${item.variant}`;
            anchor.classList.add(variantClass);
          }
          li.appendChild(anchor);
          if (isNavItemActive(item)) li.classList.add('menu-active');
          list.appendChild(li);
        });
      });
    }
    const logoLink = document.querySelector('#logo a');
    if (logoLink && navConfig.logoHref) logoLink.setAttribute('href', navConfig.logoHref);
    const logoImg = document.querySelector('#logo img');
    if (logoImg && school.brand) {
      if (school.brand.logo) logoImg.setAttribute('src', school.brand.logo);
      if (school.brand.logoAlt) logoImg.setAttribute('alt', school.brand.logoAlt);
      if (school.brand.logoAlt) logoImg.setAttribute('title', school.brand.logoAlt);
    }
  };

  const getPageId = () => {
    const body = document.body;
    if (body && body.dataset.page) return body.dataset.page;
    const path = window.location.pathname.replace(/\/+$/, '');
    if (!path || path === '') return 'home';
    const file = path.split('/').pop();
    if (!file || file === 'index.html') return 'home';
    return file.replace('.html', '') || 'home';
  };

  const applyMeta = (pageId, school) => {
    if (!school) return;
    const metaKey = normalizePageKey(pageId);
    const meta = (school.meta && school.meta[metaKey]) || null;
    if (!meta) return;
    if (meta.title) document.title = meta.title;
    if (meta.description) {
      let descriptionTag = document.querySelector('meta[name="description"]');
      if (!descriptionTag) {
        descriptionTag = document.createElement('meta');
        descriptionTag.setAttribute('name', 'description');
        document.head.appendChild(descriptionTag);
      }
      descriptionTag.setAttribute('content', meta.description);
    }
  };

  const applyDataBindings = (school) => {
    if (!school) return;
    const textNodes = document.querySelectorAll('[data-config-text]');
    textNodes.forEach(node => {
      const path = node.dataset.configText;
      const value = resolveFromObject(school, path);
      if (value !== undefined && value !== null) node.textContent = value;
    });

    const attrNodes = document.querySelectorAll('[data-config-attr]');
    attrNodes.forEach(node => {
      const raw = node.dataset.configAttr;
      if (!raw) return;
      raw.split(';').map(entry => entry.trim()).filter(Boolean).forEach(entry => {
        const parts = entry.split(':');
        if (parts.length < 2) return;
        const attr = parts[0].trim();
        const path = parts.slice(1).join(':').trim();
        const value = resolveFromObject(school, path);
        if (value === undefined || value === null) return;
        if (attr === 'class') {
          node.className = value;
        } else {
          node.setAttribute(attr, value);
        }
      });
    });

    const visibleNodes = document.querySelectorAll('[data-config-visible]');
    visibleNodes.forEach(node => {
      const path = node.dataset.configVisible;
      const value = resolveFromObject(school, path);
      const show = !!value;
      node.hidden = !show;
    });

    const styleNodes = document.querySelectorAll('[data-config-style]');
    styleNodes.forEach(node => {
      const raw = node.dataset.configStyle;
      if (!raw) return;
      raw.split(';').map(entry => entry.trim()).filter(Boolean).forEach(entry => {
        const parts = entry.split(':');
        if (parts.length < 2) return;
        const prop = parts[0].trim();
        const path = parts.slice(1).join(':').trim();
        const value = resolveFromObject(school, path);
        if (value === undefined || value === null) return;
        node.style.setProperty(prop, value);
      });
    });
  };

  const buildChatPrompt = (pageId) => {
    const school = getSchool();
    if (!school) return '';
    const brand = school.brand || {};
    const assistantName = (school.chatbot && school.chatbot.name) || 'SchedraBot';
    const events = (school.events && school.events.defaults) || [];
    const contact = (school.home && school.home.contact) || {};
    const rentContact = (school.rent && school.rent.contact) || contact;

    const lines = [
      `You are ${assistantName}, the virtual concierge for ${brand.name || 'this venue platform'}.`,
      'Provide accurate, friendly answers about the venue, events, rentals, and accounts.',
      'Keep responses concise and grounded in the information below.'
    ];

    if (brand.locationLabel || brand.colors) {
      lines.push('', '### Venue Overview');
      if (brand.locationLabel) lines.push(`- ${brand.locationLabel}`);
      if (brand.colors && brand.colors.accent) lines.push(`- Accent color: ${brand.colors.accent}`);
    }

    if (events.length) {
      lines.push('', '### Upcoming Highlights');
      events.slice(0, 8).forEach(evt => {
        const date = evt.date || 'TBA';
        const category = evt.category || 'Event';
        const location = evt.location || 'Venue';
        const price = typeof evt.price === 'number' ? (evt.price > 0 ? `$${evt.price.toFixed(2)}` : 'Free') : 'Free';
        lines.push(`- ${evt.title} • ${category} • ${date} • ${location} • ${price}`);
      });
    }

    const contactLines = [];
    if (contact.address) contactLines.push(`- Address: ${contact.address}`);
    if (contact.phone) contactLines.push(`- Phone: ${contact.phone}`);
    if (contact.email) contactLines.push(`- Email: ${contact.email}`);
    if (contactLines.length) {
      lines.push('', '### Contact');
      contactLines.forEach(line => lines.push(line));
    }

    if (rentContact && (rentContact.email || rentContact.phone)) {
      lines.push('', '### Rentals Support');
      if (rentContact.phone) lines.push(`- Rentals phone: ${rentContact.phone}`);
      if (rentContact.email) lines.push(`- Rentals email: ${rentContact.email}`);
    }

    lines.push(
      '',
      '### Website Notes',
      '- Events page: filter upcoming events, log in to purchase tickets.',
      '- Rent page: six-step request workflow, requires account.',
      '- Login page: dashboard for tickets, rentals, and account details.',
      '',
      'If unsure, direct users to contact the venue team.'
    );

    return lines.join('\n');
  };

  const seedCollection = async (db, collectionName, documents, options = {}) => {
    if (!db || !collectionName || !Array.isArray(documents) || !documents.length) return;
    const { keyField = 'id', merge = true, attachSchoolId = true } = options;
    const schoolId = getActiveSchoolId();
    const FieldValue = window.firebase && window.firebase.firestore ? window.firebase.firestore.FieldValue : null;
    const timestamp = FieldValue ? FieldValue.serverTimestamp() : new Date().toISOString();
    await Promise.all(documents.map(async (doc) => {
      if (!doc || typeof doc !== 'object') return;
      const key = doc[keyField];
      if (!key) return;
      const payload = {
        ...doc,
        updatedAt: timestamp
      };
      if (attachSchoolId) payload.schoolId = schoolId;
      await db.collection(collectionName).doc(String(key)).set(payload, { merge });
    }));
  };

  const resolvePageConfig = (pageId) => {
    const school = getSchool();
    if (!school) return {};
    const key = normalizePageKey(pageId || getPageId());
    switch (key) {
      case 'home':
        return school.home || {};
      case 'events':
        return school.events || {};
      case 'rent':
        return school.rent || {};
      case 'login':
        return school.login || {};
      default:
        return resolveFromObject(school, key) || {};
    }
  };

  const resolveNewsletterConfig = (pageId) => {
    const scoped = resolvePageConfig(pageId);
    if (scoped && scoped.newsletter) return scoped.newsletter;
    const school = getSchool();
    if (!school) return {};
    return (school.home && school.home.newsletter) || {};
  };

  const runtime = {
    getConfig: () => config,
    getActiveSchoolId,
    getSchool,
    getBrand: () => (getSchool() && getSchool().brand) || {},
    getTheme: () => (getSchool() && getSchool().theme) || {},
    getHomeConfig: () => (getSchool() && getSchool().home) || {},
    getEventsConfig: () => (getSchool() && getSchool().events) || {},
    getRentConfig: () => (getSchool() && getSchool().rent) || {},
    getLoginConfig: () => (getSchool() && getSchool().login) || {},
    getChatbotConfig: () => (getSchool() && getSchool().chatbot) || {},
    getFirebaseConfig: () => (getSchool() && getSchool().firebase) || null,
    getCollections: () => (getSchool() && getSchool().collections) || {},
    getPageConfig: resolvePageConfig,
    getNewsletterConfig: resolveNewsletterConfig,
    getStorageKey,
    normalizePageKey,
    setActiveSchool,
    resolve: (path) => resolveFromObject(getSchool(), path),
    buildChatPrompt,
    getPageId,
    seedCollection,
    refresh: () => {
      const school = getSchool();
      applyNavigation(school);
      applyDataBindings(school);
    }
  };

  window.SchedraSite = runtime;

  const school = getSchool();
  applyTheme(school);

  const initialize = () => {
    const activeSchool = getSchool();
    if (!activeSchool) return;
    const body = document.body;
    if (body) {
      body.dataset.schoolId = activeSchool.id || '';
      if (activeSchool.brand && activeSchool.brand.shortName) {
        body.dataset.schoolName = activeSchool.brand.shortName;
      }
    }
    applyNavigation(activeSchool);
    applyMeta(getPageId(), activeSchool);
    applyDataBindings(activeSchool);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
