import { useEffect, useState } from 'preact/hooks'
import { Suspense, lazy } from 'preact/compat';

import { IntlProvider } from 'preact-i18n';
import { Text } from 'preact-i18n';

import startpunktLogo from './assets/logo.png'
import './app.scss'
import * as bootstrap from 'bootstrap'

import { ApplicationGroupList } from './ApplicationGroupList'
import { BookmarkGroupList } from './BookmarkGroupList'

import { useLocalStorage } from '@rehooks/local-storage';
import { writeStorage } from '@rehooks/local-storage';

export function ForkMe() {
  // if the config object is not empty and the web.showGitHubLink is true, show the fork me link
  //  if (config && config.web && config.web.showGitHubLink) {
  return (
    <a href="https://github.com/ullbergm/startpunkt" class="github-corner" aria-label="View source on GitHub" target="_blank">
      <svg width="50" height="50" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
      </svg>
    </a>
  );
  // }
  // return null;
}

export function ThemeSwitcher(handleLightThemeClick, handleDarkThemeClick, handleAutoThemeClick) {

  const [themeIcon, setThemeIcon] = useState("#circle-half");

  const [theme] = useLocalStorage('theme', 'light');
  useEffect(() => {
    if (theme === 'light') {
      handleLightThemeClick();
    } else if (theme === 'dark') {
      handleDarkThemeClick();
    } else if (theme === 'auto') {
      handleAutoThemeClick();
    }
  }, [])

  function handleLightThemeClick(setIcon = true) {
    console.log("light theme");

    if (setIcon) {
      setThemeIcon("#sun-fill");
      writeStorage('theme', 'light');
    }
    document.body.style.setProperty('--bs-body-bg', '#F8F6F1');
    document.body.style.setProperty('--bs-body-color', '#696969');
    document.body.style.setProperty('--color-text-pri', '#4C432E');
    document.body.style.setProperty('--color-text-acc', '#AA9A73');
  }
  function handleDarkThemeClick(setIcon = true) {
    console.log("dark theme");

    if (setIcon) {
      setThemeIcon("#moon-stars-fill");
      writeStorage('theme', 'dark');
    }
    document.body.style.setProperty('--bs-body-bg', '#232530');
    document.body.style.setProperty('--bs-body-color', '#696969');
    document.body.style.setProperty('--color-text-pri', '#FAB795');
    document.body.style.setProperty('--color-text-acc', '#E95678');
  }
  function handleAutoThemeClick() {
    console.log("auto theme");

    setThemeIcon("#circle-half");

    writeStorage('theme', 'auto');
    // if its after dark, set dark theme
    // else set light theme
    const now = new Date();
    const hour = now.getHours();
    if (hour > 18 || hour < 6) {
      handleDarkThemeClick(false);
    } else {
      handleLightThemeClick(false);
    }
  }

  return (
    <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
      <button class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button"
        aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (auto)">
        <svg class="bi my-1 theme-icon-active" width="1em" height="1em">
          <use href={themeIcon}></use>
        </svg>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center {lightActive}" data-bs-theme-value="light"
            aria-pressed="false" onClick={handleLightThemeClick}>
            <svg class="bi me-2 opacity-50" width="1em" height="1em">
              <use href="#sun-fill"></use>
            </svg>
            <Text id="home.theme.light">Light</Text>
            <svg class="bi ms-auto d-none" width="1em" height="1em">
              <use href="#check2"></use>
            </svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center {darkActive}" data-bs-theme-value="dark"
            aria-pressed="false" onClick={handleDarkThemeClick}>
            <svg class="bi me-2 opacity-50" width="1em" height="1em">
              <use href="#moon-stars-fill"></use>
            </svg>
            <Text id="home.theme.dark">Dark</Text>
            <svg class="bi ms-auto d-none" width="1em" height="1em">
              <use href="#check2"></use>
            </svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center {autoActive}" data-bs-theme-value="auto"
            aria-pressed="true" onClick={handleAutoThemeClick}>
            <svg class="bi me-2 opacity-50" width="1em" height="1em">
              <use href="#circle-half"></use>
            </svg>
            <Text id="home.theme.auto">Auto</Text>
            <svg class="bi ms-auto d-none" width="1em" height="1em">
              <use href="#check2"></use>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  );
}

export function App() {
  const [definition, setDefinition] = useState([]);

  useEffect(() => {
    var lang = navigator.language;
    console.log("switching language to " + lang);
    fetch('/api/i8n/' + lang)
      .then((res) => res.json())
      .then(setDefinition)
      .catch((err) => {
        // Ignore errors
      });
  }, []);


  const [showGitHubLink, setShowGitHubLink] = useState(false);
  const [title, setTitle] = useState("Startpunkt");
  const [version, setVersion] = useState("dev");

  // read the /api/config endpoint to get the configuration
  const [config, setConfig] = useState([]);
  useEffect(() => {
    var config = fetch('/api/config')
      .then((res) => res.json())
      .then((res) => {
        setShowGitHubLink(res.config.web.showGithubLink);
        setTitle(res.config.web.title);
        setVersion(res.config.version);
      });

  }, [])

  // read the /api/apps endpoint and update the groups state
  const [applicationGroups, setApplicationGroups] = useState([]);
  useEffect(() => {
    fetch('/api/apps')
      .then((res) => res.json())
      .then(setApplicationGroups)
  }, [])

  const [bookmarkGroups, setBookmarkGroups] = useState([]);
  useEffect(() => {
    fetch('/api/bookmarks')
      .then((res) => res.json())
      .then(setBookmarkGroups)
  }, [])

  // When someone clicks on Bookmarks, switch to showing bookmarks instead of applications
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showApplications, setShowApplications] = useState(true);

  function handleBookmarksClick() {
    console.log("showing bookmarks");

    setShowBookmarks(true);
    setShowApplications(false);
  }
  function handleApplicationsClick() {
    console.log("showing applications");
    setShowBookmarks(false);
    setShowApplications(true);
  }

  return (
    <IntlProvider definition={definition}>
      {showGitHubLink && <ForkMe />}
      <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="check2" viewBox="0 0 16 16">
          <path
            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
        </symbol>
        <symbol id="circle-half" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
        </symbol>
        <symbol id="moon-stars-fill" viewBox="0 0 16 16">
          <path
            d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
          <path
            d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
        </symbol>
        <symbol id="sun-fill" viewBox="0 0 16 16">
          <path
            d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
        </symbol>
      </svg>

      <ThemeSwitcher />

      <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header class="mb-auto">
          <div>
            <h3 class="float-md-start mb-0"><img src={startpunktLogo} alt="Startpunkt" width="48" height="48" />&nbsp;{title}</h3>
            <nav class="nav nav-masthead justify-content-center float-md-end">
              <a class="nav-link fw-bold py-1 px-0 active" aria-current="page" href="#" onClick={handleApplicationsClick}><Text id="home.applications">Applications</Text></a>
              <a class="nav-link fw-bold py-1 px-0" href="#" onClick={handleBookmarksClick}><Text id="home.bookmarks">Bookmarks</Text></a>
            </nav>
          </div>
        </header>

        <main class="px-3">

          {showApplications && <ApplicationGroupList groups={applicationGroups} />}
          {showBookmarks && <BookmarkGroupList groups={bookmarkGroups} />}

        </main>
        <footer class="mt-auto text-white-50">
          <p>Startpunkt v{version}, by <a href="https://ullberg.us" class="text-white">Magnus Ullberg</a>.</p>
        </footer>
      </div>
    </IntlProvider>
  )
}
