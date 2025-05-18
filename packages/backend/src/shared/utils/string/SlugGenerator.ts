export const SlugGenerator = (prefix: string) => {
  const currentDate = new Date();
  const seconds = currentDate.getSeconds();
  const milliseconds = currentDate.getMilliseconds();
  const randomChars = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 4);

  return `${prefix.replace(/ /g, '-').toLowerCase()}-${randomChars}`;
}