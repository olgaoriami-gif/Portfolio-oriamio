import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-fg-secondary">Страница не найдена</p>
      <Link
        to="/"
        className="mt-8 inline-block text-accent hover:underline"
      >
        Вернуться на главную
      </Link>
    </section>
  )
}

export default NotFound
