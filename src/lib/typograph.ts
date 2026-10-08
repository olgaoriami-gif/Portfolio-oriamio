const shortWords =
  'а|в|во|и|к|ко|с|со|у|о|об|от|до|из|за|на|по|под|над|для|без|при|про|через|как|но|не|ни|же|ли'

const shortWordPattern = new RegExp(
  `(^|[\\s([{—–-])(${shortWords})\\s+`,
  'giu',
)

export function typograph(text: string) {
  return text.replace(shortWordPattern, '$1$2\u00a0')
}
