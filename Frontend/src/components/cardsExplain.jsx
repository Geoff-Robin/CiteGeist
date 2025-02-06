import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Binary, Gauge } from 'lucide-react';
import { motion } from "motion/react"
const CardsExplain = () => {
    return (
        <div className="grid md:grid-cols-3 min-h-screen overflow-hidden gap-2">
          {/* How It Works Card */}
          <Card className="flex flex-col border-secondary">
            <CardHeader>
              <BookOpen className="w-8 h-8 mb-2 text-blue-600" />
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Content-Based Filtering System</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                Our system analyzes research papers using TF-IDF (Term Frequency-Inverse Document Frequency) to convert text into numerical vectors. TF measures how frequently a term appears in a document, while IDF evaluates how rare or unique that term is across a set of documents. By combining these two components, TF-IDF highlights terms that are important to a specific paper but not too common across other papers. This helps capture the relevance of words in each research paper, enhancing tasks like content comparison and document classification. The system then uses these numerical vectors to perform tasks like document similarity, topic modeling, and recommendation generation. This method allows for a deeper understanding of a paper's content and its connection to other research in the field.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">TF-IDF Vectorization</Badge>
                  <Badge variant="secondary">Natural Language Processing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
    
          {/* Technical Details Card */}
          <Card className="flex flex-col border-secondary">
            <CardHeader>
              <Binary className="w-8 h-8 mb-2 text-blue-600" />
              <CardTitle>Technical Process</CardTitle>
              <CardDescription>Implementation Details</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                Our system uses TF-IDF (Term Frequency-Inverse Document Frequency) to analyze research papers by converting the text into numerical vectors. TF calculates how often a word appears in a specific paper, while IDF determines how rare or significant the word is across a collection of papers. The combination of these two factors helps identify the most relevant terms in each paper, capturing the key concepts. By transforming the text into vectors, the system can effectively compare and classify documents. This enables tasks such as document similarity analysis and research paper recommendations. As a result, the system can better understand and process large amounts of research data.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Feature Extraction</Badge>
                  <Badge variant="secondary">Matrix Operations</Badge>
                  <Badge variant="secondary">Cosine Similarity</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
    
          {/* Benefits Card */}
          <Card className="flex flex-col border-secondary">
            <CardHeader>
              <Gauge className="w-8 h-8 mb-2 text-blue-600" />
              <CardTitle>Key Benefits</CardTitle>
              <CardDescription>Why Use Our System</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                Our system offers personalized research paper recommendations by analyzing your interests and reading history. By tracking the papers you've read and exploring the terms and topics you've engaged with, the system identifies patterns and suggests papers that align with your preferences. Using techniques like TF-IDF and semantic analysis, it can find papers that share similar content, methodologies, and research areas. The recommendations are tailored to provide relevant research based on specific keywords, themes, or research methodologies that matter most to you. This helps you stay up-to-date with new papers in your field while discovering valuable research that you may have missed. Ultimately, the system enhances your research journey by connecting you to the most pertinent work in your area of interest.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Personalized Results</Badge>
                  <Badge variant="secondary">Content Relevance</Badge>
                  <Badge variant="secondary">Easy Discovery</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
};

export { CardsExplain };