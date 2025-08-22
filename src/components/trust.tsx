export function TrustSection() {
  return (
    <div className="py-16 bg-white-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <div className="bg-red-400 text-white px-6 py-3 font-bold text-lg inline-block">
            Trusted by leading nonprofits
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          <div className="w-40 h-40 rounded-full flex items-center justify-center">
            <img src="USAID.png" alt="USAID" className="w-40 h-40 object-contain" />
          </div>
          <div className="w-50 h-25 rounded flex items-center justify-center">
            <img src="FGC.png" alt="First Global" className="w-50 h-50 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <img src="habitat.png" alt="Habitat for Humanity" className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <img src="pact.jpg" alt="Pact" className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <img src="UNICEF.png" alt="UNICEF" className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <img src="kirirom.png" alt="Kirirom Institute" className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <img src="AUPP.png" alt="ARUPP" className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <img src="KE.png" alt="KE" className="w-40 h-40 object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}
