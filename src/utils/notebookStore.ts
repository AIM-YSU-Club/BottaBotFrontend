// API 명세서 3~5장(노트북/소스/채팅 API)을 그대로 감싸는 얇은 클라이언트입니다.
// 예전엔 이 파일이 localStorage를 임시 DB로 썼는데, 이제 실제 백엔드 엔드포인트를 호출합니다.
import api from '../api/axios';

// 명세서 7장(주요 데이터 모델/Enum)
export type SourceType = 'FILE_PDF' | 'FILE_DOCX' | 'FILE_TXT' | 'FILE_PPTX' | 'FILE_XLSX' | 'FILE_IMAGE' | 'URL' | 'TEXT';
export type SourceStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR';

export interface NotebookSummary {
  id: string;
  title: string;
  description?: string;
  sourceCount: number;
  updatedAt: string;
}

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
}

export interface NotebookDetail extends NotebookSummary {
  sources: Source[];
}

export interface Citation {
  fileName?: string;
  page?: number;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  citations?: Citation[];
}

export interface ChatSession {
  sessionId: string;
  title?: string;
  updatedAt: string;
}

const EXT_TO_TYPE: Record<string, SourceType> = {
  pdf: 'FILE_PDF',
  docx: 'FILE_DOCX',
  txt: 'FILE_TXT',
  pptx: 'FILE_PPTX',
  xlsx: 'FILE_XLSX',
  jpg: 'FILE_IMAGE',
  jpeg: 'FILE_IMAGE',
  png: 'FILE_IMAGE',
  gif: 'FILE_IMAGE',
  webp: 'FILE_IMAGE',
  heic: 'FILE_IMAGE',
  heif: 'FILE_IMAGE',
};

export const inferFileSourceType = (fileName: string): SourceType => {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_TYPE[ext] ?? 'FILE_TXT';
};

// ponytail: 목록 API가 배열을 바로 주는지 스프링 기본 Page({content:[...]}) 래퍼로 주는지
// 명세서만으론 확정할 수 없어서, 둘 다 오는 경우를 방어적으로 처리합니다.
const unwrapList = <T,>(data: unknown): T[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray((data as { content?: T[] }).content)) {
    return (data as { content: T[] }).content;
  }
  return [];
};

// 백엔드에서 받은 id값은 String()을 한번 커져 문자열로 확실하게 취급
const notebookIdOf = (raw: { notebookId?: string; id?: string }) =>
  String(raw.notebookId ?? raw.id ?? '');

// GET /notebooks 의 응답 JSON을 Source 타입의 오브젝트로 변환
const normalizeSource = (raw: {
  sourceId?: string;
  id?: string;
  sourceName?: string;
  name?: string;
  type?: SourceType;
  status?: SourceStatus;
}): Source => ({
  id: String(raw.sourceId ?? raw.id ?? ''),
  name: raw.sourceName ?? raw.name ?? '',
  type: raw.type ?? 'TEXT',
  status: raw.status ?? 'DONE',
});

// GET /notebooks 의 응답 JSON을 NotebookSummary 타입의 오브젝트로 변환
const normalizeSummary = (raw: {
  notebookId?: string;
  id?: string;
  title?: string;
  description?: string;
  sourceCount?: number;
  updatedAt?: string;
}): NotebookSummary => ({
  id: notebookIdOf(raw),
  title: raw.title ?? '',
  description: raw.description,
  sourceCount: raw.sourceCount ?? 0,
  updatedAt: raw.updatedAt ?? '',
});

// GET /notebooks 의 응답 JSON을 NotebookDetail 타입의 오브젝트로 변환
const normalizeDetail = (raw: {
  notebookId?: string;
  id?: string;
  title?: string;
  description?: string;
  sourceCount?: number;
  updatedAt?: string;
  sources?: Parameters<typeof normalizeSource>[0][];
}): NotebookDetail => ({
  ...normalizeSummary(raw),
  sources: (raw.sources ?? []).map(normalizeSource),
});

// ── 노트북 (NB01) ──────────────────────────────────────────
export const createNotebook = (title: string, description?: string) =>
  api.post<{ notebookId: string; createdAt: string }>('/notebooks', { title, description });

export const listNotebooks = async (keyword?: string): Promise<NotebookSummary[]> => {
  // GET /notebooks — Swagger: keyword(optional) + pageable{page,size,sort}(required)
  // Spring Pageable은 JSON 객체가 아니라 펼친 쿼리 파라미터로 받습니다.
  const params: Record<string, string | number> = {
    page: 0,
    size: 50,
    sort: 'updatedAt',
  };
  const trimmed = keyword?.trim();
  if (trimmed) params.keyword = trimmed;

  const data = await api.get('/notebooks', { params });
  return unwrapList<Parameters<typeof normalizeSummary>[0]>(data).map(normalizeSummary);
};

export const getNotebook = async (notebookId: string): Promise<NotebookDetail> => {
  const data = await api.get<Parameters<typeof normalizeDetail>[0]>(`/notebooks/${notebookId}`);
  return normalizeDetail(data);
};

// NB01_NOTE03: title/description 둘 다 선택값이라 부분 수정으로 씁니다.
export const updateNotebook = (notebookId: string, patch: { title?: string; description?: string }) =>
  api.patch<NotebookDetail>(`/notebooks/${notebookId}`, patch);

export const deleteNotebook = (notebookId: string) => api.delete<void>(`/notebooks/${notebookId}`);

// ── 소스 (SRC01/SRC02) ─────────────────────────────────────
export const uploadFileSource = (notebookId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  // formData.append('fileName', file.name);
  // ⚠️ Content-Type을 여기서 직접 지정하면 안 됩니다. multipart는 각 파트를 구분하는
  // boundary 문자열이 필요한데, 'multipart/form-data'만 수동으로 넣으면 boundary가 빠진
  // 채로 전송되어 백엔드가 파일 파트를 파싱하지 못합니다(=업로드가 조용히 실패). 헤더를
  // 아예 지정하지 않아야 브라우저/axios가 boundary까지 채워서 자동으로 설정해 줍니다.
  return api.post<{ sourceId: string; status: SourceStatus }>(`/notebooks/${notebookId}/sources`, formData);
};

export const addUrlSource = (notebookId: string, url: string) =>
  api.post<{ sourceId: string; status: SourceStatus; title?: string }>(`/notebooks/${notebookId}/sources/url`, {
    url,
  });

export const addTextSource = (notebookId: string, content: string, title?: string) =>
  api.post<{ sourceId: string; status: SourceStatus }>(`/notebooks/${notebookId}/sources/text`, {
    content,
    title,
  });

export const listSources = async (notebookId: string): Promise<Source[]> => {
  const data = await api.get(`/notebooks/${notebookId}/sources`);
  return unwrapList<Source>(data);
};

export const deleteSource = (notebookId: string, sourceId: string) =>
  api.delete<void>(`/notebooks/${notebookId}/sources/${sourceId}`);

// 라이브러리 페이지용: 모든 노트북의 소스를 한 번에 모아옵니다.
// 명세엔 "전체 소스 목록" 엔드포인트가 없어서, 노트북 목록 → 각 노트북 상세를 조회해 펼칩니다.
export interface SourceWithNotebook extends Source {
  notebookId: string;
  notebookTitle: string;
}

export const listAllSources = async (): Promise<SourceWithNotebook[]> => {
  const notebooks = await listNotebooks();
  const details = await Promise.all(
    notebooks.map((nb) =>
      getNotebook(nb.id).catch(() => null) // 하나 실패해도 나머지는 보여줍니다.
    )
  );
  return details.flatMap((detail) =>
    detail ? detail.sources.map((s) => ({ ...s, notebookId: detail.id, notebookTitle: detail.title })) : []
  );
};

// ── 채팅 (CHAT01) ──────────────────────────────────────────
export const createChatSession = (notebookId: string) =>
  api.post<{ sessionId: string; createdAt: string }>(`/notebooks/${notebookId}/chat-sessions`);

export const listChatSessions = async (notebookId: string): Promise<ChatSession[]> => {
  const data = await api.get(`/notebooks/${notebookId}/chat-sessions`);
  return unwrapList<ChatSession>(data).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

export const deleteChatSession = (sessionId: string) => api.delete<void>(`/chat-sessions/${sessionId}`);

export const getChatMessages = async (sessionId: string, limit = 10): Promise<ChatMessage[]> => {
  const data = await api.get(`/chat-sessions/${sessionId}/messages`, { params: { limit } });
  return unwrapList<ChatMessage>(data);
};

// 질문 전송 → RAG 답변 스트리밍(text/event-stream). axios/EventSource는 "POST + SSE"를
// 기본 지원하지 않아 fetch로 직접 읽습니다.
// ponytail: 스트림 자체는 표준 SSE 포맷("data: ...\n\n")으로 파싱합니다. 각 data 페이로드가
// JSON이고 citations 배열을 담고 있으면 출처로, 그렇지 않으면 답변 토큰(텍스트)으로 취급하는
// 휴리스틱입니다 — 명세에 정확한 이벤트 스키마 예시가 없어 확정할 수 없었습니다.
// 실제 응답 샘플이 확보되면 이 분기만 다듬으면 됩니다.
export async function streamChatAnswer(
  sessionId: string,
  question: string,
  onToken: (token: string) => void,
  onCitations?: (citations: Citation[]) => void
): Promise<void> {
  const accessToken = sessionStorage.getItem('accessToken');

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat-sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`채팅 응답 실패 (status: ${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const rawEvent of events) {
      const payload = rawEvent
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .join('\n');
      if (!payload) continue;

      try {
        const parsed = JSON.parse(payload);
        if (Array.isArray(parsed?.citations)) {
          onCitations?.(parsed.citations);
          continue;
        }
        onToken(typeof parsed === 'string' ? parsed : (parsed?.token ?? parsed?.content ?? ''));
      } catch {
        onToken(payload); // JSON이 아니면 순수 텍스트 토큰
      }
    }
  }
}
