/**
 * Service-to-Provider Eligibility Validation Utility
 * Ensures providers strictly match service categories, service IDs, and specializations.
 * Prevents mismatching (e.g. electrical shops displaying for gardening services).
 */

export function isProviderEligible(provider, service) {
  if (!provider || !service) return false;

  // Verification & Status check
  if (provider.verified === false) return false;
  if (provider.availabilityStatus && provider.availabilityStatus !== 'AVAILABLE') return false;

  const sCat = (service.category || '').toLowerCase().trim();
  const sName = (service.serviceName || service.name || '').toLowerCase().trim();
  const sId = (service.serviceId || service._id || '').toString().toLowerCase().trim();

  // 1. Check servicesOffered array (IDs, names, or categories)
  if (provider.servicesOffered && Array.isArray(provider.servicesOffered)) {
    const hasMatch = provider.servicesOffered.some((offered) => {
      const oStr = String(offered).toLowerCase().trim();
      return oStr === sId || oStr === sName || oStr === sCat || (oStr.length > 3 && sCat.includes(oStr));
    });
    if (hasMatch) return true;
  }

  // 2. Check specialization array or string
  let specs = [];
  if (Array.isArray(provider.specialization)) {
    specs = provider.specialization.map((s) => String(s).toLowerCase().trim());
  } else if (typeof provider.specialization === 'string') {
    specs = [provider.specialization.toLowerCase().trim()];
  }

  return specs.some((sp) => {
    if (!sp) return false;
    if (sp === sCat || sp.includes(sCat) || sCat.includes(sp)) return true;
    if (sp.includes(sName) || sName.includes(sp)) return true;

    // Category-specific trade aliases
    if (sCat.includes('garden') || sCat.includes('plant') || sCat.includes('lawn')) {
      return sp.includes('garden') || sp.includes('plant') || sp.includes('lawn') || sp.includes('nursery');
    }
    if (sCat.includes('ac') || sCat.includes('appliance')) {
      return sp.includes('ac') || sp.includes('appliance') || sp.includes('hvac') || sp.includes('cooling');
    }
    if (sCat.includes('electric')) {
      return sp.includes('electric') || sp.includes('wiring');
    }
    if (sCat.includes('plumb')) {
      return sp.includes('plumb') || sp.includes('sanitary') || sp.includes('water');
    }
    if (sCat.includes('carpenter') || sCat.includes('carpent')) {
      return sp.includes('carpent') || sp.includes('wood') || sp.includes('furniture');
    }
    if (sCat.includes('paint')) {
      return sp.includes('paint') || sp.includes('wall') || sp.includes('coating');
    }
    if (sCat.includes('clean')) {
      return sp.includes('clean') || sp.includes('sanitiz') || sp.includes('housekeeping');
    }
    if (sCat.includes('pest')) {
      return sp.includes('pest') || sp.includes('termite') || sp.includes('bug');
    }
    if (sCat.includes('construct')) {
      return sp.includes('construct') || sp.includes('mason') || sp.includes('civil') || sp.includes('brick') || sp.includes('tile') || sp.includes('waterproof');
    }
    if (sCat.includes('renovat')) {
      return sp.includes('renovat') || sp.includes('remodel') || sp.includes('decor') || sp.includes('civil') || sp.includes('mason');
    }
    if (sCat.includes('home repair')) {
      return sp.includes('home repair') || sp.includes('handyman') || sp.includes('civil') || sp.includes('mason') || sp.includes('repair');
    }
    if (sCat.includes('vehicle')) {
      return sp.includes('vehicle') || sp.includes('auto') || sp.includes('bike') || sp.includes('car') || sp.includes('breakdown');
    }
    if (sCat.includes('tech')) {
      return sp.includes('tech') || sp.includes('cctv') || sp.includes('it') || sp.includes('computer') || sp.includes('laptop');
    }
    if (sCat.includes('move') || sCat.includes('pack')) {
      return sp.includes('move') || sp.includes('pack') || sp.includes('shifting') || sp.includes('logistics');
    }
    if (sCat.includes('personal')) {
      return sp.includes('personal') || sp.includes('salon') || sp.includes('wellness') || sp.includes('grooming');
    }
    if (sCat.includes('pet')) {
      return sp.includes('pet') || sp.includes('vet') || sp.includes('animal');
    }
    if (sCat.includes('event')) {
      return sp.includes('event') || sp.includes('pandal') || sp.includes('party') || sp.includes('decor');
    }
    return false;
  });
}

export function findEligibleProviderForService(service, providerList) {
  if (!service || !providerList || providerList.length === 0) return null;

  // 1. Direct providerId match if provider is eligible
  if (service.providerId) {
    const directMatch = providerList.find(p => p.providerId === service.providerId || p._id === service.providerId);
    if (directMatch && isProviderEligible(directMatch, service)) {
      return directMatch;
    }
  }

  // 2. Find first eligible provider in list
  const eligible = providerList.find(p => isProviderEligible(p, service));
  return eligible || null; // DO NOT fall back to providerList[0]!
}

export default {
  isProviderEligible,
  findEligibleProviderForService
};
