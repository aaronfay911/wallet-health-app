import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';

const markdownContent = `
## Privacy Policy

Your privacy is important to us. This policy explains how we collect and use your information.

1. **Information Collected**  
   We collect minimal data including wallet addresses and optional nicknames. No private keys are ever stored.

2. **Data Usage**  
   Data is used solely for generating wallet analytics and improving service accuracy.

3. **Third-Party Sharing**  
   We do not sell or share your data with third parties, except for analytics services we directly control.

4. **Cookies**  
   Cookies may be used for login sessions and basic analytics. You can opt out at any time.

5. **Contact**  
   Reach out to support@mycryptotrs.com with any concerns or deletion requests.
`;

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <Shield className="w-6 h-6 text-[var(--primary)]" />
              Privacy Policy
            </CardTitle>
            <p className="text-sm text-gray-400">Last Updated: July 29, 2025</p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-[var(--primary)] hover:prose-a:text-[var(--primary-dark)]">
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}