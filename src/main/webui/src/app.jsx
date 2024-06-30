import { useEffect, useState } from 'preact/hooks'
import { Suspense, lazy } from 'preact/compat';

import { ApplicationGroupList } from './ApplicationGroupList'

import startpunktLogo from './assets/logo.png'
import './app.scss'

// const ApplicationGroupList = lazy(() => import('./ApplicationGroupList'));

export function App() {
  // read the /api/apps endpoint and update the groups state
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('/api/apps')
      .then((res) => res.json())
      .then(setGroups)
  }, [])

  return (
    <>
      <div>
        <h1><img src={startpunktLogo} class="bi text-body-secondary flex-shrink-0 me-3" width="1.75em" height="1.75em" alt="Vite logo" />Startpunkt</h1>
      </div>

      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <ApplicationGroupList groups={groups} />
      {/* </Suspense> */}

    </>
  )
}
