document.addEventListener("DOMContentLoaded", () => {
    const pageWrapper = document.getElementById('page-wrapper');
    const mainHead = document.head;

    // --- core functions ---

    /**
     * swaps <link> and <style> tags in the main document's <head>.
     * it removes the old page's assets and adds the new ones.
     */
    const swapHeadTags = async (newDoc) => {
        // Remove old page-specific assets
        mainHead.querySelectorAll('[data-spa-asset]').forEach(tag => tag.remove());

        // Add new assets from the fetched document, but avoid duplicates and wait for external assets to load
        const newTags = Array.from(newDoc.head.querySelectorAll('link[rel="stylesheet"], style, link[rel="prefetch"], meta, title, script[src]'));
        const loadPromises = [];

        for (const tag of newTags) {
            // dedupe by href/src for link/script
            if (tag.tagName.toLowerCase() === 'link' && tag.href) {
                const exists = Array.from(mainHead.querySelectorAll('link')).some(l => l.href === tag.href);
                if (exists) continue;
            }
            if (tag.tagName.toLowerCase() === 'script' && tag.src) {
                const exists = Array.from(mainHead.querySelectorAll('script')).some(s => s.src === tag.src);
                if (exists) continue;
            }

            const newTag = document.createElement(tag.tagName);
            for (const attr of tag.attributes) {
                newTag.setAttribute(attr.name, attr.value);
            }
            newTag.setAttribute('data-spa-asset', 'true'); // mark as page-specific asset

            if (tag.tagName.toLowerCase() === 'link' && tag.rel && tag.rel.includes('stylesheet')) {
                // wait for stylesheet to load
                const p = new Promise((resolve) => {
                    newTag.onload = () => resolve();
                    newTag.onerror = () => resolve();
                });
                loadPromises.push(p);
            }

            if (tag.tagName.toLowerCase() === 'script' && tag.src) {
                // wait for script to load
                const p = new Promise((resolve) => {
                    newTag.onload = () => resolve();
                    newTag.onerror = () => resolve();
                });
                loadPromises.push(p);
            }

            if (!tag.src) {
                newTag.textContent = tag.textContent; // inline style or script
            }

            mainHead.appendChild(newTag);
        }

        // wait for linked styles and external head scripts to load
        await Promise.all(loadPromises);
    };

    /**
     * Re-creates and executes scripts from the loaded body.
     * - inline scripts are re-created and executed
     * - external scripts (with src) are loaded and awaited so initialization runs
     * Returns a Promise that resolves once all body scripts have executed/loaded.
     */
    const executeBodyScripts = async (container) => {
        const scripts = Array.from(container.querySelectorAll('script'));

        // fetch external scripts in parallel
        const external = scripts.filter(s => s.src);
        const inline = scripts.filter(s => !s.src);

        const fetchPromises = external.map(s => {
            return new Promise((resolve) => {
                const newScript = document.createElement('script');
                for (const attr of s.attributes) newScript.setAttribute(attr.name, attr.value);
                newScript.onload = () => resolve({ok: true, node: newScript});
                newScript.onerror = () => resolve({ok: false, node: newScript});
                // start loading
                // use async attribute to allow parallelism without blocking parsing
                newScript.async = true;
                newScript.src = s.src;
                // replace original so relative URLs work
                s.parentNode.replaceChild(newScript, s);
            });
        });

        // wait for external scripts to at least attempt loading (they load in parallel)
        await Promise.all(fetchPromises);

        // execute inline scripts synchronously (they will run after external scripts have been requested)
        for (const s of inline) {
            const newScript = document.createElement('script');
            for (const attr of s.attributes) newScript.setAttribute(attr.name, attr.value);
            newScript.textContent = s.textContent;
            s.parentNode.replaceChild(newScript, s);
        }
    };

    /**
     * The main function to fetch, parse, and render a new page.
     */
    const loadPage = async (url, hash = '') => {
        let fetchUrl = url;

        // build candidates for fetching pages. this helps local servers (live-server etc.) that serve relative paths
        let candidates = [];
        if (fetchUrl === '/' || fetchUrl === '' || fetchUrl.endsWith('/index.html')) {
            candidates = ['/home.html', 'home.html', '/index.html', 'index.html'];
        } else {
            // normalize path
            const norm = fetchUrl.startsWith('/') ? fetchUrl : '/' + fetchUrl;
            candidates = [norm, fetchUrl.replace(/^\//, ''), norm + '.html', fetchUrl.replace(/^\//, '') + '.html'];
        }

        document.body.classList.add('loading');

        try {
            let response = null;
            let html = null;
            // try candidates in order until one succeeds
            for (const candidate of candidates) {
                try { response = await fetch(candidate); } catch (e) { response = null; }
                if (response && response.ok) {
                    html = await response.text();
                    break;
                }
            }

            // final attempt: try fetchUrl itself if we haven't found html yet
            if (!html) {
                try {
                    const retry = await fetch(fetchUrl);
                    if (retry && retry.ok) html = await retry.text();
                } catch (e) {}
            }

            if (!html) {
                window.location.href = '/404.html'; // hard redirect for 404
                return;
            }

            // Use DOMParser to create a new document from the fetched HTML
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');

            // 1. Swap head tags and wait for head assets (styles/scripts) to load
            await swapHeadTags(newDoc);

            // 2. create a hidden temp container so scripts can execute while the old content remains visible
            const temp = document.createElement('div');
            temp.style.position = 'absolute';
            temp.style.left = '-9999px';
            temp.style.top = '0';
            temp.style.width = '1px';
            temp.style.height = '1px';
            temp.style.overflow = 'hidden';
            temp.id = 'spa-temp-container';
            temp.innerHTML = newDoc.body.innerHTML;
            document.body.appendChild(temp);

            // 3. execute and await scripts inside the temp container (external scripts will load while hidden)
            await executeBodyScripts(temp);

            // 4. now swap the visible page content atomically
            pageWrapper.innerHTML = temp.innerHTML;
            // remove temp
            temp.parentNode.removeChild(temp);

            // re-initialize navbar/mobile nav and active states for the newly injected content
            (function reinitPageUI(){
                try {
                    // remove any old mobile nav elements so we can recreate from the new nav
                    const oldMobile = document.getElementById('mobile-nav');
                    const oldToggle = document.getElementById('mobile-nav-toggle');
                    const oldOverly = document.getElementById('mobile-body-overly');
                    if (oldMobile) oldMobile.remove();
                    if (oldToggle) oldToggle.remove();
                    if (oldOverly) oldOverly.remove();

                    const navContainer = document.getElementById('nav-menu-container');
                    if (navContainer) {
                        // clone nav for mobile
                        const mobileNav = navContainer.cloneNode(true);
                        mobileNav.id = 'mobile-nav';
                        // remove top-level ids/classes from cloned ul if present
                        const ul = mobileNav.querySelector('ul');
                        if (ul) { ul.removeAttribute('id'); ul.removeAttribute('class'); }
                        document.body.appendChild(mobileNav);

                        // create toggle and overlay
                        const toggleBtn = document.createElement('button');
                        toggleBtn.type = 'button';
                        toggleBtn.id = 'mobile-nav-toggle';
                        toggleBtn.innerHTML = '<i class="fa fa-bars"></i>';
                        document.body.prepend(toggleBtn);

                        const overlay = document.createElement('div');
                        overlay.id = 'mobile-body-overly';
                        document.body.appendChild(overlay);

                        // add expand icons for children
                        mobileNav.querySelectorAll('.menu-has-children').forEach(item => {
                            const icon = document.createElement('i');
                            icon.className = 'fa fa-chevron-down';
                            item.insertBefore(icon, item.firstChild);
                        });

                        // event delegation for mobile nav
                        document.addEventListener('click', function mobileDocHandler(e){
                            const target = e.target;
                            if (target.closest && target.closest('#mobile-nav-toggle')) {
                                document.body.classList.toggle('mobile-nav-active');
                                const icon = document.querySelector('#mobile-nav-toggle i');
                                if (icon) icon.classList.toggle('fa-times') , icon.classList.toggle('fa-bars');
                                const ol = document.getElementById('mobile-body-overly');
                                if (ol) ol.style.display = document.body.classList.contains('mobile-nav-active') ? 'block' : 'none';
                                return;
                            }

                            // toggling submenu chevrons
                            if (target.matches && target.matches('#mobile-nav .menu-has-children > i, #mobile-nav .menu-has-children > i *')) {
                                const el = target.closest('.menu-has-children');
                                if (el) {
                                    el.classList.toggle('menu-item-active');
                                    const ul = el.querySelector('ul');
                                    if (ul) ul.style.display = ul.style.display === 'block' ? 'none' : 'block';
                                    const iel = el.querySelector('i');
                                    if (iel) iel.classList.toggle('fa-chevron-up');
                                }
                            }
                        });
                    }

                    // update active menu item based on current pathname
                    const path = location.pathname;
                    document.querySelectorAll('#nav-menu-container .menu-active').forEach(li => li.classList.remove('menu-active'));
                    const links = document.querySelectorAll('#nav-menu-container a');
                    links.forEach(a => {
                        try {
                            const href = new URL(a.href).pathname;
                            if (href === path || (path === '/' && href === '/home.html')) {
                                const li = a.closest('li'); if (li) li.classList.add('menu-active');
                            }
                        } catch(e){}
                    });
                } catch(e){ console.error('reinitPageUI failed', e); }
            })();

            // 4. Handle scrolling to a hash link if one exists
            if (hash) {
                const element = document.querySelector(hash);
                element?.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo(0, 0);
            }

        } catch (error) {
            console.error('Failed to load page:', error);
            pageWrapper.innerHTML = '<h2>Error Loading Page</h2>';
        } finally {
            // Use a short delay to allow content to render before fading in
            setTimeout(() => document.body.classList.remove('loading'), 50);
        }
    };


    // --- Event Listeners ---

    document.body.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (link && link.href && link.target !== '_blank' && new URL(link.href).origin === window.location.origin) {
            event.preventDefault();
            
            const targetUrl = new URL(link.href);
            const path = targetUrl.pathname;
            const hash = targetUrl.hash;

            // Don't do anything if we're just clicking a hash link on the same page
            if (path === location.pathname && hash) {
                 const element = document.querySelector(hash);
                 element?.scrollIntoView({ behavior: 'smooth' });
                 return;
            }
            
            if (path === location.pathname) return;

            history.pushState(null, '', link.href);
            loadPage(path, hash);
        }
    });

    window.addEventListener('popstate', () => {
        loadPage(location.pathname, location.hash);
    });

    // --- Initial Load ---
    const initialPath = (location.pathname === '/' || location.pathname === '' || location.pathname.endsWith('/index.html')) ? '/home.html' : location.pathname;
    loadPage(initialPath, location.hash);
});