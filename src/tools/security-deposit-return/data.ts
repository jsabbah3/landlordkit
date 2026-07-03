import type { LegalProvenance } from "@/lib/legal";

/* ============================================================================
 * SECURITY DEPOSIT RETURN DEADLINES — STATE DATA
 * ----------------------------------------------------------------------------
 * ⚠️  REVIEW BEFORE LAUNCH. Return deadlines and itemization rules vary; some
 *     states use a different deadline when deductions are taken. `confidence`
 *     flags reliability; verify each against the cited statute.
 *
 * MODEL
 *   deadlineDays            Days after move-out to return the deposit (standard).
 *   deadlineDaysIfDeducting Optional alternate deadline when deductions apply.
 *   itemization             Whether an itemized list of deductions is required.
 *   penalty                 Short note on the penalty for non-compliance.
 * ========================================================================== */

export interface DepositReturnRule {
  deadlineDays: number;
  deadlineDaysIfDeducting?: number;
  itemization: boolean;
  penalty?: string;
  cite: LegalProvenance;
}

const V = "2026-06-01";

const rule = (
  deadlineDays: number,
  confidence: LegalProvenance["confidence"],
  statute: string,
  extra?: Partial<DepositReturnRule>,
): DepositReturnRule => ({
  deadlineDays,
  itemization: true,
  cite: { statute, lastVerified: V, confidence },
  ...extra,
});

export const DEPOSIT_RETURN: Record<string, DepositReturnRule> = {
  AL: rule(60, "low", "Ala. Code § 35-9A-201"),
  AK: rule(14, "medium", "Alaska Stat. § 34.03.070", { deadlineDaysIfDeducting: 30 }),
  AZ: rule(14, "medium", "Ariz. Rev. Stat. § 33-1321", { penalty: "Up to 2x the wrongfully withheld amount." }),
  AR: rule(60, "low", "Ark. Code § 18-16-305"),
  CA: rule(21, "high", "Cal. Civ. Code § 1950.5", { penalty: "Up to 2x the deposit for bad-faith retention." }),
  CO: rule(30, "medium", "Colo. Rev. Stat. § 38-12-103", { deadlineDaysIfDeducting: 60, penalty: "Treble damages for willful retention." }),
  CT: rule(30, "medium", "Conn. Gen. Stat. § 47a-21", { penalty: "Up to 2x the deposit." }),
  DE: rule(20, "medium", "25 Del. C. § 5514"),
  DC: rule(45, "low", "D.C. Mun. Regs. tit. 14 § 309"),
  FL: rule(15, "medium", "Fla. Stat. § 83.49", { deadlineDaysIfDeducting: 30, penalty: "Tenant must object to a claim within 15 days." }),
  GA: rule(30, "low", "Ga. Code § 44-7-34"),
  HI: rule(14, "medium", "Haw. Rev. Stat. § 521-44"),
  ID: rule(21, "low", "Idaho Code § 6-321", { deadlineDaysIfDeducting: 30 }),
  IL: rule(45, "low", "765 ILCS 710", { deadlineDaysIfDeducting: 30 }),
  IN: rule(45, "medium", "Ind. Code § 32-31-3-12"),
  IA: rule(30, "medium", "Iowa Code § 562A.12"),
  KS: rule(30, "low", "Kan. Stat. § 58-2550"),
  KY: rule(30, "low", "Ky. Rev. Stat. § 383.580"),
  LA: rule(30, "medium", "La. Rev. Stat. § 9:3251"),
  ME: rule(30, "medium", "14 M.R.S. § 6033", { penalty: "Up to 2x for bad faith." }),
  MD: rule(45, "medium", "Md. Code, Real Prop. § 8-203", { penalty: "Up to 3x plus fees for bad faith." }),
  MA: rule(30, "medium", "Mass. Gen. Laws ch. 186 § 15B", { penalty: "Up to 3x the deposit plus fees." }),
  MI: rule(30, "medium", "Mich. Comp. Laws § 554.609"),
  MN: rule(21, "medium", "Minn. Stat. § 504B.178", { penalty: "Bad-faith retention can incur punitive damages." }),
  MS: rule(45, "low", "Miss. Code § 89-8-21"),
  MO: rule(30, "medium", "Mo. Rev. Stat. § 535.300", { penalty: "Up to 2x for wrongful withholding." }),
  MT: rule(30, "medium", "Mont. Code § 70-25-202", { deadlineDaysIfDeducting: 30 }),
  NE: rule(14, "medium", "Neb. Rev. Stat. § 76-1416"),
  NV: rule(30, "medium", "Nev. Rev. Stat. § 118A.242"),
  NH: rule(30, "medium", "N.H. Rev. Stat. § 540-A:7"),
  NJ: rule(30, "medium", "N.J. Stat. § 46:8-21.1", { penalty: "Double damages plus fees for wrongful withholding." }),
  NM: rule(30, "medium", "N.M. Stat. § 47-8-18"),
  NY: rule(14, "high", "N.Y. Gen. Oblig. Law § 7-108", { penalty: "Loss of the right to retain any deposit if late." }),
  NC: rule(30, "medium", "N.C. Gen. Stat. § 42-52"),
  ND: rule(30, "low", "N.D. Cent. Code § 47-16-07.1"),
  OH: rule(30, "medium", "Ohio Rev. Code § 5321.16", { penalty: "Up to 2x the wrongfully withheld amount plus fees." }),
  OK: rule(45, "low", "Okla. Stat. tit. 41 § 115"),
  OR: rule(31, "medium", "Or. Rev. Stat. § 90.300"),
  PA: rule(30, "medium", "68 Pa. Stat. § 250.512", { penalty: "Up to 2x for retention beyond 30 days." }),
  RI: rule(20, "medium", "R.I. Gen. Laws § 34-18-19"),
  SC: rule(30, "low", "S.C. Code § 27-40-410"),
  SD: rule(14, "medium", "S.D. Codified Laws § 43-32-24", { deadlineDaysIfDeducting: 45 }),
  TN: rule(30, "low", "Tenn. Code § 66-28-301"),
  TX: rule(30, "medium", "Tex. Prop. Code § 92.103", { penalty: "Up to 3x plus $100 and fees for bad faith." }),
  UT: rule(30, "medium", "Utah Code § 57-17-3"),
  VT: rule(14, "medium", "9 V.S.A. § 4461"),
  VA: rule(45, "medium", "Va. Code § 55.1-1226"),
  WA: {
    deadlineDays: 30,
    itemization: true,
    penalty: "Full deposit forfeited for a late/missing statement; up to 2x for intentional refusal.",
    cite: {
      statute: "Rev. Code Wash. § 59.18.280",
      statuteUrl: "https://app.leg.wa.gov/rcw/default.aspx?cite=59.18.280",
      lastVerified: "2026-07-02",
      confidence: "high",
    },
  },
  WV: rule(60, "low", "W. Va. Code § 37-6A-2", { deadlineDaysIfDeducting: 45 }),
  WI: rule(21, "medium", "Wis. Stat. § 134.06"),
  WY: rule(30, "low", "Wyo. Stat. § 1-21-1208", { deadlineDaysIfDeducting: 60 }),
};

export const getDepositReturnRule = (code: string): DepositReturnRule | undefined =>
  DEPOSIT_RETURN[code];
export const depositReturnStateCodes = (): string[] => Object.keys(DEPOSIT_RETURN);
