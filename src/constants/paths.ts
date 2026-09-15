// ============================================================
// paths.ts — サブディレクトリ公開用パス定数
// 公開URL: https://hit-tool.com/travel-checklist （末尾スラッシュなし）
//
// Next.js の basePath は Link / router / next/image には自動付与される。
// アプリ内ルートは /travel-checklist を含めないこと。
// public/ を <img>・favicon・OGP・fetch で参照する場合のみ手動付与する。
// ============================================================

/** 公開パス（末尾スラッシュなし）。共有URL・public アセット用 */
export const APP_BASE_PATH = '/travel-checklist'

/** コラムなどからツールTOP（テンプレート選択）へ戻すクエリ */
export const TOOL_HOME_QUERY_KEY = 'home'
export const TOOL_HOME_QUERY_VALUE = '1'

/** `<Link href={TOOL_HOME_HREF}>` 用（basePath は自動付与） */
export const TOOL_HOME_HREF = `/?${TOOL_HOME_QUERY_KEY}=${TOOL_HOME_QUERY_VALUE}`

/** public/ 配下の静的アセットURL（basePath を手動付与） */
export function publicAssetUrl(filename: string): string {
  const name = filename.replace(/^\//, '')
  return `${APP_BASE_PATH}/${name}`
}

export function isToolHomeQuery(value: string | null): boolean {
  return value === TOOL_HOME_QUERY_VALUE
}
