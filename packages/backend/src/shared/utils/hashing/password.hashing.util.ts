import * as bcrypt from 'bcrypt';

async function hashString(value: string): Promise<string> {
  const saltOrRounds = 10;
  return await bcrypt.hash(value, saltOrRounds);
}

async function compareHash(value: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(value, hash);
}

export { hashString, compareHash };
