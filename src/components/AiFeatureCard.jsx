function AiFeatureCard({ title, description, accent }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${accent}`}>{title}</div>
      <p className="mt-4 text-slate-600">{description}</p>
    </div>
  )
}

export default AiFeatureCard
