// Elemento assinatura da tela do cliente: em vez de uma barra de progresso
// genérica, cada série concluída "empilha" uma anilha — remete direto ao
// objeto real do treino (peso/anilha) em vez de uma métrica abstrata.

export default function ExercicioCard({ nome, series, repeticoes, cargaSugeridaKg, feitas, onMarcarSerie }) {
  return (
    <div className="mb-3 flex items-end justify-between rounded border border-border bg-surface p-4">
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-base">{nome}</h3>
        <p className="m-0 text-sm text-muted">
          <span className="font-data text-ink">{series}x{repeticoes}</span>
          {' · '}
          <span className="font-data text-ink">{cargaSugeridaKg ?? '—'}kg</span>
        </p>
        <button
          onClick={onMarcarSerie}
          disabled={feitas >= series}
          className="self-start rounded bg-ink px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {feitas >= series ? 'Concluído' : 'Marcar série'}
        </button>
      </div>

      <div
        className="flex w-12 flex-col-reverse items-center gap-[3px]"
        aria-label={`${feitas} de ${series} séries feitas`}
      >
        {Array.from({ length: series })
          .map((_, i) => {
            const preenchida = i < feitas
            return (
              <div
                key={i}
                className={`h-2 rounded transition-colors duration-150 ${preenchida ? 'bg-accent' : 'bg-border'}`}
                style={{ width: 40 - i * 3 }}
              />
            )
          })
          .reverse()}
      </div>
    </div>
  )
}
