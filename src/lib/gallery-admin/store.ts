import type { GalleryImage } from "@/lib/gallery";

export type ManagedGalleryImage = GalleryImage & {
  id: string;
  createdAt: string;
  isUserAdded: boolean;
};

type GalleryPersistedState = {
  added: ManagedGalleryImage[];
  deletedIds: string[];
};

const STORE_KEY = "vsgo-gallery-items";

function staticId(src: string) {
  return `static:${src}`;
}

function readPersisted(): GalleryPersistedState {
  if (typeof window === "undefined") {
    return { added: [], deletedIds: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return { added: [], deletedIds: [] };
    const parsed = JSON.parse(raw) as GalleryPersistedState;
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
    };
  } catch {
    return { added: [], deletedIds: [] };
  }
}

function writePersisted(state: GalleryPersistedState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function loadGalleryImages(
  baseImages: GalleryImage[],
): ManagedGalleryImage[] {
  const { added, deletedIds } = readPersisted();
  const deleted = new Set(deletedIds);

  const fromStatic: ManagedGalleryImage[] = baseImages
    .map((image) => ({
      id: staticId(image.src),
      src: image.src,
      alt: image.alt,
      createdAt: "1970-01-01T00:00:00.000Z",
      isUserAdded: false,
    }))
    .filter((image) => !deleted.has(image.id));

  const fromAdded = added.filter((image) => !deleted.has(image.id));
  return [...fromStatic, ...fromAdded];
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to read file"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function addGalleryImages(
  baseImages: GalleryImage[],
  files: File[],
  altPrefix = "Завантажене фото галереї",
): Promise<ManagedGalleryImage[]> {
  const state = readPersisted();
  const createdAt = new Date().toISOString();

  const newItems: ManagedGalleryImage[] = [];
  for (const [index, file] of files.entries()) {
    if (!file.type.startsWith("image/")) continue;
    const src = await fileToDataUrl(file);
    newItems.push({
      id: `user:${createdAt}:${index}:${file.name}`,
      src,
      alt: file.name ? `${altPrefix}: ${file.name}` : altPrefix,
      createdAt,
      isUserAdded: true,
    });
  }

  const next: GalleryPersistedState = {
    added: [...state.added, ...newItems],
    deletedIds: state.deletedIds,
  };
  writePersisted(next);
  return loadGalleryImages(baseImages);
}

export function deleteGalleryImage(
  baseImages: GalleryImage[],
  imageId: string,
): ManagedGalleryImage[] {
  const state = readPersisted();
  const next: GalleryPersistedState = {
    added: state.added.filter((image) => image.id !== imageId),
    deletedIds: state.deletedIds.includes(imageId)
      ? state.deletedIds
      : [...state.deletedIds, imageId],
  };
  writePersisted(next);
  return loadGalleryImages(baseImages);
}
