export default function PricingSection() {
  const plans = [
    {
      title: "Standard",
      subtitle: "Default service",
      price: "$0",
      note: "Min. spend $1199 and for selected cities only.",
      featured: false,
      items: [
        { text: "Ground floor / lobby / first dry area", included: true },
        { text: "Unpacking", included: false },
        { text: "Assembly", included: false },
        { text: "Garbage removal", included: false },
        { text: "Moving existing furniture", included: false },
      ],
    },
    {
      title: "Room of Choice",
      subtitle: "Placed where you want it",
      price: "+$50–$70",
      note: "Min. spend $1199 and for selected cities only.",
      featured: false,
      items: [
        { text: "Room of your choice", included: true },
        { text: "Up to 2 flights of stairs", included: true },
        { text: "Unpacking", included: false },
        { text: "Assembly", included: false },
        { text: "Garbage removal", included: false },
        { text: "Moving existing furniture", included: false },
      ],
    },
    {
      title: "White Glove",
      subtitle: "Full service, sit back and relax",
      price: "+$100–$150",
      note: "Min. spend $1199 and for selected cities only.",
      featured: true,
      badge: "Most popular",
      items: [
        { text: "Room of your choice", included: true },
        { text: "Up to 2 flights of stairs", included: true },
        { text: "Unpacking", included: true },
        { text: "Full assembly", included: true },
        { text: "Garbage removal", included: true },
        { text: "Moving existing furniture", included: false },
      ],
    },
  ];

  return (
    <section className="bg-[#faf7f2] px-5 py-14 md:px-10 lg:px-12 delivery_pricing">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`rounded-[28px] border bg-white p-8 md:p-10 ${
                plan.featured
                  ? "border-[#5a84ff] shadow-[0_0_0_1px_rgba(90,132,255,0.15)]"
                  : "border-[#ddd6cf]"
              }`}
            >
              {plan.badge && (
                <div className="mb-6 inline-flex rounded-full bg-[#e8efff] px-5 py-2 text-sm font-medium text-[#3d6df2]">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-[2rem] leading-tight text-[#3e140d]">
                {plan.title}
              </h3>

              <p className="mt-4 text-lg text-[#5a3a32]">{plan.subtitle}</p>

              <div className="mt-8 text-[2.8rem] leading-none text-[#3e140d] md:text-[3.4rem]">
                {plan.price}
              </div>

              <p className="mt-4 text-base leading-relaxed text-[#6d5a54]">
                {plan.note}
              </p>

              <div className="my-8 h-px bg-[#e7dfd8]" />

              <ul className="space-y-4">
                {plan.items.map((item) => (
                  <li
                    key={item.text}
                    className={`flex items-start gap-3 text-[1.05rem] ${
                      item.included ? "text-[#3e140d]" : "text-[#8f8079]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 text-xl leading-none ${
                        item.included ? "text-[#008768]" : "text-[#8f8079]"
                      }`}
                    >
                      {item.included ? "✓" : "×"}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
