export type SearchParams = Record<string, string | string[] | undefined>;

export function getParam(sp: SearchParams, key: string): string | undefined {
  const v = sp[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

export function hrefWith(sp: SearchParams, patch: Record<string, string | null | undefined>): string {
  const params = new URLSearchParams();

  // 현재 params 복사
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params.set(k, v);
    if (Array.isArray(v) && v[0]) params.set(k, v[0]);
  }

  // patch 적용
  for (const [k, v] of Object.entries(patch)) {
    if (v === null) params.delete(k);
    else if (typeof v === "string") params.set(k, v);
    else if (v === undefined) {
      // no-op
    }
  }

  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}
