const modules = import.meta.glob('./*.js', { eager: true });

const slugs = {};
for (const path in modules) {
  const match = path.match(/\.\/(.+)\.js$/);
  if (match && match[1] !== 'slugs') {
    const slug = match[1];
    slugs[slug] = modules[path].default;
  }
}

export default slugs;