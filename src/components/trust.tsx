import Image from "next/image";

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
            <Image src="/USAID.png" alt="USAID" width={160} height={160} className="w-40 h-40 object-contain" />
          </div>
          <div className="w-50 h-25 rounded flex items-center justify-center">
            <Image src="/FGC.png" alt="First Global" width={200} height={100} className="w-50 h-50 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <Image src="/habitat.png" alt="Habitat for Humanity" width={160} height={160} className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <Image src="/pact.jpg" alt="Pact" width={160} height={160} className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <Image src="/UNICEF.png" alt="UNICEF" width={160} height={160} className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <Image src="/kirirom.png" alt="Kirirom Institute" width={160} height={160} className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <Image src="/AUPP.png" alt="ARUPP" width={160} height={160} className="w-40 h-40 object-contain" />
          </div>
          <div className="w-40 h-40 rounded flex items-center justify-center">
            <Image src="/KE.png" alt="KE" width={160} height={160} className="w-40 h-40 object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}
