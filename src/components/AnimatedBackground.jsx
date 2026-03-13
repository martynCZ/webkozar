function AnimatedBackground() {
  return (
     <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0118] via-[#0d0221] to-[#050010]" />   
      <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500/30 via-purple-600/20 to-transparent rounded-full blur-[120px] animate-pulse" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#0EC3BF]/20 via-purple-500/15 to-transparent rounded-full blur-[150px] animate-pulse" 
           style={{ animationDuration: '12s', animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/25 via-cyan-400/15 to-transparent rounded-full blur-[130px] animate-pulse" 
           style={{ animationDuration: '10s', animationDelay: '4s' }} />  
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-fuchsia-500/20 via-[#0EC3BF]/15 to-transparent rounded-full blur-[100px] animate-pulse" 
           style={{ animationDuration: '15s', animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />
    </div>
  )
}

export default AnimatedBackground