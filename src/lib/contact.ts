export type Inquiry = { name: string; phone: string; projectType: string; message: string };
export function buildWhatsAppLink(number: string, inquiry?: Inquiry) {
  const digits = number.replace(/[^\d]/g, "");
  if (number.includes("[") || digits.length < 7) return null;
  const text = inquiry
    ? `Hello Hangool, I would like to discuss a project.\nName: ${inquiry.name}\nPhone: ${inquiry.phone}\nProject: ${inquiry.projectType}\nMessage: ${inquiry.message}`
    : "Hello Hangool, I would like to discuss a construction project.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
