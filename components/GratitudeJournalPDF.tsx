import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from './ui/button';
import { FaDownload, FaBook } from 'react-icons/fa';

interface JournalQuestion {
  question: string;
  answer: string;
}

const GratitudeJournalPDF: React.FC = () => {
  const journalRef = useRef<HTMLDivElement>(null);

  // 12 gratitude reflection questions with sample answers
  const journalQuestions: JournalQuestion[] = [
    // Page 1
    {
      question: "DID YOU EXPERIENCE A MOMENT OF CLARITY OR PEACE?",
      answer: "Yes, during the morning meditation session, I felt a deep sense of calm wash over me. The guided breathing helped me release tension I didn't realize I was carrying."
    },
    {
      question: "HOW HAS YOUR PERSPECTIVE SHIFTED?",
      answer: "I've realized that wellness isn't just about physical health, but about creating space for mental clarity and emotional balance in my daily routine."
    },
    {
      question: "WHAT INTENTIONS WOULD YOU LIKE TO SET MOVING FORWARD?",
      answer: "I want to practice 10 minutes of mindful breathing each morning and take regular breaks during work to reconnect with my body and breath."
    },
    // Page 2
    {
      question: "WHAT'S ONE INSIGHT FROM TODAY THAT YOU WANT TO CARRY INTO YOUR DAILY LIFE?",
      answer: "The power of community support in wellness journeys. Sharing experiences with others made the practice more meaningful and sustainable."
    },
    {
      question: "HOW CAN YOU INTEGRATE GRATITUDE INTO YOUR WELLNESS ROUTINE?",
      answer: "I'll start each day by writing down three things I'm grateful for, and end each day reflecting on one positive moment that brought me joy."
    },
    {
      question: "HOW DID TODAY'S SESSIONS HELP YOU CONNECT WITH YOURSELF?",
      answer: "The yoga session helped me become more aware of my body's needs and limitations, while the meditation helped me quiet my mind and listen to my inner voice."
    },
    // Page 3
    {
      question: "HOW HAS TODAY'S SESSION INFLUENCED YOUR THOUGHTS OR EMOTIONS?",
      answer: "I feel more centered and less reactive. The practices helped me recognize that I have more control over my emotional responses than I thought."
    },
    {
      question: "WHAT POSITIVE ENERGY DID YOU FEEL DURING THE EVENT?",
      answer: "I felt a collective energy of hope and possibility. Everyone was so supportive and encouraging, which created a safe space for personal growth."
    },
    {
      question: "LIST THREE THINGS YOU'RE GRATEFUL FOR AFTER THE WELLNESS ACTIVITIES",
      answer: "1. The beautiful outdoor setting that connected me with nature. 2. The skilled instructors who guided us with patience and wisdom. 3. The opportunity to disconnect from technology and reconnect with myself."
    },
    // Page 4
    {
      question: "HOW DID THE SOUND HEALING RESONATE WITH YOU?",
      answer: "The vibrational frequencies seemed to align with my own energy, creating a sense of harmony and deep relaxation that I haven't experienced before."
    },
    {
      question: "WHAT SMALL CHANGES CAN YOU MAKE TO MAINTAIN THIS FEELING OF WELLNESS?",
      answer: "I can take 5-minute breathing breaks throughout the day, practice mindful walking, and create a calming evening routine to wind down properly."
    },
    {
      question: "WHAT SUPPORT DO YOU APPRECIATE FROM THOSE AROUND YOU?",
      answer: "I'm grateful for my partner's encouragement to prioritize self-care, my friends who join me in wellness activities, and the community that shares resources and experiences."
    }
  ];

  const generatePDF = async () => {
    if (!journalRef.current) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Generate each page
      for (let page = 0; page < 4; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        const startIndex = page * 3;
        const pageQuestions = journalQuestions.slice(startIndex, startIndex + 3);

        // Set up the page with hand-drawn aesthetic
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(2);

        // Title
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('GRATITUDE REFLECTION', pageWidth / 2, 25, { align: 'center' });

        // Draw title box
        pdf.rect(15, 15, pageWidth - 30, 20);

        // Draw three columns
        const columnWidth = (pageWidth - 40) / 3;
        const columnStartY = 50;
        const columnHeight = pageHeight - 70;

        for (let i = 0; i < 3; i++) {
          const x = 20 + (i * (columnWidth + 5));
          const y = columnStartY;

          // Draw column border
          pdf.rect(x, y, columnWidth, columnHeight);

          // Add decorative icons
          if (i === 0) {
            // Yellow speech bubble with thumbs up
            pdf.setFillColor(255, 255, 0);
            pdf.circle(x + 15, y - 5, 8, 'F');
            pdf.setFillColor(0, 150, 255);
            pdf.circle(x + 15, y - 5, 4, 'F');
          } else if (i === 2) {
            // White speech bubble with heart
            pdf.setFillColor(255, 255, 255);
            pdf.circle(x + columnWidth - 15, y - 5, 8, 'F');
            pdf.setFillColor(255, 0, 0);
            pdf.circle(x + columnWidth - 15, y - 5, 4, 'F');
          }

          // Question
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          const question = pageQuestions[i].question;
          const questionLines = pdf.splitTextToSize(question, columnWidth - 10);
          pdf.text(questionLines, x + 5, y + 15);

          // "TAP TO ANSWER:" prompt
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.text('TAP TO ANSWER:', x + 5, y + 15 + (questionLines.length * 5) + 10);

          // Answer
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          const answer = pageQuestions[i].answer;
          const answerLines = pdf.splitTextToSize(answer, columnWidth - 10);
          pdf.text(answerLines, x + 5, y + 15 + (questionLines.length * 5) + 20);
        }

        // Add page number
        pdf.setFontSize(10);
        pdf.text(`Page ${page + 1} of 4`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // Save the PDF
      pdf.save('gratitude-reflection-journal.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Gratitude Reflection Journal
        </h2>
        <p className="text-muted-foreground text-lg">
          Download your personalized gratitude journal with 12 reflection questions and answers
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-8 mb-8">
        <div className="text-center mb-6">
          <FaBook className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Your Journal is Ready
          </h3>
          <p className="text-muted-foreground">
            This PDF contains 4 pages with 3 reflection questions each, featuring your personal insights and gratitude reflections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-secondary">4</p>
            <p className="text-sm text-muted-foreground">Pages</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-secondary">12</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </div>
        </div>

        <Button
          onClick={generatePDF}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaDownload className="w-5 h-5 mr-2" />
          Download Gratitude Journal PDF
        </Button>
      </div>

      {/* Preview of questions */}
      <div className="bg-muted/30 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
          Journal Preview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {journalQuestions.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm font-semibold text-foreground mb-2">
                {item.question}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden div for PDF generation */}
      <div ref={journalRef} className="hidden">
        {/* This div will be used for PDF generation but won't be visible */}
      </div>
    </div>
  );
};

export default GratitudeJournalPDF;








