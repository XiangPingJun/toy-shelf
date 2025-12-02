const modules = import.meta.glob('./*.js', { eager: true });

const articles = {};
for (const path in modules) {
  const match = path.match(/\.\/(.+)\.js$/);
  if (match && match[1] !== 'articles') {
    const article = match[1];
    articles[article] = modules[path].default;
  }
}

export default articles;