export const serviceCategoryRoutes = [
  { name: 'Complete Health & Airway', slug: 'complete-health-airway' },
  { name: 'Cosmetic Dentistry', slug: 'cosmetic-dentistry' },
  { name: 'Emergency & Comfort', slug: 'emergency-comfort' },
  { name: 'Implants & Oral Surgery', slug: 'implants-oral-surgery' },
  { name: 'Orthodontic Dentistry', slug: 'orthodontic-dentistry' },
  { name: 'Pediatric & Developmental', slug: 'pediatric-developmental' },
  { name: 'Periodontal Dentistry', slug: 'periodontal-dentistry' },
  { name: 'Preventive & Diagnostic', slug: 'preventive-diagnostic' },
  { name: 'ReCODE & Cognitive Health', slug: 'recode-cognitive-health' },
  { name: 'Restorative & Reconstructive', slug: 'restorative-reconstructive' },
  { name: 'Wellness Offering', slug: 'wellness-offering' },
] as const;

export const serviceDetailRoutes = [
  ['Oral-cancer screening', 'oral-cancer-screening'],
  ['Airway and sleep screening', 'airway-sleep-screening'],
  ['Artery-health screening', 'artery-health-screening'],
  ['ProSomnus sleep-apnea oral appliance', 'prosomnus-sleep-apnea-appliance'],
  ['Professional teeth whitening', 'professional-teeth-whitening'],
  ['Porcelain veneers and laminates', 'porcelain-veneers-laminates'],
  ['Lumineers', 'lumineers'],
  ['Snap-on Smile', 'snap-on-smile'],
  ['Dental bonding', 'dental-bonding'],
  ['Tooth contouring', 'tooth-contouring'],
  ['Complete smile makeover', 'complete-smile-makeover'],
  ['Nitrous oxide sedation', 'nitrous-oxide-sedation'],
  ['Virtual-reality anxiety reduction', 'virtual-reality-anxiety-reduction'],
  ['Same-day emergency dental care', 'same-day-emergency-dental-care'],
  ['Single-tooth dental implant', 'single-tooth-dental-implant'],
  ['Implant-supported bridge', 'implant-supported-bridge'],
  ['All-on-4 implant solution', 'all-on-4-implant-solution'],
  ['Bone grafting', 'bone-grafting'],
  ['Dental implant restoration', 'dental-implant-restoration'],
  ['Simple tooth extraction', 'simple-tooth-extraction'],
  ['Surgical tooth extraction', 'surgical-tooth-extraction'],
  ['Wisdom-tooth removal', 'wisdom-tooth-removal'],
  ['Invisalign clear-aligner treatment', 'invisalign-clear-aligners'],
  ['HealthyStart System treatment', 'healthystart-system'],
  ['First dental visit', 'first-dental-visit'],
  ['Pediatric cleaning and exam', 'pediatric-cleaning-exam'],
  ['Gum-disease treatment and deep cleaning', 'gum-disease-deep-cleaning'],
  ['Perio Protect tray therapy', 'perio-protect'],
  ['Professional dental cleaning', 'professional-dental-cleaning'],
  ['Routine or comprehensive dental exam', 'routine-comprehensive-exam'],
  ['Digital dental X-rays', 'digital-dental-x-rays'],
  ['Fluoride treatment', 'fluoride-treatment'],
  ['Dental sealant', 'dental-sealants'],
  ['Gum-disease screening and evaluation', 'gum-disease-screening'],
  ['Custom sports mouthguard', 'custom-sports-mouthguard'],
  ['Custom night guard', 'custom-night-guard'],
  ['Laser dentistry', 'laser-dentistry'],
  ['ReCODE 2.0 dental program', 'recode-2-0-dental-program'],
  ['Oral spirochete test', 'oral-spirochete-test'],
  ['Amalgam filling replacement', 'amalgam-filling-replacement'],
  ['Full denture', 'full-denture'],
  ['Partial denture', 'partial-denture'],
  ['Tooth-colored dental filling', 'tooth-colored-dental-filling'],
  ['Dental crown', 'dental-crown'],
  ['Dental bridge', 'dental-bridge'],
  ['Full-mouth reconstruction', 'full-mouth-reconstruction'],
  ['Root-canal treatment and coordination', 'root-canal-treatment-coordination'],
  ['Juice Plus wellness program', 'juice-plus-wellness-program'],
] as const;

const serviceSlugByName = new Map<string, string>(serviceDetailRoutes);

export const serviceHref = (name: string) => {
  const slug = serviceSlugByName.get(name);
  return slug ? `/services/${slug}/` : '/services/';
};

export const serviceAreaDetailRoutes = [
  { name: 'Chicago Heights', slug: 'chicago-heights', office: '500 Ashland Ave, Suite #2' },
  { name: 'Mokena', slug: 'mokena', office: '19160 88th Avenue' },
  { name: 'South Chicago Heights', slug: 'south-chicago-heights', office: 'Chicago Heights care team' },
  { name: 'Steger', slug: 'steger', office: 'Chicago Heights care team' },
  { name: 'Sauk Village', slug: 'sauk-village', office: 'Chicago Heights care team' },
] as const;

const serviceAreaSlugByName = new Map<string, string>(serviceAreaDetailRoutes.map(({ name, slug }) => [name, slug]));

export const serviceAreaHref = (name: string) => {
  const slug = serviceAreaSlugByName.get(name);
  return slug ? `/service-areas/${slug}/` : '/service-areas/#community-map';
};

export const locationRelatedServices = [
  { name: 'Routine comprehensive exam', detail: 'Start with the complete oral picture', href: '/services/routine-comprehensive-exam/' },
  { name: 'Same-day emergency care', detail: 'Prompt assessment when something cannot wait', href: '/services/same-day-emergency-dental-care/' },
  { name: 'Professional teeth whitening', detail: 'Explore a natural shade-brightening plan', href: '/services/professional-teeth-whitening/' },
  { name: 'Invisalign clear aligners', detail: 'Explore a removable alignment pathway', href: '/services/invisalign-clear-aligners/' },
  { name: 'Single-tooth dental implant', detail: 'Explore a single-space replacement path', href: '/services/single-tooth-dental-implant/' },
  { name: 'Professional dental cleaning', detail: 'Connect prevention to ongoing care', href: '/services/professional-dental-cleaning/' },
] as const;
