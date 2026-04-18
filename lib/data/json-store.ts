import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      await writeJsonFile(filename, fallback);
      return fallback;
    }

    try {
      await writeJsonFile(filename, fallback);
    } catch {
      // noop
    }

    return fallback;
  }
}

export async function writeJsonFile<T>(filename: string, value: T) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}
