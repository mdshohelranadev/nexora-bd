export function TrustSection() {
  const items = [
    { title: 'Fast Delivery', subtitle: 'All 64 districts', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
    )},
    { title: 'Easy Returns', subtitle: '7-day policy', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
    )},
    { title: 'Secure Payment', subtitle: 'Cash on Delivery', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    )},
    { title: '24/7 Support', subtitle: 'Dedicated help', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
  ];

  return (
    <div className="w-full py-1">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        {items.map((item, index) => (
          // ✅ FIX: rounded-lg (kom round), p-2.5 (compact)
          <div key={index} className="flex items-center justify-between gap-2 rounded-lg bg-white p-2.5 shadow-sm border border-line/50">
            <div className="flex items-center gap-2.5">
              {/* ✅ FIX: bg-primary-50 remove kora hoyeche (transparent), icon size boro kora hoyeche */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-ink sm:text-xs">{item.title}</span>
                <span className="text-[9px] text-muted sm:text-[10px]">{item.subtitle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}