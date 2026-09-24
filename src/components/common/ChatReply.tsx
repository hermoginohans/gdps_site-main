import { Fragment } from 'react';
import { Link } from '../../context/RouterContext';
import { useCatalog } from '../../context/CatalogContext';

export function ChatReply({ text }: { text: string }) {
  const { products } = useCatalog();
  // Only recognize HTTPS links and known route shapes; never interpret HTML.
  const pattern = /\[([^\]\n]+)\]\((https:\/\/[^\s)]+|\/games\/[a-zA-Z0-9_-]+)\)|https:\/\/[^\s<>"'`]+|(?<![\w/])\/games\/[a-zA-Z0-9_-]+/g;
  const parts = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index!;
    parts.push(<Fragment key={`text-${start}`}>{text.slice(cursor, start)}</Fragment>);
    const raw = match[2] || match[0];
    const url = raw.replace(/[.,!?;:)]+$/, '');
    const suffix = raw.slice(url.length);
    const product = products.find(item => `/games/${item.slug}` === url);
    const label = match[1] || (product ? `${product.name} — View packages` : url);
    parts.push(<Fragment key={`link-${start}`}><Link to={url} className="font-semibold text-purple-200 underline decoration-purple-400 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-300">{label}</Link>{suffix}</Fragment>);
    cursor = start + match[0].length;
  }
  parts.push(<Fragment key="remaining">{text.slice(cursor)}</Fragment>);
  return <>{parts}</>;
}
