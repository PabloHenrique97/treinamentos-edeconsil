// Extrai o ID de um vídeo do YouTube
// a partir de qualquer formato de URL
export function extrairYoutubeId(
  url: string
): string | null {
  if (!url) return null
  const padroes = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ]
  for (const p of padroes) {
    const m = url.match(p)
    if (m && m[1]) return m[1]
  }
  // Se já for só o ID (11 chars)
  if (/^[\w-]{11}$/.test(url.trim()))
    return url.trim()
  return null
}

// Monta a URL de embed do YouTube
export function montarEmbedUrl(
  url: string
): string | null {
  const id = extrairYoutubeId(url)
  if (!id) return null
  return `https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&modestbranding=1`
}

// Detecta se uma URL é do YouTube
export function isYoutube(url: string): boolean {
  return extrairYoutubeId(url) !== null
}
