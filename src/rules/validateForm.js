import { EXPERIENCE_LEVELS } from "./eligibilityRule.js";

const NAME = /^[A-Za-z][A-Za-z .'-]{1,59}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^03\d{2}-?\d{7}$/;

export const EMPTY_FORM = { fullName: "", email: "", phone: "", experience: "", notes: "", agree: false };

export function validateForm(v) {
  const e = {};
  const name = v.fullName.trim();
  if (!name) e.fullName = "Enter your full name.";
  else if (!NAME.test(name)) e.fullName = "Use letters only, 2 to 60 characters.";
  if (!v.email.trim()) e.email = "Enter an email address.";
  else if (!EMAIL.test(v.email.trim())) e.email = "Email should look like name@example.com.";
  const phone = v.phone.replace(/\s/g, "");
  if (!phone) e.phone = "Enter a mobile number.";
  else if (!PHONE.test(phone)) e.phone = "Use a Pakistani mobile number such as 0300-1234567.";
  if (!EXPERIENCE_LEVELS.includes(v.experience)) e.experience = "Choose your experience level.";
  if (v.notes.length > 200) e.notes = "Notes can be at most 200 characters.";
  if (!v.agree) e.agree = "Please accept the studio policy to continue.";
  return e;
}
