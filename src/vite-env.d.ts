/// <reference types="vite/client" />

declare module 'virtual:portfolio-drafts' {
  const ids: string[]
  export default ids
}

declare module 'virtual:portfolio-order' {
  const entries: { id: string; size?: string }[]
  export default entries
}
