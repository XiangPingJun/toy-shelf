const modules = import.meta.glob('/static/v/*/data.data', { eager: true });

const articles = {} as Record<string, any>;

Object.entries(modules).forEach(([path, module]) => {
  const name = path.match(/^\/static\/v\/([^\/]+)\/data.data$/)?.[1] ?? '';
  articles[name] = (module as { default: any }).default;
})

export default articles;