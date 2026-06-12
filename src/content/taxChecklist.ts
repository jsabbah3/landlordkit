import type { Block } from "@/lib/pdf/pdfDoc";

/**
 * Lead magnet: "Landlord Year-End Tax Prep Checklist" — generated client-side
 * as a PDF after email signup. General information, not tax advice.
 */
export const TAX_CHECKLIST_BLOCKS: Block[] = [
  { type: "title", text: "Landlord Year-End Tax Prep Checklist" },
  { type: "paragraph", text: "A one-page checklist for small landlords (1–10 units). Work top to bottom in December–January and hand your preparer a clean folder. General information only — not tax advice; confirm specifics with a tax professional." },
  { type: "rule" },

  { type: "heading", text: "1. Income — gather every dollar received" },
  { type: "paragraph", text: "[ ] Rent collected per unit, by month (bank statements or your rent ledger)\n[ ] Late fees, pet fees, parking, laundry, and other income\n[ ] Security deposits you KEPT this year (kept deposits are income; held deposits are not)\n[ ] First/last month prepayments received this year\n[ ] 1099-K forms from payment apps (Venmo/Zelle/PayPal) if you collect rent there" },

  { type: "heading", text: "2. Expenses — the deductions most landlords miss" },
  { type: "paragraph", text: "[ ] Mortgage interest (Form 1098 from your lender)\n[ ] Property taxes and insurance premiums\n[ ] Repairs and maintenance (keep receipts — repairs deduct now; improvements depreciate)\n[ ] Mileage to/from the property (log: date, purpose, miles)\n[ ] Utilities you paid, HOA dues, landscaping, snow removal, pest control\n[ ] Advertising, tenant screening fees, legal and accounting fees\n[ ] Software, tools, and home-office share if you qualify\n[ ] Travel for property management (keep itineraries + receipts)" },

  { type: "heading", text: "3. Depreciation — don't leave it on the table" },
  { type: "paragraph", text: "[ ] Building basis depreciated over 27.5 years (residential)\n[ ] New appliances, flooring, roofs added this year — list each with date + cost\n[ ] Ask your preparer about bonus depreciation / Section 179 for qualifying items" },

  { type: "heading", text: "4. Records to put in the folder" },
  { type: "paragraph", text: "[ ] Lease agreements signed or renewed this year\n[ ] Rent receipts / payment ledger export\n[ ] Security deposit statements (held, returned, or applied — with itemizations)\n[ ] Closing statements for any property bought, sold, or refinanced\n[ ] Contractor invoices over $600 (you may owe them a 1099-NEC)" },

  { type: "heading", text: "5. January deadlines" },
  { type: "paragraph", text: "[ ] Send 1099-NEC to contractors paid $600+ (due Jan 31)\n[ ] Pay Q4 estimated taxes if required (due ~Jan 15)\n[ ] Send tenants any required deposit-interest statements for the year" },

  { type: "rule" },
  { type: "paragraph", text: "Generate rent receipts, deposit-interest statements, and compliant notices free at getlandlordkit.com — each tool cites your state's statute." },
];
