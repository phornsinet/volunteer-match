export function StatisticsSection() {
  return (
    <div className="py-16 bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">100K</div>
            <div className="text-sm md:text-base">Monthly Visitors</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">550K</div>
            <div className="text-sm md:text-base">Volunteers connected</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">250K</div>
            <div className="text-sm md:text-base">Nonprofits</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">50K</div>
            <div className="text-sm md:text-base">Monthly Visitors</div>
          </div>
        </div>
      </div>
    </div>
  )
}
