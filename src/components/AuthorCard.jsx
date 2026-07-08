import Badge from './ui/Badge'
import Button from './ui/Button'

function AuthorCard({ author }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-6 h-52 rounded-[1.75rem] bg-gradient-to-br from-purple-500 to-amber-400" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold text-night">{author.name}</h3>
            <p className="text-sm text-slate-600">{author.genre}</p>
          </div>
          <Badge variant="accent">Verified</Badge>
        </div>
        <p className="text-slate-600">{author.bio}</p>
        <div className="flex flex-wrap gap-3">
          {author.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <Button variant="primary" className="mt-3 w-full">View profile</Button>
      </div>
    </article>
  )
}

export default AuthorCard
