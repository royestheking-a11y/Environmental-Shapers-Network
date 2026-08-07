import re

donate_path = "/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/pages/Donate.tsx"
cta_path = "/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/components/home/DonateCTASection.tsx"

# 1. Update Donate.tsx
with open(donate_path, "r") as f:
    donate_content = f.read()

currency_configs = """
const currencyConfigs = {
  BDT: {
    symbol: "৳",
    tiers: [
      { amount: 1000, label: "Seedling", trees: 2, desc: "Plant 2 trees" },
      { amount: 2500, label: "Seed Planter", trees: 5, desc: "Support a nursery" },
      { amount: 5000, label: "Grove Maker", trees: 10, desc: "Restore 0.05 acres" },
      { amount: 10000, label: "Guardian", trees: 20, desc: "Fund a school session" },
      { amount: 25000, label: "Forest Builder", trees: 50, desc: "Sponsor a leader" },
      { amount: 50000, label: "Champion", trees: 100, desc: "Nursery for 1 month" },
      { amount: 100000, label: "Defender", trees: 200, desc: "Climate workshop" },
      { amount: 500000, label: "Protector", trees: 1000, desc: "Full program" },
    ],
    treeCost: 500
  },
  USD: {
    symbol: "$",
    tiers: [
      { amount: 10, label: "Seedling", trees: 2, desc: "Plant 2 trees" },
      { amount: 25, label: "Seed Planter", trees: 5, desc: "Support a nursery" },
      { amount: 50, label: "Grove Maker", trees: 10, desc: "Restore 0.05 acres" },
      { amount: 100, label: "Guardian", trees: 20, desc: "Fund a school session" },
      { amount: 250, label: "Forest Builder", trees: 50, desc: "Sponsor a leader" },
      { amount: 500, label: "Champion", trees: 100, desc: "Nursery for 1 month" },
      { amount: 1000, label: "Defender", trees: 200, desc: "Climate workshop" },
      { amount: 5000, label: "Protector", trees: 1000, desc: "Full program" },
    ],
    treeCost: 5
  },
  EUR: {
    symbol: "€",
    tiers: [
      { amount: 10, label: "Seedling", trees: 2, desc: "Plant 2 trees" },
      { amount: 25, label: "Seed Planter", trees: 5, desc: "Support a nursery" },
      { amount: 50, label: "Grove Maker", trees: 10, desc: "Restore 0.05 acres" },
      { amount: 100, label: "Guardian", trees: 20, desc: "Fund a school session" },
      { amount: 250, label: "Forest Builder", trees: 50, desc: "Sponsor a leader" },
      { amount: 500, label: "Champion", trees: 100, desc: "Nursery for 1 month" },
      { amount: 1000, label: "Defender", trees: 200, desc: "Climate workshop" },
      { amount: 5000, label: "Protector", trees: 1000, desc: "Full program" },
    ],
    treeCost: 5
  }
};
"""

# Replace tiers definition
donate_content = re.sub(
    r"const tiers = \[.*?\];", 
    currency_configs, 
    donate_content, 
    flags=re.DOTALL
)

# Add currency state to saveDonation
donate_content = donate_content.replace(
    "method: data.method,",
    "method: data.method,\n      currency: data.currency,"
)
donate_content = donate_content.replace(
    "amount, method: payMethod",
    "amount, method: payMethod, currency"
)

# Add currency state
donate_content = donate_content.replace(
    "export default function Donate() {",
    """export default function Donate() {
  const [currency, setCurrency] = useState<"BDT" | "USD" | "EUR">("BDT");
  const activeCurrency = currencyConfigs[currency];
  const activeTiers = activeCurrency.tiers;
"""
)

# Change default selected from 100 to dynamic
donate_content = donate_content.replace(
    "const [selected, setSelected] = useState(100);",
    "const [selected, setSelected] = useState(0);" # we will handle initial in a better way, or just let it be 0 until picked
)

# Replace trees calculation
donate_content = donate_content.replace(
    "const trees = Math.floor(amount / 5);",
    "const trees = Math.floor(amount / activeCurrency.treeCost);"
)

# Render currency selector in step 1 before frequency
currency_selector_jsx = """
                    <div className="flex bg-[#F6FBF8] rounded-xl p-1 mb-6 border border-gray-100">
                      {(["BDT", "USD", "EUR"] as const).map((c) => (
                        <button key={c} onClick={() => { setCurrency(c); setSelected(0); setCustom(""); }} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${currency === c ? "bg-[#4CAF50] text-white shadow-md" : "text-gray-500 hover:text-gray-800"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
"""
donate_content = donate_content.replace(
    "{/* Frequency */}",
    "{/* Currency */}\n" + currency_selector_jsx + "\n                    {/* Frequency */}"
)

# Replace tiers.map with activeTiers.map
donate_content = donate_content.replace("tiers.map((tier)", "activeTiers.map((tier)")

# Replace symbols
donate_content = donate_content.replace('["$" + amount, "Donated"]', '[`${activeCurrency.symbol}${amount}`, "Donated"]')
donate_content = donate_content.replace('<span>${tier.amount}</span>', '<span>{activeCurrency.symbol}{tier.amount}</span>')
donate_content = donate_content.replace('<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>', '<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{activeCurrency.symbol}</span>')
donate_content = donate_content.replace('<span>${tier.amount}</span>', '<span>{activeCurrency.symbol}{tier.amount}</span>')
donate_content = donate_content.replace('Your ${amount} impact', 'Your {activeCurrency.symbol}{amount} impact')
donate_content = donate_content.replace('Continue with ${amount || 0}', 'Continue with {activeCurrency.symbol}{amount || 0}')
donate_content = donate_content.replace('your ${amount} donation', 'your {activeCurrency.symbol}{amount} donation')
donate_content = donate_content.replace('<strong>${amount}</strong>', '<strong>{activeCurrency.symbol}{amount}</strong>')
donate_content = donate_content.replace('Pay ${amount} Securely', 'Pay {activeCurrency.symbol}{amount} Securely')
donate_content = donate_content.replace('`$${amount}`', '`${activeCurrency.symbol}${amount}`')
donate_content = donate_content.replace('${amount}{frequency', '{activeCurrency.symbol}{amount}{frequency')
donate_content = donate_content.replace('text-lg">${amount}</div>', 'text-lg">{activeCurrency.symbol}{amount}</div>')

with open(donate_path, "w") as f:
    f.write(donate_content)

# 2. Update DonateCTASection.tsx
with open(cta_path, "r") as f:
    cta_content = f.read()

cta_currency_configs = """
const currencyConfigs = {
  BDT: {
    symbol: "৳",
    tiers: [
      { amount: 2500, label: "Seed Planter", impact: "Plants 5 trees in a reforestation zone", icon: Leaf, popular: false },
      { amount: 10000, label: "Grove Guardian", impact: "Restores 0.1 acres of degraded habitat", icon: TreePine, popular: true },
      { amount: 50000, label: "Forest Champion", impact: "Supports a community nursery for 1 month", icon: Globe2, popular: false },
      { amount: 100000, label: "Earth Defender", impact: "Funds a youth climate workshop in a school", icon: Users, popular: false },
    ]
  },
  USD: {
    symbol: "$",
    tiers: [
      { amount: 25, label: "Seed Planter", impact: "Plants 5 trees in a reforestation zone", icon: Leaf, popular: false },
      { amount: 100, label: "Grove Guardian", impact: "Restores 0.1 acres of degraded habitat", icon: TreePine, popular: true },
      { amount: 500, label: "Forest Champion", impact: "Supports a community nursery for 1 month", icon: Globe2, popular: false },
      { amount: 1000, label: "Earth Defender", impact: "Funds a youth climate workshop in a school", icon: Users, popular: false },
    ]
  },
  EUR: {
    symbol: "€",
    tiers: [
      { amount: 25, label: "Seed Planter", impact: "Plants 5 trees in a reforestation zone", icon: Leaf, popular: false },
      { amount: 100, label: "Grove Guardian", impact: "Restores 0.1 acres of degraded habitat", icon: TreePine, popular: true },
      { amount: 500, label: "Forest Champion", impact: "Supports a community nursery for 1 month", icon: Globe2, popular: false },
      { amount: 1000, label: "Earth Defender", impact: "Funds a youth climate workshop in a school", icon: Users, popular: false },
    ]
  }
};
"""

cta_content = re.sub(
    r"const donationTiers = \[.*?\];", 
    cta_currency_configs, 
    cta_content, 
    flags=re.DOTALL
)

# Add state hook for CTA
cta_content = cta_content.replace(
    'import { useRef } from "react";',
    'import { useRef, useState } from "react";'
)

cta_content = cta_content.replace(
    'export function DonateCTASection() {',
    'export function DonateCTASection() {\n  const [currency, setCurrency] = useState<"BDT" | "USD" | "EUR">("BDT");\n  const activeCurrency = currencyConfigs[currency];\n  const activeTiers = activeCurrency.tiers;'
)

# Render currency toggle
cta_currency_jsx = """
        {/* Currency Selector */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="flex items-center gap-2 bg-white rounded-full p-1.5 shadow-sm border border-gray-200">
            {(["BDT", "USD", "EUR"] as const).map(c => (
              <button 
                key={c} 
                onClick={() => setCurrency(c)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currency === c ? 'bg-[#0A1A0E] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
"""

cta_content = cta_content.replace(
    '{/* Donation Tiers */}',
    cta_currency_jsx + '\n        {/* Donation Tiers */}'
)

cta_content = cta_content.replace("donationTiers.map((tier", "activeTiers.map((tier")
cta_content = cta_content.replace('<span className="text-gray-400 font-bold text-xl mb-1">$</span>', '<span className="text-gray-400 font-bold text-xl mb-1">{activeCurrency.symbol}</span>')

with open(cta_path, "w") as f:
    f.write(cta_content)

print("Updates complete.")
