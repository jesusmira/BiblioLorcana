const loadingCards = Array.from({ length: 8 }, (_, index) => index);

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-8 pb-[72px] pt-[52px] max-[720px]:px-3 max-[720px]:pt-7 max-[720px]:pb-14">
      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-6 max-[720px]:flex-col max-[720px]:items-center max-[720px]:text-center">
          <div className="flex items-center gap-[18px] max-[720px]:justify-center">
            <div className="h-[52px] w-[52px] rounded-[14px] bg-[var(--surface-strong)] shadow-[var(--float-shadow)]"></div>
            <div className="space-y-2">
              <div className="h-3 w-[160px] rounded-full bg-[var(--surface-strong)]"></div>
              <div className="h-6 w-[260px] rounded-full bg-[var(--surface-strong)]"></div>
            </div>
          </div>
          <div className="h-[42px] w-[170px] rounded-full bg-[var(--surface-strong)] shadow-[var(--float-shadow)]"></div>
        </div>
        <div className="h-4 w-[420px] max-w-full rounded-full bg-[var(--surface-strong)]"></div>
      </section>

      <section className="mt-8 animate-pulse rounded-[18px] border border-[var(--stroke)] bg-[var(--surface)] p-6 shadow-[var(--panel-shadow)] max-[600px]:p-4">
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] max-[600px]:grid-cols-1">
          <div className="h-12 rounded-[12px] bg-[var(--surface-strong)]"></div>
          <div className="h-12 rounded-[12px] bg-[var(--surface-strong)]"></div>
          <div className="h-12 rounded-[12px] bg-[var(--surface-strong)]"></div>
        </div>
      </section>

      <section className="mt-6 grid gap-[22px] [grid-template-columns:repeat(4,minmax(0,1fr))] max-[1300px]:[grid-template-columns:repeat(3,minmax(0,1fr))] max-[980px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[640px]:grid-cols-1">
        {loadingCards.map((item) => (
          <div
            key={item}
            className="flex h-[420px] flex-col gap-3 rounded-[22px] border border-[var(--stroke)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]"
          >
            <div className="aspect-[2/3] w-full rounded-[16px] bg-[var(--surface-soft)]"></div>
            <div className="h-4 w-[70%] rounded-full bg-[var(--surface-strong)]"></div>
            <div className="h-4 w-[55%] rounded-full bg-[var(--surface-strong)]"></div>
            <div className="mt-auto h-10 w-full rounded-[12px] bg-[var(--surface-soft)]"></div>
          </div>
        ))}
      </section>
    </main>
  );
}
