import { create } from 'zustand'

const STORAGE_KEY = 'bondtogether_books'
const PENDING_STORAGE_KEY = 'bondtogether_pending_books'

function loadStoredBooks() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadPendingBooks() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(PENDING_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const useBooksStore = create((set) => ({
  books: loadStoredBooks(),
  pendingBooks: loadPendingBooks(),
  addBook: (book) => {
    const normalized = {
      id: book.id ?? `book-${Date.now()}`,
      title: book.title,
      author: book.author,
      link: book.link,
      category: book.category ?? 'Featured',
      description: book.description ?? '',
      managers: book.managers ?? [],
      coverImage: book.coverImage ?? null,
      addedBy: book.addedBy ?? 'admin',
      createdAt: new Date().toISOString(),
    }

    set((state) => {
      const nextBooks = [normalized, ...state.books]
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBooks))
      }
      return { books: nextBooks }
    })
  },
  addPendingBook: (book) => {
    const normalized = {
      id: `pending-${Date.now()}`,
      title: book.title,
      author: book.author,
      link: book.link,
      category: book.category ?? 'Pending review',
      description: book.description ?? '',
      managers: book.managers ?? [],
      coverImage: book.coverImage ?? null,
      addedBy: book.addedBy ?? 'premium-user',
      createdAt: new Date().toISOString(),
    }

    set((state) => {
      const nextPendingBooks = [normalized, ...state.pendingBooks]
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(nextPendingBooks))
      }
      return { pendingBooks: nextPendingBooks }
    })
  },
}))

export default useBooksStore
