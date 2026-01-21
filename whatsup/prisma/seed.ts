import { PrismaClient, PageType } from "@prisma/client";

const prisma = new PrismaClient();

const initialFbPages = {
  admin: [
    {
      name: "University of the Philippines Cebu",
      image: "/upcebu.jpg",
      link: "https://www.facebook.com/upcebuofficial",
    },
    {
      name: "UP Cebu Office of the University Registrar",
      image: "/our.jpg",
      link: "https://www.facebook.com/our.upcebu",
    },
    {
      name: "UP Cebu Office of Student Affairs",
      image: "/osa.jpg",
      link: "https://www.facebook.com/osa.upcebu",
    },
    {
      name: "UP Cebu Teaching and Learning Resource Center",
      image: "/tlrc.jpg",
      link: "https://www.facebook.com/upcebutlrc",
    },
  ],
  organizations: [
    {
      name: "UP Cebu University Student Council",
      image: "/upcusc.jpg",
      link: "https://www.facebook.com/upcebuofficial",
    },
    {
      name: "Unified Student Organizations",
      image: "/uniso.jpg",
      link: "https://www.facebook.com/upcuniso ",
    },
    {
      name: "UP Cebu Tug-Ani",
      image: "/tugani.jpg",
      link: "https://www.facebook.com/upcebutugani",
    },
  ],
  federations: [
    {
      name: "UP Cebu Sciences Federation",
      image: "/scions.jpg",
      link: "https://www.facebook.com/upcebuofficial",
    },
    {
      name: "UP Cebu College of Social Sciences",
      image: "/socsci.jpg",
      link: "https://www.facebook.com/upcebusocsci",
    },
    {
      name: "UP Cebu College of Communication Art and Design",
      image: "/ccad.jpg",
      link: "https://www.facebook.com/ccadupcebu",
    },
    {
      name: "UP Cebu School of Management",
      image: "/som.jpg",
      link: "https://www.facebook.com/upcebusom",
    },
  ],
  academic: [],
};

async function main() {
  console.log("Start seeding Facebook Pages...");

  const getPageType = (key: string): PageType => {
    switch (key) {
      case "admin":
        return PageType.ADMIN;
      case "organizations":
        return PageType.ORGANIZATION;
      case "federations":
        return PageType.FEDERATION;
      case "academic":
        return PageType.ACADEMIC;
      default:
        return PageType.INTEREST;
    }
  };

  for (const [category, pages] of Object.entries(initialFbPages)) {
    const type = getPageType(category);

    for (const page of pages) {
      await prisma.fBPage.upsert({
        where: { pageName: page.name },
        update: {
          url: page.link,
          image: page.image,
          type: type,
        },
        create: {
          pageName: page.name,
          url: page.link,
          image: page.image,
          type: type,
        },
      });
      console.log(`Created/Updated: ${page.name}`);
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
