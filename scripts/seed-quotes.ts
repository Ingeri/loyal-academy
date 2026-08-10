import { prisma } from "../lib/prisma";

const draftQuotes = [
  {
    authorName: "Jane Uwase",
    authorRole: "Alumni, Class of 2023",
    content:
      "Leadership begins with the courage to serve others before yourself.",
  },
  {
    authorName: "Emmanuel Niyonzima",
    authorRole: "Instructor",
    content:
      "Every skill we teach here is a seed for someone else's future.",
  },
  {
    authorName: "Grace Mukamana",
    authorRole: "Student",
    content:
      "I came here to learn leadership. I left knowing how to lead myself first.",
  },
  {
    authorName: "David Habimana",
    authorRole: "Career Advisor",
    content:
      "Character and competence together are what turn potential into impact.",
  },
  {
    authorName: "Aline Iradukunda",
    authorRole: "Program Coordinator",
    content:
      "Growth happens in the room where people are honest about their weaknesses.",
  },
  {
    authorName: "Patrick Nkurunziza",
    authorRole: "Instructor",
    content: "The best leaders I know are the best listeners I know.",
  },
];

async function main() {
  for (const quote of draftQuotes) {
    await prisma.quote.create({
      data: {
        authorName: quote.authorName,
        authorRole: quote.authorRole,
        content: quote.content,
        status: "PENDING",
        featured: false,
      },
    });
    console.log(`Created draft quote for ${quote.authorName}`);
  }

  console.log(`\nDone. ${draftQuotes.length} draft quotes added.`);
  console.log("Go to /admin/quotes to review, approve, and feature them.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 