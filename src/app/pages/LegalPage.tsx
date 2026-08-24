import { useLocation, Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Shield, FileText, Calendar, Cookie, Accessibility } from "lucide-react";

const toc = {
  privacy: [
    "Information We Collect",
    "How We Use Your Information",
    "Data Sharing & Disclosure",
    "Cookies & Tracking",
    "Data Retention",
    "Your Rights & Choices",
    "International Data Transfers",
    "Children's Privacy",
    "Security",
    "Contact Us",
  ],
  terms: [
    "Acceptance of Terms",
    "Use of the Website",
    "Intellectual Property",
    "User Content",
    "Donations & Payments",
    "Third-Party Links",
    "Disclaimers",
    "Limitation of Liability",
    "Indemnification",
    "Governing Law",
    "Changes to Terms",
    "Contact Us",
  ],
};

function PrivacyPolicy() {
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <section className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-5 uppercase tracking-wider">
              <Shield size={14} /> Legal
            </div>
            <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>Privacy Policy</h1>
            <p className="text-white/70">Last updated: July 1, 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link to="/" className="hover:text-[#0B5D3F]">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">Privacy Policy</span>
        </div>
        <div className="grid lg:grid-cols-4 gap-10">
          {/* TOC */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-24">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Contents</div>
              {toc.privacy.map((item, i) => (
                <div key={item} className="flex items-start gap-2 py-1.5 cursor-pointer hover:text-[#0B5D3F] transition-colors">
                  <span className="text-xs text-gray-400 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-gray-600 hover:text-[#0B5D3F]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-10 border border-gray-100">
              <div className="flex items-center gap-3 p-4 bg-[#0B5D3F]/5 rounded-2xl mb-8">
                <Calendar size={16} className="text-[#0B5D3F]" />
                <p className="text-sm text-gray-600">This Privacy Policy was last updated on <strong>July 1, 2026</strong> and applies to all visitors and users of the Environmental Shapers Network website and digital services.</p>
              </div>

              <Section title="1. Information We Collect">
                <p>We collect information you provide directly to us, such as when you create an account, make a donation, subscribe to our newsletter, apply to volunteer, or contact us. This includes:</p>
                <ul>
                  <li><strong>Personal identifiers:</strong> Name, email address, phone number, postal address.</li>
                  <li><strong>Financial information:</strong> Payment card details (processed securely through third-party payment processors; we do not store full card numbers).</li>
                  <li><strong>Communications:</strong> Messages you send us, including feedback and survey responses.</li>
                  <li><strong>Automatically collected data:</strong> IP address, browser type, device information, pages visited, referral URLs, and cookies (see Section 4).</li>
                </ul>
              </Section>

              <Section title="2. How We Use Your Information">
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Process donations and send donation receipts and tax documentation.</li>
                  <li>Send newsletters, campaign updates, and organizational communications (only to subscribers who opt in).</li>
                  <li>Respond to inquiries and provide support.</li>
                  <li>Improve our website, programs, and services through analytics.</li>
                  <li>Comply with legal obligations and prevent fraud.</li>
                  <li>Conduct research and impact measurement (always in aggregate, anonymized form unless you consent otherwise).</li>
                </ul>
              </Section>

              <Section title="3. Data Sharing & Disclosure">
                <p>ESN does not sell, rent, or trade personal information to third parties for marketing purposes. We may share information with:</p>
                <ul>
                  <li><strong>Service providers:</strong> Payment processors (Stripe, PayPal), email platforms (Mailchimp), analytics (Google Analytics), cloud hosting providers — all bound by data processing agreements.</li>
                  <li><strong>Legal requirements:</strong> When required by law, court order, or government authority.</li>
                  <li><strong>Organizational transfers:</strong> In the unlikely event of a merger or acquisition, subject to the same privacy protections.</li>
                </ul>
              </Section>

              <Section title="4. Cookies & Tracking">
                <p>We use cookies and similar tracking technologies to enhance your experience. Cookies we use include:</p>
                <ul>
                  <li><strong>Essential cookies:</strong> Required for the website to function (e.g., session cookies).</li>
                  <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site (Google Analytics — anonymized IP).</li>
                  <li><strong>Preference cookies:</strong> Remember your settings and preferences.</li>
                </ul>
                <p>You can control cookies through your browser settings. Disabling cookies may affect some website functionality.</p>
              </Section>

              <Section title="5. Data Retention">
                <p>We retain personal data only as long as necessary for the purposes outlined in this policy, or as required by law. Donor records are retained for 7 years for tax and audit purposes. You may request deletion of your personal data at any time (subject to legal retention requirements).</p>
              </Section>

              <Section title="6. Your Rights & Choices">
                <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                <ul>
                  <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
                  <li><strong>Deletion:</strong> Request erasure of your personal data ("right to be forgotten").</li>
                  <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                  <li><strong>Objection:</strong> Object to certain processing activities.</li>
                  <li><strong>Withdrawal of consent:</strong> Unsubscribe from communications at any time.</li>
                </ul>
                <p>To exercise these rights, contact us at <strong>privacy@esnglobal.org</strong>.</p>
              </Section>

              <Section title="7. International Data Transfers">
                <p>ESN operates globally. Your personal data may be transferred to and processed in countries outside your home country, including countries that may not offer the same level of data protection. We ensure appropriate safeguards are in place, including standard contractual clauses approved by relevant data protection authorities.</p>
              </Section>

              <Section title="8. Children's Privacy">
                <p>Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately and we will delete such information.</p>
              </Section>

              <Section title="9. Security">
                <p>We implement industry-standard security measures including SSL/TLS encryption for data in transit, encrypted storage for sensitive data, access controls, and regular security audits. However, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and protect your account credentials.</p>
              </Section>

              <Section title="10. Contact Us">
                <p>For privacy-related questions or requests, contact:</p>
                <div className="bg-[#F6FBF8] rounded-xl p-4 mt-3">
                  <p className="text-sm"><strong>Environmental Shapers Network</strong><br />
                  Data Protection Officer<br />
                  Email: privacy@esnglobal.org<br />
                  Address: House 12, Road 7, Dhanmondi, Dhaka 1205, Bangladesh</p>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <section className="bg-gradient-to-br from-[#173B63] to-[#0B5D3F] pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-5 uppercase tracking-wider">
              <FileText size={14} /> Legal
            </div>
            <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>Terms & Conditions</h1>
            <p className="text-white/70">Last updated: July 1, 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link to="/" className="hover:text-[#0B5D3F]">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">Terms & Conditions</span>
        </div>
        <div className="grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-24">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Contents</div>
              {toc.terms.map((item, i) => (
                <div key={item} className="flex items-start gap-2 py-1.5">
                  <span className="text-xs text-gray-400 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-gray-600 hover:text-[#0B5D3F] cursor-pointer transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-10 border border-gray-100">
              <div className="flex items-center gap-3 p-4 bg-[#173B63]/5 rounded-2xl mb-8">
                <Calendar size={16} className="text-[#173B63]" />
                <p className="text-sm text-gray-600">These Terms & Conditions govern your use of the ESN website. By accessing or using our services, you agree to be bound by these terms.</p>
              </div>

              <Section title="1. Acceptance of Terms">
                <p>By accessing and using the Environmental Shapers Network website (esnglobal.org) or any of our digital services, you accept and agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use our website.</p>
              </Section>

              <Section title="2. Use of the Website">
                <p>You may use our website for lawful purposes only. You agree not to:</p>
                <ul>
                  <li>Use the website in any way that violates applicable local, national, or international law.</li>
                  <li>Transmit unsolicited commercial communications (spam).</li>
                  <li>Attempt to gain unauthorized access to any part of the website or related systems.</li>
                  <li>Engage in any data mining, scraping, or harvesting of website content without express written permission.</li>
                  <li>Impersonate ESN, its staff, or any other person or entity.</li>
                </ul>
              </Section>

              <Section title="3. Intellectual Property">
                <p>All content on this website, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of Environmental Shapers Network or its content suppliers and is protected by international copyright laws. You may:</p>
                <ul>
                  <li>Download or print content for personal, non-commercial use with appropriate attribution.</li>
                  <li>Share links to our content on social media and other platforms.</li>
                </ul>
                <p>You may not reproduce, distribute, or create derivative works without our prior written consent.</p>
              </Section>

              <Section title="4. User Content">
                <p>If you submit content to our website (comments, testimonials, campaign stories), you grant ESN a non-exclusive, royalty-free, perpetual license to use, reproduce, and distribute that content in connection with our mission and communications. You warrant that you own or have the necessary rights to submit such content.</p>
              </Section>

              <Section title="5. Donations & Payments">
                <p>Donations made through our website are processed securely by third-party payment processors. All donations are:</p>
                <ul>
                  <li>Voluntary and non-refundable unless required by applicable law or specifically stated otherwise.</li>
                  <li>Used in accordance with our stated charitable mission and program areas.</li>
                  <li>Eligible for tax deductions where applicable under the laws of your jurisdiction. Please consult your tax advisor.</li>
                </ul>
                <p>ESN is registered as a non-profit organization. Official donation receipts are provided for all donations.</p>
              </Section>

              <Section title="6. Third-Party Links">
                <p>Our website may contain links to third-party websites. These links are provided for convenience only. ESN does not endorse, control, or take responsibility for the content, privacy practices, or terms of any third-party websites. You visit such websites at your own risk.</p>
              </Section>

              <Section title="7. Disclaimers">
                <p>The website and its content are provided "as is" without warranties of any kind, express or implied. ESN does not warrant that the website will be uninterrupted, error-free, or free of viruses. Information on the website is for general informational purposes and does not constitute professional legal, financial, or scientific advice.</p>
              </Section>

              <Section title="8. Limitation of Liability">
                <p>To the fullest extent permitted by law, ESN shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of (or inability to use) the website or its content, even if ESN has been advised of the possibility of such damages. ESN's total liability shall not exceed the amount you donated in the preceding 12 months, if any.</p>
              </Section>

              <Section title="9. Indemnification">
                <p>You agree to indemnify, defend, and hold harmless ESN and its officers, directors, employees, and agents from any claims, liabilities, damages, and expenses (including legal fees) arising from your violation of these Terms, your use of the website, or your submission of content.</p>
              </Section>

              <Section title="10. Governing Law">
                <p>These Terms shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh, without regard to conflict of law principles. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.</p>
              </Section>

              <Section title="11. Changes to Terms">
                <p>ESN reserves the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the website after such changes constitutes acceptance of the new terms. We encourage you to review this page periodically.</p>
              </Section>

              <Section title="12. Contact Us">
                <p>For questions about these Terms, contact:</p>
                <div className="bg-[#F6FBF8] rounded-xl p-4 mt-3">
                  <p className="text-sm"><strong>Environmental Shapers Network</strong><br />
                  Legal Department<br />
                  Email: legal@esnglobal.org<br />
                  Address: House 12, Road 7, Dhanmondi, Dhaka 1205, Bangladesh</p>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }} className="text-gray-900 mb-3 text-lg border-b border-gray-100 pb-2">{title}</h3>
      <div className="text-sm text-gray-600 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-gray-800">
        {children}
      </div>
    </div>
  );
}

function CookiePolicyPage() {
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <section className="bg-gradient-to-br from-[#0B5D3F] via-[#173B63] to-[#0B5D3F] pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-5 uppercase tracking-wider">
              <Cookie size={14} /> Legal
            </div>
            <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>Cookie Policy</h1>
            <p className="text-white/70">Last updated: July 1, 2026</p>
          </motion.div>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link to="/" className="hover:text-[#0B5D3F]">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">Cookie Policy</span>
        </div>
        <div className="bg-white rounded-3xl p-10 border border-gray-100">
          <div className="flex items-center gap-3 p-4 bg-[#0B5D3F]/5 rounded-2xl mb-8">
            <Cookie size={16} className="text-[#0B5D3F]" />
            <p className="text-sm text-gray-600">This Cookie Policy explains how ESN uses cookies and similar tracking technologies on our website.</p>
          </div>
          <Section title="1. What Are Cookies?">
            <p>Cookies are small text files placed on your device when you visit our website. They allow us to remember your preferences, understand how you use our site, and improve your experience. Cookies cannot harm your computer or contain viruses.</p>
          </Section>
          <Section title="2. Types of Cookies We Use">
            <p><strong>Essential Cookies:</strong> These are strictly necessary for the website to function and cannot be disabled. They include session cookies that maintain your logged-in state and security cookies that prevent cross-site request forgery.</p>
            <p><strong>Analytics Cookies:</strong> We use Google Analytics (with IP anonymization enabled) to understand how visitors use our site — which pages are most popular, how long visitors stay, and how they navigate. This data is aggregated and anonymous.</p>
            <p><strong>Preference Cookies:</strong> These remember your choices, such as language preference, newsletter opt-in status, and cookie consent settings.</p>
            <p><strong>Marketing Cookies (Optional):</strong> With your explicit consent, we may use cookies to show you relevant ESN campaigns and content on third-party platforms. These can be disabled at any time.</p>
          </Section>
          <Section title="3. Third-Party Cookies">
            <p>Some content on our website is served by third parties, who may also set cookies. These include:</p>
            <ul>
              <li><strong>Google Analytics:</strong> Website traffic analytics (analytics.google.com — see their privacy policy)</li>
              <li><strong>YouTube:</strong> Embedded campaign videos (youtube.com — see Google's privacy policy)</li>
              <li><strong>Stripe / PayPal:</strong> Donation processing (cookies set only on donation pages)</li>
              <li><strong>Mailchimp:</strong> Newsletter subscription tracking</li>
            </ul>
            <p>We do not control these third-party cookies. Please refer to each provider's privacy policy for details.</p>
          </Section>
          <Section title="4. How to Control Cookies">
            <p>You have several options for controlling cookies:</p>
            <ul>
              <li><strong>Cookie consent banner:</strong> When you first visit our site, you can accept or decline non-essential cookies using our cookie consent tool.</li>
              <li><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies through their settings. See your browser's help documentation for instructions (Chrome, Firefox, Safari, Edge).</li>
              <li><strong>Opt-out tools:</strong> You can opt out of Google Analytics tracking at tools.google.com/dlpage/gaoptout.</li>
            </ul>
            <p>Please note: disabling essential cookies may affect website functionality. Disabling analytics cookies does not affect your ability to use the site.</p>
          </Section>
          <Section title="5. Cookie Retention">
            <p>Different cookies are retained for different periods:</p>
            <ul>
              <li><strong>Session cookies:</strong> Deleted when you close your browser.</li>
              <li><strong>Persistent cookies:</strong> Retained for a defined period (typically 30 days to 2 years depending on purpose).</li>
              <li><strong>Analytics cookies:</strong> Google Analytics data is retained for 26 months by default.</li>
            </ul>
          </Section>
          <Section title="6. Updates to This Policy">
            <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this page periodically.</p>
          </Section>
          <Section title="7. Contact Us">
            <p>For questions about our use of cookies:</p>
            <div className="bg-[#F6FBF8] rounded-xl p-4 mt-3">
              <p className="text-sm"><strong>Environmental Shapers Network</strong><br />
              Email: privacy@esnglobal.org<br />
              Address: House 12, Road 7, Dhanmondi, Dhaka 1205, Bangladesh</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function AccessibilityPage() {
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      <section className="bg-gradient-to-br from-[#173B63] to-[#0B5D3F] pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full mb-5 uppercase tracking-wider">
              <Accessibility size={14} /> Legal
            </div>
            <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>Accessibility Statement</h1>
            <p className="text-white/70">Last updated: July 1, 2026</p>
          </motion.div>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link to="/" className="hover:text-[#0B5D3F]">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">Accessibility</span>
        </div>
        <div className="bg-white rounded-3xl p-10 border border-gray-100">
          <div className="flex items-center gap-3 p-4 bg-[#173B63]/5 rounded-2xl mb-8">
            <Accessibility size={16} className="text-[#173B63]" />
            <p className="text-sm text-gray-600">ESN is committed to ensuring our website is accessible to everyone, including people with disabilities.</p>
          </div>
          <Section title="1. Our Commitment">
            <p>Environmental Shapers Network (ESN) is committed to ensuring that our website is accessible to all users, including those with disabilities. We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards and continuously work to improve the accessibility of our digital content.</p>
          </Section>
          <Section title="2. Conformance Status">
            <p>We aim to conform to WCAG 2.1 Level AA. This means our website should be:</p>
            <ul>
              <li><strong>Perceivable:</strong> Information is presented in ways all users can perceive — including text alternatives for non-text content, captions for video, and content that can be presented in different ways without losing information.</li>
              <li><strong>Operable:</strong> All functionality is accessible via keyboard, sufficient time is provided to read content, and users can avoid seizure-inducing content.</li>
              <li><strong>Understandable:</strong> Text is readable and understandable, pages function predictably, and input assistance is provided.</li>
              <li><strong>Robust:</strong> Content is compatible with current and future assistive technologies including screen readers.</li>
            </ul>
          </Section>
          <Section title="3. Features for Accessibility">
            <p>The following features have been implemented to improve accessibility:</p>
            <ul>
              <li>All images have descriptive alt text for screen reader users.</li>
              <li>The website can be navigated entirely using a keyboard (Tab, Enter, Arrow keys).</li>
              <li>Color contrast ratios meet or exceed WCAG 2.1 AA requirements (4.5:1 for normal text).</li>
              <li>Interactive elements (buttons, links, forms) have visible focus indicators.</li>
              <li>Form fields are properly labeled for screen reader compatibility.</li>
              <li>Videos on our website include captions and audio descriptions where applicable.</li>
              <li>The website is compatible with screen readers including NVDA, JAWS, and VoiceOver.</li>
              <li>Font sizes are specified in relative units (rem/em) and can be resized without breaking layout.</li>
            </ul>
          </Section>
          <Section title="4. Known Limitations">
            <p>While we strive for full accessibility, some limitations currently exist:</p>
            <ul>
              <li>Some older PDF documents in our Knowledge Hub may not be fully accessible. We are working to remediate these.</li>
              <li>Some embedded third-party maps and interactive visualizations may not be fully keyboard-navigable. We provide text alternatives where possible.</li>
              <li>Certain video content from older campaigns may lack full audio descriptions.</li>
            </ul>
            <p>We are actively working to address these limitations.</p>
          </Section>
          <Section title="5. Assistive Technology Compatibility">
            <p>Our website is designed to be compatible with the following assistive technologies:</p>
            <ul>
              <li>Screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android)</li>
              <li>Browser zoom up to 400% without loss of content or functionality</li>
              <li>High contrast mode (Windows and macOS)</li>
              <li>Voice recognition software such as Dragon NaturallySpeaking</li>
              <li>Switch access devices</li>
            </ul>
          </Section>
          <Section title="6. Feedback & Contact">
            <p>We welcome feedback on the accessibility of our website. If you encounter barriers or have suggestions for improvement, please contact us:</p>
            <div className="bg-[#F6FBF8] rounded-xl p-4 mt-3">
              <p className="text-sm"><strong>Environmental Shapers Network — Accessibility Team</strong><br />
              Email: accessibility@esnglobal.org<br />
              Phone: +880 1700-000000<br />
              We aim to respond to accessibility feedback within 2 business days.</p>
            </div>
          </Section>
          <Section title="7. Formal Complaints">
            <p>If you are not satisfied with our response to your accessibility feedback, you may contact the relevant national accessibility enforcement body in your country. In Bangladesh, this falls under the Ministry of Social Welfare. EU users may contact their national accessibility authority as designated under the European Accessibility Act.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default function LegalPage() {
  const { pathname } = useLocation();
  if (pathname === "/terms") return <TermsPage />;
  if (pathname === "/cookie-policy") return <CookiePolicyPage />;
  if (pathname === "/accessibility") return <AccessibilityPage />;
  return <PrivacyPolicy />;
}
