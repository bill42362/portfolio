// resolveTags.js
import flushChunks from 'webpack-flush-chunks';

export const resolveJsTags = ({ webpackStats, chunkNames = [] }) => {
  const { js } = flushChunks(webpackStats, {
    chunkNames,
    before: ['vendors'],
    after: ['bundle'],
  });
  return js.toString();
};

export const resolveStaticTags = ({ webpackStats }) => {
  const { assets, children } = webpackStats;
  const pwaManifestAsset = assets.filter(asset =>
    asset.name.match(/^manifest.*\.json$/gi)
  )[0];
  const pwaManifestTag = pwaManifestAsset
    ? `<link rel=manifest href=/${pwaManifestAsset.name}>`
    : '';

  const faviconPlugin = children.filter(child =>
    child.name.match('favicon')
  )[0];

  let faviconTags = '';
  if (faviconPlugin) {
    faviconTags = eval(faviconPlugin.modules[0].source)
      .tags.filter(tag => !tag.includes('manifest'))
      .join('')
      .replace('black-translucent', 'black');
  }

  return {
    pwaManifestTag,
    faviconTags,
  };
};
