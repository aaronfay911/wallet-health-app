import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const markdownContent = `
## Terms of Service

Welcome to MyCryptoTRS. By accessing or using our services, you agree to the following terms...

1. **Use of Services**  
   You may not misuse our services. Use is limited to personal and non-commercial purposes unless explicitly permitted.

2. **Wallet Analytics**  
   You understand that analytics provided are estimates based on available data. They are not financial advice.

3. **User Responsibilities**  
   You are responsible for securing your own wallet credentials and any data you upload.

4. **Termination**  
   We reserve the right to suspend or terminate accounts violating our terms or abusing the system.

5. **Modifications**  
   We may update these Terms at any time. Continued use constitutes acceptance.

For questions, contact us at support@mycryptotrs.com.
`;

export default function TermsOfService() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <FileText className="w-6 h-6 text-[var(--primary)]" />
              Terms of Service
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