import Button from './ui/Button'

function AiAssistantCard() {
  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-purple-950 to-night p-8 text-white shadow-glow">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-[2rem] bg-white/10 p-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">AI Reading Assistant</p>
            <h2 className="mt-4 text-3xl font-semibold">Ask anything about your books</h2>
          </div>
          <div className="rounded-3xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white">Always on</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            'Explain this chapter',
            'Summarize the page',
            'Who is this character?',
            'Give examples from the text',
          ].map((item) => (
            <div key={item} className="rounded-3xl bg-white/10 p-5 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto text-night bg-white">Open AI chat</Button>
          <Button variant="primary" size="lg" className="w-full sm:w-auto">Start personalized recommendations</Button>
        </div>
      </div>
    </div>
  )
}

export default AiAssistantCard
