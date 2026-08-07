export interface Source {
  id: number;
  name: string;
}

export interface NotebookRecord {
  id: string;
  title: string;
  sources: Source[];
  updatedAt: number;
  pinned?: boolean;
  collections?: string[];
}

// ponytail: 실제 백엔드 노트북 API가 아직 없어서 localStorage를 임시 DB로 씁니다.
// 백엔드 붙일 때 이 함수들만 api 호출로 교체하면 됩니다.
const STORAGE_KEY = 'bottabot:notebooks';

export const loadAllNotebooks = (): Record<string, NotebookRecord> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveNotebook = (record: NotebookRecord) => {
  const all = loadAllNotebooks();
  all[record.id] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

export const deleteNotebook = (id: string) => {
  const all = loadAllNotebooks();
  delete all[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

export const renameNotebook = (id: string, title: string) => {
  const record = loadAllNotebooks()[id];
  if (!record) return;
  saveNotebook({ ...record, title, updatedAt: Date.now() });
};

export const togglePin = (id: string) => {
  const record = loadAllNotebooks()[id];
  if (!record) return;
  saveNotebook({ ...record, pinned: !record.pinned });
};

export const addNotebookToCollection = (id: string, collection: string) => {
  const record = loadAllNotebooks()[id];
  if (!record || (record.collections ?? []).includes(collection)) return;
  saveNotebook({ ...record, collections: [...(record.collections ?? []), collection] });
};

export const removeNotebookFromCollection = (id: string, collection: string) => {
  const record = loadAllNotebooks()[id];
  if (!record) return;
  saveNotebook({ ...record, collections: (record.collections ?? []).filter((c) => c !== collection) });
};

export const listCollectionNames = (): string[] => {
  const names = new Set<string>();
  Object.values(loadAllNotebooks()).forEach((nb) => (nb.collections ?? []).forEach((c) => names.add(c)));
  return Array.from(names).sort();
};

// 고정된 노트북을 먼저, 그 다음 최근 수정순
export const listNotebooks = (): NotebookRecord[] =>
  Object.values(loadAllNotebooks()).sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
