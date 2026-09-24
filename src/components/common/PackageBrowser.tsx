import { useState } from 'react';

function packageGroup(name: string): string {
  if (/\b(bundle|bundles|combo|combos)\b/i.test(name)) return 'Bundles';
  if (/\b(pass|passes|membership|subscription)\b/i.test(name)) return 'Passes';
  if (/\bdiamonds?\b/i.test(name)) return 'Diamonds';
  return 'Other packages';
}

export function usePackageBrowser<T extends { name: string }>(items: T[]) {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('All');
  const [limit, setLimit] = useState(12);
  const groups = ['All', ...Array.from(new Set(items.map(item => packageGroup(item.name))))];
  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matching = items.filter(item => (group === 'All' || packageGroup(item.name) === group)
    && words.every(word => item.name.toLowerCase().includes(word)));
  return {
    search, group, groups, total: matching.length, visible: matching.slice(0, limit),
    setSearch: (value: string) => { setSearch(value); setLimit(12); },
    setGroup: (value: string) => { setGroup(value); setLimit(12); },
    showMore: () => setLimit(value => value + 12),
  };
}

export function PackageFilters({ browser }: { browser: ReturnType<typeof usePackageBrowser> }) {
  return <div className="space-y-3">
    <label className="block text-sm text-gray-300">Search packages
      <input type="search" value={browser.search} onChange={event => browser.setSearch(event.target.value)}
        placeholder="Search by name or amount" className="dashboard-wallet-input mt-2 w-full" />
    </label>
    {browser.groups.length > 2 && <div className="flex flex-wrap gap-2" aria-label="Package types">
      {browser.groups.map(group => <button key={group} type="button" aria-pressed={browser.group === group}
        onClick={() => browser.setGroup(group)}
        className={`rounded-lg border px-3 py-2 text-sm ${browser.group === group ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-white/10 text-gray-300'}`}>{group}</button>)}
    </div>}
    <p role="status" className="text-sm text-gray-400">{browser.total ? `Showing ${browser.visible.length} of ${browser.total} packages` : 'No packages match your search. Try another name or amount.'}</p>
  </div>;
}

export function MorePackages({ browser }: { browser: ReturnType<typeof usePackageBrowser> }) {
  return browser.visible.length < browser.total ? <button type="button" onClick={browser.showMore}
    className="rounded-xl border border-brand-gold px-5 py-3 text-sm font-bold text-brand-gold">Show more packages</button> : null;
}
