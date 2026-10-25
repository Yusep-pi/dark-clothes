// ============================================================
//  TUS DATOS — cambiá esto y se actualiza en toda la web
//  (créditos, pantalla de boot, case study y "Continue")
// ============================================================

export const AUTHOR = {
  name: 'Tu Nombre', // ← tu nombre o tu marca
  role: 'Diseño y desarrollo web creativo',
  email: 'tu@mail.com', // ← el mail donde querés que te escriban
  // links opcionales: dejá '' los que no tengas
  portfolio: '',
  github: 'https://github.com/Yusep-pi',
  instagram: '',
  linkedin: '',
}

export const CONTACT_URL = `mailto:${AUTHOR.email}?subject=${encodeURIComponent('Quiero una web así')}`
