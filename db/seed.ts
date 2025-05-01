import { db } from "./index";
import * as schema from "@shared/schema";
import { formatISO } from "date-fns";

async function seed() {
  try {
    console.log("Seeding database...");

    // Create initial user
    const [user] = await db
      .insert(schema.users)
      .values({
        username: "janedoe",
        password: "$2a$10$HkLKDCJbQgZ1cE/L3yIH9.RPj3YywSRHpCsX.7dGXzuU6n5DG4lEG", // "password123" hashed
        fullName: "Jane Doe",
        role: "Legal Analyst"
      })
      .onConflictDoNothing({ target: schema.users.username })
      .returning();

    console.log("Created user:", user?.username || "janedoe (already exists)");

    // Seed Judicial Decisions
    const judicialDecisions = [
      {
        title: "Acme Corp. v. United Workers Union",
        caseNumber: "2023-135",
        jurisdiction: "Supreme Court",
        category: "Labor Law",
        date: "2023-05-15",
        judge: "Justice M. Rodriguez",
        parties: "Acme Corporation (Appellant) v. United Workers Union (Respondent)",
        summary: "Landmark decision concerning collective bargaining rights and remote work arrangements in the post-pandemic era. The Supreme Court ruled 6-3 in favor of the United Workers Union, establishing that employers cannot unilaterally revoke remote work arrangements established during the pandemic without meaningful negotiation with unions.",
        content: "Full decision content would be here",
        tags: ["remote work", "collective bargaining", "labor rights", "pandemic"]
      },
      {
        title: "Martinez v. Global Tech Industries",
        caseNumber: "2023-078",
        jurisdiction: "Federal Court",
        category: "Labor Law",
        date: "2023-04-03",
        judge: "Judge William Chen",
        parties: "Elena Martinez (Plaintiff) v. Global Tech Industries (Defendant)",
        summary: "Workplace discrimination case regarding reasonable accommodations for employees with disabilities in tech firms. The court ruled that employers must provide reasonable accommodations for remote work when an employee's disability makes it necessary.",
        content: "Full decision content would be here",
        tags: ["discrimination", "disability", "reasonable accommodation", "tech industry"]
      },
      {
        title: "Smith v. Medical Center Ltd.",
        caseNumber: "2023-042",
        jurisdiction: "State Court",
        category: "Labor Law",
        date: "2023-03-22",
        judge: "Judge Sarah Johnson",
        parties: "Robert Smith (Plaintiff) v. Medical Center Ltd. (Defendant)",
        summary: "Healthcare workers' rights case focusing on overtime compensation and shift scheduling in hospital settings. The court found that on-call time can qualify as compensable work time under specific circumstances.",
        content: "Full decision content would be here",
        tags: ["healthcare", "overtime", "compensation", "scheduling"]
      },
      {
        title: "Johnson v. State Department of Labor",
        caseNumber: "2023-016",
        jurisdiction: "Supreme Court",
        category: "Constitutional Law",
        date: "2023-02-09",
        judge: "Justice A. Thompson",
        parties: "David Johnson (Appellant) v. State Department of Labor (Respondent)",
        summary: "Constitutional challenge to state regulations on gig economy workers and independent contractor classifications. The court upheld the state's ability to regulate worker classification while setting new standards for determining employment status.",
        content: "Full decision content would be here",
        tags: ["gig economy", "independent contractors", "worker classification", "constitutional law"]
      },
      {
        title: "Regional Transport v. Driver's Association",
        caseNumber: "2023-005",
        jurisdiction: "Administrative",
        category: "Administrative Law",
        date: "2023-01-18",
        judge: "Administrative Judge K. Patel",
        parties: "Regional Transport Co. (Appellant) v. Professional Driver's Association (Respondent)",
        summary: "Administrative tribunal decision on mandatory rest periods and working hours for transportation industry employees. The tribunal established minimum rest requirements between shifts for long-haul drivers.",
        content: "Full decision content would be here",
        tags: ["transportation", "working hours", "rest periods", "safety regulations"]
      },
      {
        title: "Wilson v. Retail Enterprises Inc.",
        caseNumber: "2022-286",
        jurisdiction: "Federal Court",
        category: "Labor Law",
        date: "2022-12-05",
        judge: "Judge Thomas Garcia",
        parties: "Maria Wilson et al. (Plaintiffs) v. Retail Enterprises Inc. (Defendant)",
        summary: "Class action lawsuit regarding wage theft allegations and employee classification in retail industry. The court certified a class of over 5,000 employees and established new standards for determining off-the-clock work.",
        content: "Full decision content would be here",
        tags: ["retail", "wage theft", "class action", "employee classification"]
      }
    ];

    for (const decision of judicialDecisions) {
      try {
        // Check if record already exists
        const existing = await db.query.judicialDecisions.findFirst({
          where: (table, { eq }) => eq(table.caseNumber, decision.caseNumber)
        });
        
        if (!existing) {
          await db
            .insert(schema.judicialDecisions)
            .values({
              ...decision,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            .returning();
        } else {
          console.log(`Decision with case number ${decision.caseNumber} already exists, skipping`);
        }
      } catch (error) {
        console.error(`Error adding judicial decision ${decision.title}:`, error);
      }
    }

    console.log(`Added ${judicialDecisions.length} judicial decisions`);

    // Seed Labor Contracts
    const laborContracts = [
      {
        title: "Standard Employment Agreement",
        contractType: "Employment",
        industry: "General",
        pages: 12,
        description: "Comprehensive employment contract template suitable for full-time employees across various industries. Includes detailed sections on duties, compensation, benefits, and termination procedures.",
        content: "Full contract content would be here",
        tags: ["employment", "full-time", "standard"],
        downloads: 428
      },
      {
        title: "Remote Work Agreement",
        contractType: "Remote Work",
        industry: "Technology",
        pages: 8,
        description: "Template for establishing remote work arrangements, including equipment provisions and performance expectations. Ideal for technology companies with distributed teams.",
        content: "Full contract content would be here",
        tags: ["remote", "work-from-home", "technology"],
        downloads: 612
      },
      {
        title: "Non-Disclosure Agreement",
        contractType: "Confidentiality",
        industry: "All Industries",
        pages: 5,
        description: "Comprehensive NDA template to protect proprietary information and trade secrets in employment relationships. Customizable for various industries and information types.",
        content: "Full contract content would be here",
        tags: ["confidentiality", "intellectual property", "trade secrets"],
        downloads: 384
      },
      {
        title: "Independent Contractor Agreement",
        contractType: "Consulting",
        industry: "Professional Services",
        pages: 10,
        description: "Template for engaging independent contractors with clear terms on deliverables, payment, and intellectual property. Includes provisions for project-based work and milestone payments.",
        content: "Full contract content would be here",
        tags: ["contractor", "consulting", "professional services"],
        downloads: 276
      },
      {
        title: "Separation Agreement",
        contractType: "Termination",
        industry: "All Industries",
        pages: 7,
        description: "Template for documenting mutual agreement on employment termination, including severance and confidentiality terms. Designed to protect both employer and employee interests during separation.",
        content: "Full contract content would be here",
        tags: ["termination", "severance", "separation"],
        downloads: 195
      },
      {
        title: "Collective Bargaining Template",
        contractType: "Collective",
        industry: "Manufacturing",
        pages: 18,
        description: "Framework for negotiating and documenting agreements between employers and organized labor representatives. Includes sections on working conditions, compensation, and dispute resolution.",
        content: "Full contract content would be here",
        tags: ["unions", "labor relations", "collective agreement"],
        downloads: 147
      }
    ];

    for (const contract of laborContracts) {
      try {
        // Check if record already exists
        const existing = await db.query.laborContracts.findFirst({
          where: (table, { eq }) => eq(table.title, contract.title)
        });
        
        if (!existing) {
          await db
            .insert(schema.laborContracts)
            .values({
              ...contract,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            .returning();
        } else {
          console.log(`Contract with title ${contract.title} already exists, skipping`);
        }
      } catch (error) {
        console.error(`Error adding labor contract ${contract.title}:`, error);
      }
    }

    console.log(`Added ${laborContracts.length} labor contracts`);

    // Seed AI Insights
    const aiInsights = [
      {
        title: "Trending Legal Topic",
        content: "Remote work regulations show increased litigation in the past quarter.",
        documentType: null,
        documentId: null,
        insightType: "dashboard",
        createdAt: new Date()
      },
      {
        title: "Document Recommendation",
        content: "Based on your recent searches, you might be interested in 'Healthcare Industry Labor Agreements'.",
        documentType: null,
        documentId: null,
        insightType: "dashboard",
        createdAt: new Date()
      },
      {
        title: "Case Outcome Prediction",
        content: "Similar cases to 'Smith v. Acme Corp' have a 73% favorable outcome rate for employees.",
        documentType: null,
        documentId: null,
        insightType: "dashboard",
        createdAt: new Date()
      },
      {
        title: "Acme Corp. Employment Contract Analysis",
        content: "3 potential compliance issues found in Section 8 regarding overtime compensation.",
        documentType: "contract",
        documentId: 1,
        insightType: "analysis",
        createdAt: new Date()
      },
      {
        title: "Smith v. Medical Center Case Summary",
        content: "5 relevant precedents identified that strongly support the plaintiff's position.",
        documentType: "judicial",
        documentId: 3,
        insightType: "summary",
        createdAt: new Date()
      },
      {
        title: "NDA Compliance Analysis",
        content: "The non-disclosure provisions have been compared against 3 legal standards and found to be compliant.",
        documentType: "contract",
        documentId: 3,
        insightType: "analysis",
        createdAt: new Date()
      }
    ];

    for (const insight of aiInsights) {
      await db
        .insert(schema.aiInsights)
        .values(insight)
        .onConflictDoNothing()
        .returning();
    }

    console.log(`Added ${aiInsights.length} AI insights`);

    // Seed User Favorites and History
    if (user?.id) {
      // Add some favorites
      await db
        .insert(schema.userFavorites)
        .values([
          {
            userId: user.id,
            documentType: "judicial",
            documentId: 1,
            createdAt: new Date()
          },
          {
            userId: user.id,
            documentType: "judicial",
            documentId: 2,
            createdAt: new Date()
          },
          {
            userId: user.id,
            documentType: "contract",
            documentId: 1,
            createdAt: new Date()
          },
          {
            userId: user.id,
            documentType: "contract",
            documentId: 2,
            createdAt: new Date()
          }
        ])
        .onConflictDoNothing()
        .returning();
      
      console.log("Added user favorites");

      // Add user history
      await db
        .insert(schema.userHistory)
        .values([
          {
            userId: user.id,
            documentType: "judicial",
            documentId: 1,
            action: "viewed",
            createdAt: new Date()
          },
          {
            userId: user.id,
            documentType: "judicial",
            documentId: 2,
            action: "downloaded",
            createdAt: new Date(Date.now() - 86400000) // yesterday
          },
          {
            userId: user.id,
            documentType: "contract",
            documentId: 1,
            action: "viewed",
            createdAt: new Date(Date.now() - 172800000) // 2 days ago
          },
          {
            userId: user.id,
            documentType: "contract",
            documentId: 2,
            action: "downloaded",
            createdAt: new Date(Date.now() - 345600000) // 4 days ago
          },
          {
            userId: user.id,
            documentType: "judicial",
            documentId: 3,
            action: "searched",
            createdAt: new Date(Date.now() - 604800000) // 7 days ago
          }
        ])
        .onConflictDoNothing()
        .returning();
      
      console.log("Added user history");

      // Add notifications
      await db
        .insert(schema.notifications)
        .values([
          {
            userId: user.id,
            title: "New labor contract template added",
            read: false,
            createdAt: new Date(Date.now() - 7200000) // 2 hours ago
          },
          {
            userId: user.id,
            title: "Updated judicial decision",
            read: false,
            createdAt: new Date(Date.now() - 86400000) // 1 day ago
          },
          {
            userId: user.id,
            title: "AI generated summary available",
            read: true,
            createdAt: new Date(Date.now() - 259200000) // 3 days ago
          }
        ])
        .onConflictDoNothing()
        .returning();
      
      console.log("Added notifications");
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
