export type PricingService = {
  n: string;
  slug: string;
  name: string;
  note: string;
  fixed: string;
  monthly: string;
  yearly: string;
};

export type PricingCategory = {
  number: string;
  slug: string;
  name: string;
  short: string;
  services: PricingService[];
};

const cosmetic: PricingService[] = [
  { n: '01', slug: 'professional-teeth-whitening', name: 'Professional teeth whitening', note: 'A brighter result planned around your natural shade.', fixed: '$550', monthly: '$46 / mo · 12 mo', yearly: '$550 / yr' },
  { n: '02', slug: 'porcelain-veneers-laminates', name: 'Porcelain veneers & laminates', note: 'Shape, proportion and color refined tooth by tooth.', fixed: '$1,500 / tooth', monthly: '$63 / mo · 24 mo', yearly: '$1,500 / yr' },
  { n: '03', slug: 'lumineers', name: 'Lumineers', note: 'A minimally prepared veneer option for selected smiles.', fixed: '$1,600 / tooth', monthly: '$67 / mo · 24 mo', yearly: '$1,600 / yr' },
  { n: '04', slug: 'snap-on-smile', name: 'Snap-on Smile', note: 'A removable cosmetic option designed for a complete arch.', fixed: '$2,500 / arch', monthly: '$105 / mo · 24 mo', yearly: '$2,500 / yr' },
  { n: '05', slug: 'dental-bonding', name: 'Dental bonding', note: 'Conservative reshaping for chips, spacing and uneven edges.', fixed: '$450 / tooth', monthly: '$38 / mo · 12 mo', yearly: '$450 / yr' },
  { n: '06', slug: 'tooth-contouring', name: 'Tooth contouring', note: 'Small, precise adjustments that bring the smile into balance.', fixed: '$150 / tooth', monthly: '$13 / mo · 12 mo', yearly: '$150 / yr' },
  { n: '07', slug: 'complete-smile-makeover', name: 'Complete smile makeover', note: 'A coordinated plan combining the right treatments for you.', fixed: 'From $12,000', monthly: '$334 / mo · 36 mo', yearly: '$12,000 / yr' },
];

const completeHealth: PricingService[] = [
  { n: '01', slug: 'oral-cancer-screening', name: 'Oral-cancer screening', note: 'A focused soft-tissue screening that adds a wider health signal to your routine visit.', fixed: '$150', monthly: '$13 / mo · 12 mo', yearly: '$150 / yr' },
  { n: '02', slug: 'airway-sleep-screening', name: 'Airway and sleep screening', note: 'Breathing, sleep and oral findings are considered together before the next step is planned.', fixed: '$195', monthly: '$17 / mo · 12 mo', yearly: '$195 / yr' },
  { n: '03', slug: 'artery-health-screening', name: 'Artery-health screening', note: 'A simple screening adds cardiovascular context to the complete-health conversation.', fixed: '$150', monthly: '$13 / mo · 12 mo', yearly: '$150 / yr' },
  { n: '04', slug: 'prosomnus-sleep-apnea-appliance', name: 'ProSomnus sleep-apnea appliance', note: 'A custom oral appliance pathway for selected patients who need airway support while they sleep.', fixed: '$5,750', monthly: '$160 / mo · 36 mo', yearly: '$5,750 / yr' },
];

const emergency: PricingService[] = [
  { n: '01', slug: 'same-day-emergency-dental-care', name: 'Same-day emergency dental care', note: 'Prompt assessment, clear relief options and the next practical step when something cannot wait.', fixed: 'From $250', monthly: '$21 / mo · 12 mo', yearly: '$250 / yr' },
  { n: '02', slug: 'nitrous-oxide-sedation', name: 'Nitrous oxide sedation', note: 'A familiar comfort option that helps selected patients settle into treatment while remaining responsive.', fixed: '$112', monthly: '$10 / mo · 12 mo', yearly: '$112 / yr' },
  { n: '03', slug: 'virtual-reality-anxiety-reduction', name: 'Virtual-reality anxiety reduction', note: 'A gentle distraction option that can make the sights and sounds of care feel less immediate.', fixed: '$75', monthly: '$7 / mo · 12 mo', yearly: '$75 / yr' },
];

const implants: PricingService[] = [
  { n: '01', slug: 'single-tooth-dental-implant', name: 'Single-tooth dental implant', note: 'A complete implant, abutment and crown plan for one missing tooth.', fixed: '$4,500', monthly: '$125 / mo · 36 mo', yearly: '$4,500 / yr' },
  { n: '02', slug: 'implant-supported-bridge', name: 'Implant-supported bridge', note: 'A fixed bridge anchored by implants when several adjacent teeth are missing.', fixed: 'From $7,500', monthly: '$209 / mo · 36 mo', yearly: '$7,500 / yr' },
  { n: '03', slug: 'all-on-4-implant-solution', name: 'All-on-4 implant solution', note: 'A full-arch pathway that uses four implants to support a connected restoration.', fixed: '$23,000 / arch', monthly: '$639 / mo · 36 mo', yearly: '$23,000 / yr' },
  { n: '04', slug: 'bone-grafting', name: 'Bone grafting', note: 'Site development that helps create the foundation an implant plan may require.', fixed: '$500 / site', monthly: '$42 / mo · 12 mo', yearly: '$500 / yr' },
  { n: '05', slug: 'dental-implant-restoration', name: 'Dental implant restoration', note: 'A crown and abutment restoration designed for an existing implant.', fixed: '$1,900', monthly: '$80 / mo · 24 mo', yearly: '$1,900 / yr' },
  { n: '06', slug: 'simple-tooth-extraction', name: 'Simple tooth extraction', note: 'A planned removal when a tooth can be safely accessed without surgical exposure.', fixed: '$300 / tooth', monthly: '$25 / mo · 12 mo', yearly: '$300 / yr' },
  { n: '07', slug: 'surgical-tooth-extraction', name: 'Surgical tooth extraction', note: 'A more involved removal planned around anatomy, comfort and recovery.', fixed: '$400 / tooth', monthly: '$34 / mo · 12 mo', yearly: '$400 / yr' },
  { n: '08', slug: 'wisdom-tooth-removal', name: 'Wisdom-tooth removal', note: 'Assessment and removal planning for symptomatic or poorly positioned wisdom teeth.', fixed: '$550 / tooth', monthly: '$46 / mo · 12 mo', yearly: '$550 / yr' },
];

const orthodontic: PricingService[] = [
  { n: '01', slug: 'invisalign-clear-aligners', name: 'Invisalign clear-aligner treatment', note: 'A discreet, removable alignment plan shaped around your bite, timeline and daily routine.', fixed: '$5,495', monthly: '$153 / mo · 36 mo', yearly: '$5,495 / yr' },
];

const pediatric: PricingService[] = [
  { n: '01', slug: 'first-dental-visit', name: 'First dental visit', note: 'A calm introduction that builds familiarity, trust and a positive foundation for future care.', fixed: '$150', monthly: '$13 / mo · 12 mo', yearly: '$150 / yr' },
  { n: '02', slug: 'pediatric-cleaning-exam', name: 'Pediatric cleaning and exam', note: 'Age-aware preventive care that keeps growing teeth, gums and habits moving in the right direction.', fixed: '$150', monthly: '$25 / mo · 12 mo', yearly: '$300 / yr' },
  { n: '03', slug: 'healthystart-system', name: 'HealthyStart System treatment', note: 'A guided appliance program that connects oral development, breathing and sleep as a child grows.', fixed: '$3,500', monthly: '$98 / mo · 36 mo', yearly: '$3,500 / yr' },
];

const periodontal: PricingService[] = [
  { n: '01', slug: 'gum-disease-deep-cleaning', name: 'Gum-disease treatment & deep cleaning', note: 'Focused periodontal therapy that creates a healthier foundation.', fixed: '$350 / quadrant', monthly: '$111 / mo · 12 mo', yearly: '$1,330 / yr' },
  { n: '02', slug: 'perio-protect', name: 'Perio Protect tray therapy', note: 'A custom upper-and-lower tray system that supports selected patients between visits.', fixed: '$1,200', monthly: '$50 / mo · 24 mo', yearly: '$1,200 / yr' },
];

const preventive: PricingService[] = [
  { n: '01', slug: 'professional-dental-cleaning', name: 'Professional dental cleaning', note: 'A thorough preventive cleaning that keeps the gumline easier to maintain.', fixed: '$125', monthly: '$21 / mo · 12 mo', yearly: '$250 / yr' },
  { n: '02', slug: 'routine-comprehensive-exam', name: 'Routine or comprehensive exam', note: 'A clear oral-health assessment shaped around your history and current concerns.', fixed: '$125', monthly: '$11 / mo · 12 mo', yearly: '$125 / yr' },
  { n: '03', slug: 'digital-dental-x-rays', name: 'Digital dental X-rays', note: 'Focused imaging that reveals changes an exam alone cannot show.', fixed: '$150', monthly: '$13 / mo · 12 mo', yearly: '$150 / yr' },
  { n: '04', slug: 'fluoride-treatment', name: 'Fluoride treatment', note: 'Targeted enamel support for patients who benefit from another layer of prevention.', fixed: '$48', monthly: '$8 / mo · 12 mo', yearly: '$96 / yr' },
  { n: '05', slug: 'dental-sealants', name: 'Dental sealant', note: 'A protective coating placed in deep grooves where bacteria are harder to clear.', fixed: '$75 / tooth', monthly: '$7 / mo · 12 mo', yearly: '$75 / yr' },
  { n: '06', slug: 'gum-disease-screening', name: 'Gum-disease screening', note: 'Measurements that make periodontal risk easier to understand.', fixed: '$125', monthly: '$11 / mo · 12 mo', yearly: '$125 / yr' },
  { n: '07', slug: 'custom-sports-mouthguard', name: 'Custom sports mouthguard', note: 'A fitted protective appliance made for comfort, stability and active play.', fixed: '$450', monthly: '$38 / mo · 12 mo', yearly: '$450 / yr' },
  { n: '08', slug: 'custom-night-guard', name: 'Custom night guard', note: 'A custom appliance that helps protect teeth from nighttime clenching or grinding.', fixed: '$450', monthly: '$38 / mo · 12 mo', yearly: '$450 / yr' },
  { n: '09', slug: 'laser-dentistry', name: 'Laser dentistry', note: 'A precise technology add-on used in selected procedures.', fixed: '$250 add-on', monthly: '$21 / mo · 12 mo', yearly: '$250 / yr' },
];

const recode: PricingService[] = [
  { n: '01', slug: 'recode-2-0-dental-program', name: 'ReCODE 2.0 dental program', note: 'A ReCODE-informed pathway that connects oral findings and wider health-team context.', fixed: '$1,599', monthly: '$134 / mo · 12 mo', yearly: '$1,599 / yr' },
  { n: '02', slug: 'oral-spirochete-test', name: 'Oral spirochete test', note: 'Focused oral-microbiome testing that can add context to a coordinated health conversation.', fixed: '$199', monthly: '$17 / mo · 12 mo', yearly: '$199 / yr' },
  { n: '03', slug: 'amalgam-filling-replacement', name: 'Amalgam filling replacement', note: 'Individualized replacement planning that weighs condition and material choices.', fixed: 'From $400 / tooth', monthly: '$34 / mo · 12 mo', yearly: '$400 / yr' },
];

const restorative: PricingService[] = [
  { n: '01', slug: 'full-denture', name: 'Full denture', note: 'A complete removable restoration planned around comfort and stability.', fixed: '$2,400 / arch', monthly: '$100 / mo · 24 mo', yearly: '$2,400 / yr' },
  { n: '02', slug: 'partial-denture', name: 'Partial denture', note: 'A removable restoration that replaces selected missing teeth.', fixed: 'From $1,800 / arch', monthly: '$75 / mo · 24 mo', yearly: '$1,800 / yr' },
  { n: '03', slug: 'tooth-colored-dental-filling', name: 'Tooth-colored dental filling', note: 'A conservative repair designed to blend naturally.', fixed: 'From $255 / tooth', monthly: '$22 / mo · 12 mo', yearly: '$255 / yr' },
  { n: '04', slug: 'dental-crown', name: 'Dental crown', note: 'Full-coverage protection that restores strength and function.', fixed: '$1,530 / tooth', monthly: '$64 / mo · 24 mo', yearly: '$1,530 / yr' },
  { n: '05', slug: 'dental-bridge', name: 'Dental bridge', note: 'A three-unit fixed restoration that reconnects the bite.', fixed: '$4,500 / 3-unit', monthly: '$125 / mo · 36 mo', yearly: '$4,500 / yr' },
  { n: '06', slug: 'full-mouth-reconstruction', name: 'Full-mouth reconstruction', note: 'A phased plan for repair needs that span the full mouth.', fixed: 'From $25,000', monthly: '$695 / mo · 36 mo', yearly: '$25,000 / yr' },
  { n: '07', slug: 'root-canal-treatment-coordination', name: 'Root-canal treatment and coordination', note: 'Endodontic treatment and restorative follow-through as one connected path.', fixed: 'From $1,025 / tooth', monthly: '$43 / mo · 24 mo', yearly: '$1,025 / yr' },
];

const wellness: PricingService[] = [
  { n: '01', slug: 'juice-plus-wellness-program', name: 'Juice Plus wellness program', note: 'A non-clinical subscription with access to the product range and coordinator support.', fixed: '$72', monthly: '$65 / month · 12 months', yearly: '$780 / year' },
];

export const pricingCategories: PricingCategory[] = [
  { number: '01', slug: 'complete-health-airway', name: 'Complete Health & Airway', short: 'Complete health', services: completeHealth },
  { number: '02', slug: 'cosmetic-dentistry', name: 'Cosmetic Dentistry', short: 'Cosmetic', services: cosmetic },
  { number: '03', slug: 'emergency-comfort', name: 'Emergency & Comfort', short: 'Emergency', services: emergency },
  { number: '04', slug: 'implants-oral-surgery', name: 'Implants & Oral Surgery', short: 'Implants', services: implants },
  { number: '05', slug: 'orthodontic-dentistry', name: 'Orthodontic Dentistry', short: 'Orthodontic', services: orthodontic },
  { number: '06', slug: 'pediatric-developmental', name: 'Pediatric & Developmental', short: 'Pediatric', services: pediatric },
  { number: '07', slug: 'periodontal-dentistry', name: 'Periodontal Dentistry', short: 'Periodontal', services: periodontal },
  { number: '08', slug: 'preventive-diagnostic', name: 'Preventive & Diagnostic', short: 'Preventive', services: preventive },
  { number: '09', slug: 'recode-cognitive-health', name: 'ReCODE & Cognitive Health', short: 'ReCODE', services: recode },
  { number: '10', slug: 'restorative-reconstructive', name: 'Restorative & Reconstructive', short: 'Restorative', services: restorative },
  { number: '11', slug: 'wellness-offering', name: 'Wellness Offering', short: 'Wellness', services: wellness },
];

export const pricingServices = pricingCategories.flatMap((category) =>
  category.services.map((service) => ({ ...service, category: category.name, categorySlug: category.slug }))
);

export const pricingHighlights = [
  pricingServices.find((service) => service.slug === 'professional-dental-cleaning')!,
  pricingServices.find((service) => service.slug === 'professional-teeth-whitening')!,
  pricingServices.find((service) => service.slug === 'invisalign-clear-aligners')!,
  pricingServices.find((service) => service.slug === 'single-tooth-dental-implant')!,
  pricingServices.find((service) => service.slug === 'perio-protect')!,
  pricingServices.find((service) => service.slug === 'dental-crown')!,
];
