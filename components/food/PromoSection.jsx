export default function PromoSection() {
  return (
    <>
      <span className="text-[#FF6868] text-xl font-bold">Promo</span>
      <div className="flex items-start mb-[41px] justify-center">
        <span className="text-black text-6xl font-bold w-[664px] mr-[361px]">Udah Kenyang, Banyak Promo Lagi~</span>
        <span className="text-[#7F7D7D] text-2xl font-bold mt-[111px]">See All &gt;</span>
      </div>
      <div className="flex items-start pl-7 mb-[92px] justify-center">
        <div
          className="flex flex-col shrink-0 items-center bg-white pt-1 mr-[27px] rounded-[30px]"
          style={{
            boxShadow: "7px 12px 43px #00000024",
          }}
        >
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/zmy6jfev_expires_30_days.png"
            className="w-[537px] h-[293px] object-fill"
          />
        </div>
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/3njduqhh_expires_30_days.png"
          className="w-[537px] h-[297px] mr-14 object-fill"
        />
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/sb7gsvjv_expires_30_days.png"
          className="w-40 h-[297px] object-fill"
        />
      </div>
    </>
  )
}
