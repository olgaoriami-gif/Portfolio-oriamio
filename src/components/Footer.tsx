function Footer() {
  return (
    <footer className="border-t-[length:var(--border-width)] border-[var(--color-border)] py-8 text-center text-sm text-fg-muted">
      <div className="container mx-auto px-4">
        © {new Date().getFullYear()} Portfolio. Все права защищены.
      </div>
    </footer>
  )
}

export default Footer
